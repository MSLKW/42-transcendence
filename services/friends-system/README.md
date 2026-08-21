

## Friends-system endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/friend-requests` | send a friend request `{ toUuid }` |
| GET | `/friend-requests` | your inbox — pending incoming requests |
| POST | `/friend-requests/:id/accept` | accept |
| POST | `/friend-requests/:id/reject` | reject |
| GET | `/friends` | list of your friends' UUIDs |
| GET | `/events` | SSE stream — push live notifications (new request, accepted, online/offline) |

That's it. No overkill — this matches "getter to see your own friends," "accept/reject," "send req," "live noti via SSE."

## Minimal working version (no DB yet — in-memory, matches your Friday goal)
Open `test.html` in two browser tabs with different UUIDs — send a request from one, watch it appear live in the other's console/alert. That's your whole demo, no database required.