# Friends-System Backend Microservice README.md

### Index: 
* [1. Friends-System REST API Endpoints Documentation](#1-friends-system-rest-api-endpoints-documentation)
* [2. SSE Event Contract Documentation](#2-sse-event-contract-documentation)
* [3. Local testing guide (via test.html)](#3-local-testing-guide-via-testhtml)


## 1. Friends-System REST API Endpoints Documentation

| Method | Path | Purpose |
|---|---|---|
| POST | `/friend-requests` | send a friend request — body: `{ senderId, receiverId }` |
| GET | `/friend-requests/received?uuid=` | client's inbox — pending incoming requests |
| GET | `/friend-requests/sent?uuid=` | requests the client has sent, any status |
| POST | `/friend-requests/:id/accept` | accept a pending request (`:id` = the request's own row id) |
| POST | `/friend-requests/:id/reject` | reject a pending request (`:id` = the request's own row id) |
| GET | `/friends?uuid=` | list of client's friends' UUIDs |
| DELETE | `/friends/:friendUuid?uuid=` | remove a friend — silent, the removed side is not notified |
| GET | `/events?uuid=` | SSE stream — push live notifications (new friend request, accepted, rejected, friends list changes) |


Main objectives in friends-system
- **Query(read):** see full friend list (list of uuids)
- **Action(write):** accept/reject a pending friend request
- **Action(write):** send a friend request
- **Action(write):** remove a friend
- **Live notifications** via SSE


## 2. SSE Event Contract Documentation
> Clients connect once via GET /events?uuid=<yourUuid> and receive these events pushed down that connection. <br>
> Frontend notes: This is the full list of everything sent on /events.

### 1. event: "connected"
- data: "ok"
- Fired once, immediately after the connection opens. 
- No action needed beyond confirming the connection is live.

### 2. event: "friend_request_received"
- data: { id: string, senderId: string, receiverId: string, status: "Pending", createdAt: string }
- Fired to the RECEIVER when someone sends them a new friend request.
- The full friend request object is included — no extra fetch is required to get its contents, though re-fetching the inbox is still fine.

### 3. event: "friend_request_accepted"
- data: { by: string, requestId: string }
- Fired to the ORIGINAL SENDER when the receiver accepts. `by` is the uuid of the person who accepted.

### 4. event: "friend_request_rejected"
- data: { by: string, requestId: string }
- Fired to the ORIGINAL SENDER when the receiver rejects. `by` is the uuid of the person who rejected.

### 5. event: "friends_list_updated"
- data: { newFriend?: string } | { removedFriend?: string } | {}
- Fired whenever a friendship is added or removed. Payload varies:
    - `newFriend` present  -> that uuid was just added to your friends
    - `removedFriend` present -> that uuid was just removed from your list
    	- only sent to the person who INITIATED the removal. 
		- the removed side is never notified, by design
- In all cases, treat this as a signal to re-call GET /friends rather than relying solely on the payload, since it's the authoritative source.



## 3. Local testing guide (via test.html)

The tester works identically whether the service is running against the in-memory placeholder or real Postgres — it only ever talks to the REST/SSE contract above, never the storage layer directly.

### **Basic walkthrough**
- Open `test.html` in two browser tabs with different UUIDs.
- Register a UUID in each tab and click Connect — watch each tab open its own SSE connection.
- Send a friend request from one tab, watch it appear live in the other's inbox.
- Accept or reject — on accept, both UUIDs appear in each other's friends list.

### **Stress tests**

| # | Scenario | Expected result |
|---|---|---|
| 1 | Sender resends a friend request while the current one is still pending | Rejected — "request already pending" |
| 2 | Receiver tries to send a request back to the sender, while the sender's original request is still pending | Rejected — told to respond to the existing request instead |
| 3 | After a request is sent, both UUIDs disconnect and reconnect (simulating logout/login) | The pending request is still there after reconnecting |
| 4 | Connect the same UUID multiple times (same tab) | Refused — "already connected, disconnect first" |
| 5 | Disconnect the same UUID multiple times | Refused gracefully — "already disconnected" |
| 6 | Connect the same UUID on multiple tabs simultaneously | ⚠️ Known bug — both tabs' logs increment SSE connections non-stop |
| 7 | Perform an action while the other user is disconnected, or disconnects immediately after | Action still completes; the disconnected user catches up once reconnected |
| 8.0 | User A removes User B | B's friends list also auto-removes A (slight SSE lag; not a concern for friend removals) |
| 8.1 | User removes a friend, then stays idle | Friend's list *eventually* reflects the removal (poll interval) |
| 8.2 | User removes a friend, then refreshes their own list | Friend's list *eventually* reflects the removal |
| 8.3 | User removes a friend, then the friend refreshes their own list | Removal reflected **instantly** |
| 9 | User receives a pending request, opens a duplicate tab, accepts on the new tab, then accepts again on the original tab | Second accept correctly rejected — *(re-test once integrated with auth, since auth guarantees only 1 session)* |