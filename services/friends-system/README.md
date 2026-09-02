# Friends-System Backend Microservice README.md

### Index: 
* [1. Friends-System REST API Endpoints Documentation](#1-friends-system-rest-api-endpoints-documentation)
* [2. SSE Event Contract Documentation](#2-sse-event-contract-documentation)
* [3. Minimal working version (no DB yet. Tester runs on in-memory)](#3-minimal-working-version-no-db-yet-tester-runs-on-in-memory)


## 1. Friends-System REST API Endpoints Documentation

| Method | Path | Purpose |
|---|---|---|
| POST | `/friend-requests` | client send a friend request `{ toUuid }` |
| GET | `/friend-requests` | client's inbox — pending incoming requests |
| POST | `/friend-requests/:id/accept` | accept |
| POST | `/friend-requests/:id/reject` | reject |
| GET | `/friends` | list of client's friends' UUIDs |
| GET | `/events` | SSE stream — push live notifications (new friend request, accepted, online/offline) |

Main objectives in friends-system
- getter to see your own friends
- accept/reject
- send req
- live noti via SSE.



## 2. SSE Event Contract Documentation
> Clients connect once via GET /events?uuid=<yourUuid> and receive these events pushed down that connection. <br>
> Frontend notes: This is the full list of everything sent on /events.

### 1. event: "connected"
- data: "ok"
- Fired once, immediately after the connection opens. 
- No action needed beyond confirming the connection is live.

### 2. event: "friend_request_received"
- data: { id: string, senderId: string, receiverId: string, fReqStatus: "Pending", createdAt: string }
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



## 3. Minimal working version (no DB yet. Tester runs on in-memory)
### **Test operation guide, refer the logs**
- Open `test.html` in two browser tabs with different UUIDs.
- Register uuid, watch it registered a SSE connection for each UUID
- Send a friend request from one, watch it appear live in the other's console/alert.
- Reciever accept/reject friend request, both are added into each other's friend list.

### **Stress tests**
- **1:** Sender resend a friend request while current is pending
- **2:** Reciever try to send friend request to the sender , while the same sender's friend request is pending
- **3:** After friend request sent, test both uuid logout & re-login (disconnect & connect), and the pending friend request is still there.
- **4:** Connect the same UUID multiple times. 
- **5:** Disconnect the same UUID multiple times. 
- **6:** Connect the same UUID on multiple tabs *(!! Bugs, both tabs' logs increment SSE connections non-stop)*
- **7:** Do various actions while the either one user is disconnected or immediately disconnected after the action made.
- **8.0:** After A remove B from friend list, B's friend list will also auto remove A (its a bit laggy using SSE, but latency is not the biggest concern for friend removals)
- **8.1:** User remove friend and idle -> friend's friends list will __eventually__ remove the user too
- **8.2:** User remove friend and refresh user's friends list -> friend's friends list will __eventually__ remove the user too
- **8.3:** User remove friend and refresh friend's friends list -> friend's friends list will **instantly** remove the user too.
- **9:** User recieve pending friend request, duplicate a new tab, and accept on the new tab, then accept on the original tab *(need to test this when integrate with auth later since auth guarantees 1 session only)*