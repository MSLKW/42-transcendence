# 🧩 Friends Backend Microservice

### Index
* [1. Endpoint Overview](#1-endpoint-overview)
* [2. REST API Detailed Documentation](#2-rest-api-detailed-documentation)
* [3. SSE Event Contract](#3-sse-event-contract)
* [4. Local Testing Guide (via tester.html)](#4-local-testing-guide-via-testhtml)

---

## 1. Endpoint Overview

> 📌 **Convention:** `:param` in the path = identifies *who/which resource*. Required, part of the URL.
> Query strings (`?key=`) are reserved for optional filters/sorting — this service currently has none.

> ⚠️ **Auth status:** only `GET /events` verifies the session today (via the auth service). The REST endpoints below still trust the UUIDs they are given.

| Method | Path | Purpose |
|---|---|---|
| `POST` | [`/friend-requests`](#post-friend-requests) | Send a friend request |
| `GET` | [`/friend-requests/received/:receiverUuid`](#get-friend-requestsreceivedreceiveruuid) | List pending requests received by this user |
| `GET` | [`/friend-requests/sent/:senderUuid`](#get-friend-requestssentsenderuuid) | List all requests sent by this user (any status) |
| `POST` | [`/friend-requests/:requestId/accept`](#post-friend-requestsrequestidaccept) | Accept a pending request |
| `POST` | [`/friend-requests/:requestId/reject`](#post-friend-requestsrequestidreject) | Reject a pending request |
| `GET` | [`/friendships/:ownerUuid`](#get-friendshipsowneruuid) | List this user's friends (UUIDs) |
| `DELETE` | [`/friendships/:ownerUuid/:friendUuid`](#delete-friendshipsowneruuidfrienduuid) | Remove a friend (silent — other side isn't notified) |
| `GET` | [`/events`](#3-sse-event-contract) | Open an SSE stream for live notifications (user identified by the session cookie) |

**Main objectives:**
- 🔍 **Read:** full friends list
- ✍️ **Write:** send / accept / reject a friend request, remove a friend
- 📡 **Live:** push notifications via SSE

---

## 2. REST API Detailed Documentation

### `POST /friend-requests`
Send a friend request.

**Body:**
```json
{ "senderId": "uuid", "receiverId": "uuid" }
```
> ⚠️ Both UUIDs go in the body, not the URL — nothing exists yet to "address" at request time. This is pure creation.

**Success — `201 Created`:**
```json
{
  "id": "uuid",
  "senderId": "uuid",
  "receiverId": "uuid",
  "status": "Pending",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

**Errors:**
| Status | When |
|---|---|
| `400` | `senderId`/`receiverId` missing, malformed, or `senderId === receiverId` |
| `404` | `receiverId` does not exist (FK violation) |
| `409` | Already friends, a request is already pending either direction, or a duplicate exists. When the *other* person already sent a request to you, the response includes `requestId` so the frontend can prompt "respond to it instead" |
| `500` | Unexpected server error |

---

### `GET /friend-requests/received/:receiverUuid`
List this user's **pending, incoming** friend requests (their inbox).

**Success — `200 OK`:**
```json
[
  {
    "id": "uuid",
    "senderId": "uuid",
    "receiverId": "uuid",
    "status": "Pending",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

**Errors:** `400` if `receiverUuid` is missing or malformed.

---

### `GET /friend-requests/sent/:senderUuid`
List **all** requests this user has sent, regardless of status (`Pending` / `Accepted` / `Rejected`).

**Success — `200 OK`:** same shape as above (array of friend-request objects, all statuses included).

**Errors:** `400` if `senderUuid` is missing or malformed.

---

### `POST /friend-requests/:requestId/accept`
Accept a pending request. `:requestId` is the friend-request row's own id (**not** a user UUID).

**Success — `200 OK`:**
```json
{ "id": "uuid", "senderId": "uuid", "receiverId": "uuid", "status": "Accepted", "createdAt": "..." }
```
Side effects: creates the friendship both ways, auto-closes any reverse-direction pending request, and fires `friend_request_accepted` + two `friends_list_updated` SSE events (see [§3](#3-sse-event-contract)).

**Errors:**
| Status | When |
|---|---|
| `400` | `requestId` missing or malformed |
| `404` | No request with that id |
| `409` | Request was already `Accepted`/`Rejected` — irreversible |

---

### `POST /friend-requests/:requestId/reject`
Reject a pending request. Same param and error rules as `accept`, but sets status to `Rejected` and fires `friend_request_rejected` instead — no friendship is created.

---

### `GET /friendships/:ownerUuid`
List a user's friends.

**Success — `200 OK`:**
```json
["uuid-1", "uuid-2", "uuid-3"]
```
Just an array of friend UUIDs — no nested objects.

**Errors:** `400` if `uuid` is missing or malformed.

---

### `DELETE /friendships/:ownerUuid/:friendUuid`
Remove `friendUuid` from `uuid`'s friend list.

**Success — `204 No Content`** (empty body).

**Errors:**
| Status | When |
|---|---|
| `400` | Either UUID missing or malformed |
| `404` | No friendship existed between them (e.g. already removed by the other side) |

> ⚠️ **Silent by design** — the removed side (`friendUuid`) is **not** notified via SSE. Only the initiator gets a `friends_list_updated` event. See stress test 8.0–8.3 in [§4](#4-local-testing-guide-via-testhtml) for how the other side eventually catches up.

---

## 3. SSE Event Contract

> Clients connect once via `GET /events` and receive every event below pushed down that one connection.
> 🔐 There is **no UUID in the URL**: the user is identified by the `session_token` cookie, which this service checks with the auth service (`/validate`) before opening the stream.
> ✅ **One live connection per user** — connecting again as the same user closes the previous connection (see `replaced` below). Multi-tab/multi-device fan-out is not supported by design.


### Connecting (frontend)

```js
const es = new EventSource("/api/friends/events", { withCredentials: true });
```
`withCredentials: true` only matters if the frontend is on a different origin than the API; in that case the server's CORS config must also allow that exact origin with `credentials: true`.

### Errors on connect

| Status | When |
|---|---|
| `401` | Cookie missing, or auth says the session is invalid/expired (auth's status and message are passed through) |
| `502` | Auth answered OK but with an unexpected body |
| `503` | Auth service unreachable or timed out |

> ⚠️ The browser's `EventSource` does **not** auto-retry after any of these (`readyState` becomes `CLOSED`, and it never exposes the status code). The frontend must handle `onerror` and reconnect itself, e.g. after a delay, or send the user to login. Network blips on an *already open* stream still retry automatically.

### Events

| Event | Fired to | Payload |
|---|---|---|
| `connected` | the connecting client | `"ok"` — confirms the stream is live |
| `replaced` | the **old** connection, right before it's closed | a short text message |
| `friend_request_received` | receiver | full friend-request object (see [`POST /friend-requests`](#post-friend-requests)) |
| `friend_request_accepted` | original sender | `{ "by": "uuid", "requestId": "uuid" }` |
| `friend_request_rejected` | original sender | `{ "by": "uuid", "requestId": "uuid" }` |
| `friends_list_updated` | varies (see below) | `{ "newFriend"?: "uuid" }` or `{ "removedFriend"?: "uuid" }` or `{}` |

**Notes:**
- `friends_list_updated`'s `removedFriend` field is only ever sent to the person who *initiated* the removal — the removed side never gets an event (matches the silent-delete behavior of `DELETE /friendships/:ownerUuid/:friendUuid`).
- Treat every `friends_list_updated` event as a signal to re-fetch `GET /friendships/:ownerUuid` rather than trusting the payload alone — it's a hint, not the source of truth.
- **`replaced` handling is a frontend responsibility.** On receiving it, the client must call `.close()` on its own `EventSource` — the server ending the connection is not enough by itself, or the browser's default auto-reconnect will fight the server in an infinite evict loop. See `tester.html`'s `replaced` listener for the reference implementation.
- **Heartbeat:** the server writes a `: ping` comment line about every 25 s so idle connections aren't dropped by proxies/networks. Browsers ignore comment lines, so the frontend does nothing.
- **The session is checked once, when the stream opens.** The server does not close an open stream if the session later expires or the user logs out, so the frontend must call `.close()` on logout.

---

## 4. Local Testing Guide (via tester.html)

Works identically against the in-memory placeholder or real Postgres — `tester.html` only ever talks to the REST/SSE contract above (plus auth's `/validate`, to look up who is signed in), never the storage layer directly.

### Before you start
- Run the stack so that `http://localhost/api/friends` and `http://localhost/api/auth` (through nginx) both work.
- Open the tester from the same origin as the API (`http://localhost`). The session cookie is `SameSite=strict`, so a page from another origin (e.g. a `file://` page) won't have it sent.
- Sign in first (e.g. on the website). The tester gets your UUID from the session — there's nothing to type.
- **Tabs in the same browser share one session cookie, so they are the same user.** To test with two different users, use two different browsers (or a normal window plus a private window), each signed in as a different user.

### Basic walkthrough
1. Sign in as user A in one browser and as user B in another (or a private window), and open `tester.html` in each.
2. Click **Connect** in each — every one opens its own SSE connection, and the UUID box fills in from the session.
3. Send a friend request from one browser — watch it appear live in the other's inbox.
4. Accept or reject — on accept, both UUIDs appear in each other's friends list.

### Stress tests

| # | Scenario | Expected result |
|---|---|---|
| 1 | Sender resends a request while the current one is still pending | Rejected — `"request already pending"` |
| 2 | Receiver tries to send a request back while the sender's original is still pending | Rejected — told to respond to the existing request instead |
| 3 | After sending a request, both users disconnect and reconnect (logout/login) | The pending request is still there after reconnecting |
| 4 | Click Connect multiple times as the same user (same tab) | Refused — `"already connected, disconnect first"` |
| 5 | Disconnect the same user multiple times | Refused gracefully — `"already disconnected"` |
| 6 | Connect the same user in multiple tabs simultaneously (tabs of one browser share the session) | ✅ The newest connection replaces the old one (`replaced` event); no infinite reconnect loop |
| 7 | Perform an action while the other user is disconnected, or disconnects right after | Action still completes; the disconnected user catches up once reconnected |
| 8.0 | User A removes User B | B's friends list also auto-removes A (slight SSE lag; not a concern for friend removals) |
| 8.1 | User removes a friend, then stays idle | Friend's list *eventually* reflects the removal (poll interval) |
| 8.2 | User removes a friend, then refreshes their own list | Friend's list *eventually* reflects the removal |
| 8.3 | User removes a friend, then the friend refreshes their own list | Removal reflected **instantly** |
| 9 | User gets a pending request, opens a duplicate tab, accepts on the new tab, then accepts again on the original | Second accept correctly rejected — *(re-test now that auth is integrated, since auth guarantees only 1 session)* |
| 10 | Click Connect while signed out (no session cookie) | Refused — tester logs "Not logged in"; no SSE stream is opened |
| 11 | Sign out (or let the session expire), then connect directly to `/events` | `401`; `EventSource` ends up `CLOSED` and does not retry (check the Network tab for the status) |
| 12 | Stop the auth service, then click Connect | Tester can't reach auth; a direct `/events` request gets `503` |