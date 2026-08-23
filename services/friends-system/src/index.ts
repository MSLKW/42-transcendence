// src/index.ts
import express from "express";
import crypto from "crypto";
import cors from "cors";


const app = express();
app.use(express.json());

// app.use((req, res, next) => { res.set("Access-Control-Allow-Origin", "*"); next(); }); // dev only
app.use(cors());


// ---- 1. in-memory "database" (same shape as the real schema, swap later) ----
type Status = "pending" | "accepted" | "rejected";
interface FriendRequest { id: string; senderId: string; receiverId: string; status: Status; createdAt: string; }
const friendRequests: FriendRequest[] = [];
const friendships: { a: string; b: string }[] = []; // unordered pair, always store sorted

// one connection per uuid, strictly enforced (see /events below)
// const sseClients: Record<string, express.Response[]> = {};
const sseClients: Record<string, express.Response> = {};


function pairKey(a: string, b: string) { return [a, b].sort().join("|"); }
function areFriends(a: string, b: string) {
  return friendships.some(f => pairKey(f.a, f.b) === pairKey(a, b));
}
function notify(uuid: string, event: string, data: any) {
  // (sseClients[uuid] || []).forEach(res => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
  const res = sseClients[uuid];
  if (res) res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// ---- 2. SSE — exactly one live connection per uuid ----
app.get("/events", (req, res) => {
  const uuid = req.query.uuid as string;
  // new addition - prevents uuid to be null 
    if (!uuid) 
      return res.status(400).end();

  // if this uuid already has a connection open, close it first — enforces "1 uuid, 1 connection"
  const existing = sseClients[uuid];
  if (existing) 
    existing.end();
  //
  res.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
  res.flushHeaders();
  // sseClients[uuid] = sseClients[uuid] || [];
  // sseClients[uuid].push(res);
  //
    sseClients[uuid] = res;
  //
  res.write(`event: connected\ndata: "ok"\n\n`);
  // req.on("close", () => { sseClients[uuid] = (sseClients[uuid] || []).filter(r => r !== res); });
  //
  req.on("close", () => {
    // only delete if this response object is still the current one for that uuid
    // (avoids a race where a newer connection's cleanup gets wiped by an older one closing late)
    if (sseClients[uuid] === res) delete sseClients[uuid];
  });
  //
});


// ---- 3. send request ----
// app.post("/friend-requests", (req, res) => {
//   const { senderId, receiverId } = req.body;
//   if (senderId === receiverId) return res.status(400).json({ error: "cannot friend yourself" });
//   if (areFriends(senderId, receiverId)) return res.status(409).json({ error: "already friends" });
//   const existing = friendRequests.find(r => r.senderId === senderId && r.receiverId === receiverId && r.status === "pending");
//   if (existing) return res.status(409).json({ error: "request already pending" });

//   const request: FriendRequest = { id: crypto.randomUUID(), senderId, receiverId, status: "pending", createdAt: new Date().toISOString() };
//   friendRequests.push(request);
//   notify(receiverId, "friend_request_received", request);
//   res.status(201).json(request);
// });
app.post("/friend-requests", (req, res) => {
  const { senderId, receiverId } = req.body;
  //
  
  // bug 6: reject empty/missing uuids outright, before any lookup logic runs
  if (!senderId || !receiverId || typeof receiverId !== "string" || receiverId.trim() === "") {
    return res.status(400).json({ error: "a valid receiver uuid is required" });
  }
  //
  if (senderId === receiverId) return res.status(400).json({ error: "cannot friend yourself" });

  // TODO: Check if friendUUID exist in Postgres
  // const receiverExists = await .......
  // if (!receiverExists) return res.status(404).json({ error: "no such user" });

  if (areFriends(senderId, receiverId)) return res.status(409).json({ error: "already friends" });
 
  const existingSameDirection = friendRequests.find(r => r.senderId === senderId && r.receiverId === receiverId && r.status === "pending");
  if (existingSameDirection) return res.status(409).json({ error: "request already pending" });
 
  // the other person already sent YOU a request — you can't send a separate one, only respond to theirs
  const reverseRequest = friendRequests.find(r => r.senderId === receiverId && r.receiverId === senderId && r.status === "pending");
  if (reverseRequest) return res.status(409).json({ error: "they already sent you a request — respond to it instead", requestId: reverseRequest.id });
 
  const request: FriendRequest = { id: crypto.randomUUID(), senderId, receiverId, status: "pending", createdAt: new Date().toISOString() };
  friendRequests.push(request);
  notify(receiverId, "friend_request_received", request);
  res.status(201).json(request);
});


// ---- 4. inbox: requests received, pending ----
app.get("/friend-requests/received", (req, res) => {
  const uuid = req.query.uuid as string;
  res.json(friendRequests.filter(r => r.receiverId === uuid && r.status === "pending"));
});


// ---- 5. requests I sent ----
app.get("/friend-requests/sent", (req, res) => {
  const uuid = req.query.uuid as string;
  res.json(friendRequests.filter(r => r.senderId === uuid));
});


// ---- 6. accept ----
// app.post("/friend-requests/:id/accept", (req, res) => {
//   const request = friendRequests.find(r => r.id === req.params.id);
//   if (!request) return res.status(404).end();
//   request.status = "accepted";
//   friendships.push({ a: request.senderId, b: request.receiverId });
//   notify(request.senderId, "friend_request_accepted", { by: request.receiverId, requestId: request.id });
//   notify(request.receiverId, "friends_list_updated", { newFriend: request.senderId });
//   notify(request.senderId, "friends_list_updated", { newFriend: request.receiverId });
//   res.json(request);
// });
app.post("/friend-requests/:id/accept", (req, res) => {
  const request = friendRequests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).end();
//
  // bug 8: irreversible — can only accept a request that is still pending
  if (request.status !== "pending") {
    return res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
  }
//
  request.status = "accepted";

  // avoid creating a duplicate row if a reverse request gets accepted too
  if (!areFriends(request.senderId, request.receiverId)) {
    friendships.push({ a: request.senderId, b: request.receiverId });
  }
  // any other pending request between the same two people is now redundant — auto-close it
  friendRequests
    .filter(r => r.status === "pending" && pairKey(r.senderId, r.receiverId) === pairKey(request.senderId, request.receiverId))
    .forEach(r => { r.status = "accepted"; });

  notify(request.senderId, "friend_request_accepted", { by: request.receiverId, requestId: request.id });
  notify(request.receiverId, "friends_list_updated", { newFriend: request.senderId });
  notify(request.senderId, "friends_list_updated", { newFriend: request.receiverId });
  res.json(request);
});


