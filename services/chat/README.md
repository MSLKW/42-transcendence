# Chat Service

The `chat` service provides real-time chat for Big2 parties. It uses Socket.IO rooms for live messages and presence, and an in-memory party roster to decide which users may share a room. Chat messages are broadcast live; the service does not store message history.

## Features

- Authenticate Socket.IO connections by validating the session cookie or handshake token with the authentication service.
- Create, update, and delete party chat whitelists through HTTP endpoints.
- Assign each connected user to their party room, or to a private solo room when they are not in a party.
- Send text messages and emotes, typing state, join/leave notices, and room player counts.
- Limit message, emote, and typing event frequency; enforce a 500-character message limit.
- Rebind reconnecting users to their existing client state and delay disconnect cleanup during brief network interruptions.
- Gracefully close active sockets during service shutdown.

## Technology stack

| Area | Technologies |
|---|---|
| Runtime | Node.js 20 (Docker image) |
| Language and build | TypeScript, TypeScript compiler, `tsx` for development |
| HTTP and real-time server | Node.js HTTP server, Socket.IO 4 |
| User authentication | Session validation through the authentication service |
| State | In-memory client registry, party membership, and rate-limit windows |

The chat service has no database dependency. Its party roster and live client state are rebuilt through party-service requests and socket connections after a restart.

## Run the service

### Full project stack

From the repository root, configure `.env` and the local secret files as described in the [root README](../../README.md), then start the stack:

```sh
docker compose up --build
```

The chat service listens on the configured container port (default `3000`). Nginx routes browser Socket.IO traffic through `/socket/chat`; Compose also maps the service to host port `3001` for local development and inspection.

### Workspace scripts

Run from the repository root:

```sh
npm install
npm run dev -w chat
npm run build -w chat
npm run start -w chat
```

The service requires `PORT`, `AUTH_SERVICE_URL`, and `SOCKET_CHAT_PATH`. For local execution, point `AUTH_SERVICE_URL` at a reachable auth `/validate` endpoint. `DISCONNECT_GRACE_PERIOD_MS` is optional and defaults to `15000` milliseconds.

| Variable | Example / default | Purpose |
|---|---|---|
| `PORT` | `3000` in Docker | HTTP and Socket.IO listener port. |
| `AUTH_SERVICE_URL` | `http://authentication:3000` in Compose | Base URL used to validate chat socket sessions. |
| `SOCKET_CHAT_PATH` | `/socket/chat` | Socket.IO path configured by the reverse proxy. |
| `DISCONNECT_GRACE_PERIOD_MS` | `15000` | Delay before a temporary disconnect removes a client and emits a leave event. |

## HTTP endpoints

### `GET /health`

Used by the container orchestrator to check service health.

| Status | Response |
|---|---|
| `204` | Empty body; service is healthy. |
| `503` | `{ "error": "Service is shutting down" }` during shutdown. |

### `POST /party`

Creates a party whitelist. The party service calls this when a chat room is created. Connected party members are moved into the room named by `hostUuid`.

**Request body** (`application/json`):

```json
{
  "hostUuid": "host-uuid",
  "playerUuids": ["host-uuid", "player1-uuid", "player2-uuid"]
}
```

`hostUuid` must be a non-empty string. `playerUuids` must be an array of non-empty strings; duplicates are removed and the host is added if missing.

| Status | Response |
|---|---|
| `201` | `{ "hostUuid": "host-uuid", "playerUuids": ["host-uuid", "player1-uuid"] }` |
| `400` | Invalid or missing JSON body, empty/non-string host or player values, or a body larger than 1 MiB. |
| `409` | Party already exists, or the host already belongs to another party. |
| `500` | Unexpected server error. |
| `503` | Service is shutting down. |

### `PUT /party/:hostUuid`

Replaces a party's host and member list. Members removed from the party return to their solo rooms; connected members are moved to the updated party room. A host change renames the room to the new host UUID.

The path parameter identifies the current host, and the JSON body uses the same shape and validation as `POST /party`.

| Status | Response |
|---|---|
| `204` | Party whitelist updated; empty body. |
| `400` | Missing path value or invalid request body. |
| `404` | Current party does not exist. |
| `409` | New host UUID already belongs to another party. |
| `500` | Unexpected server error. |
| `503` | Service is shutting down. |

### `DELETE /party/:hostUuid`

Deletes the party whitelist and moves connected members to their solo rooms.

| Status | Response |
|---|---|
| `204` | Party whitelist deleted; empty body. |
| `400` | Missing host UUID path value. |
| `404` | Party does not exist. |
| `500` | Unexpected server error. |
| `503` | Service is shutting down. |

These party-management routes are for internal service-to-service calls. The current chat HTTP handler does not authenticate their callers; Nginx does not route them from the browser-facing `/api` paths.

## Socket.IO event contract

Clients connect using `SOCKET_CHAT_PATH` and a valid `session_token` cookie or `auth.token` handshake value. The service validates the session with `GET {AUTH_SERVICE_URL}/validate` before accepting the socket.

### Client to server

| Event | Payload | Behavior |
|---|---|---|
| `chat_join_room` | `{ roomId: string }` with an acknowledgement callback | Joins the user's current solo or authorized party room. The acknowledgement contains `{ success, roomId?, count?, reason? }`. |
| `chat_message` | `{ type: "MESSAGE" \| "EMOTE", message: string }` | Broadcasts a trimmed message to the current room after validation and rate limiting. |
| `chat_typing` | `{ isTyping: boolean }` | Broadcasts the sender's typing state to the rest of the room. |

### Server to client

| Event | Payload | Purpose |
|---|---|---|
| `chat_message` | `{ senderUuid, type, message, timestamp }` | New room message or emote. |
| `chat_user_joined` | `{ senderUuid, timestamp }` | A user joined the room. |
| `chat_user_left` | `{ senderUuid, timestamp }` | A user left the room or completed disconnect cleanup. |
| `chat_user_typing` | `{ senderUuid, isTyping }` | Typing state for another user in the room. |
| `chat_room_player_count` | `{ roomId, count }` | Number of currently connected sockets in the room. |
| `chat_rate_limited` | `{ type, message }` | The sender exceeded a message or emote limit. |

### Limits and room rules

- Text and emote messages are trimmed and must contain 1–500 characters.
- Text messages are limited to 5 per 5 seconds per user; emotes are limited to 3 per 2 seconds.
- Typing updates are limited to 20 per 5 seconds per user. Excess typing updates are silently ignored.
- Users may join their own UUID room or a party room whose whitelist includes them. A room must also match their current party assignment.
- Message history is not replayed when a user joins; clients receive live events only.

## Source layout

| Path | Responsibility |
|---|---|
| `src/index.ts` | Creates the HTTP/Socket.IO server, configures authentication, and handles shutdown. |
| `src/http/` | Health and party-management endpoints. |
| `src/party/` | In-memory party whitelist, room reconciliation, and payload validation. |
| `src/server/` | Socket session validation and connection lifecycle. |
| `src/client/` | Client registry, room events, chat events, and room counts. |
| `src/utils/RateLimiter.ts` | Per-user rolling-window event limits. |
| `src/events.ts` | Typed client/server Socket.IO event contracts. |