// ---- 7. reject ----
app.post("/friend-requests/:id/reject", (req, res) => {
  const request = friendRequests.find(r => r.id === req.params.id);
  if (!request) return res.status(404).end();
  //

  // bug 8: irreversible — can only reject a request that is still pending
  if (request.status !== "pending") {
    return res.status(409).json({ error: `this request was already ${request.status} — it can't be changed` });
  }

  //
  request.status = "rejected";
  notify(request.senderId, "friend_request_rejected", { by: request.receiverId, requestId: request.id });
  res.json(request);
});


// ---- 8. friends list ----
app.get("/friends", (req, res) => {
  const uuid = req.query.uuid as string;
  const friends = friendships
    .filter(f => f.a === uuid || f.b === uuid)
    .map(f => (f.a === uuid ? f.b : f.a));
  res.json(friends);
});


// ---- 9. remove friend (silent — no notification to the removed friend) ----
// app.delete("/friends/:friendUuid", (req, res) => {
//   const uuid = req.query.uuid as string;
//   const friendUuid = req.params.friendUuid;
//   const idx = friendships.findIndex(f => pairKey(f.a, f.b) === pairKey(uuid, friendUuid));
//   if (idx === -1) return res.status(404).end();
//   friendships.splice(idx, 1);
//   // intentionally no notify() call to friendUuid — removal is silent
//   notify(uuid, "friends_list_updated", { removedFriend: friendUuid });
//   res.status(204).end();
// });
app.delete("/friends/:friendUuid", (req, res) => {
  const uuid = req.query.uuid as string;
  const friendUuid = req.params.friendUuid;
  const before = friendships.length;
  for (let i = friendships.length - 1; i >= 0; i--) {
    if (pairKey(friendships[i].a, friendships[i].b) === pairKey(uuid, friendUuid)) {
      friendships.splice(i, 1);
    }
  }
  if (friendships.length === before) return res.status(404).end();
  notify(uuid, "friends_list_updated", { removedFriend: friendUuid });
  res.status(204).end();
});


app.listen(3000, () => console.log("friends-system on :3000"));