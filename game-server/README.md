# Game Server

### Description

The Game Server manages the lobby and game sessions. Handling the lobby and its relevant information, ensuring synchronization between clients, and acts as an authoritative server for the game to the clients.

### Environment Variables

| Name | Type | Description |
| --- | --- | --- |
| GAME_SERVER_SERVICE_PORT | number | Determines the port that the game server will listen on |
| GAME_SERVER_SERVICE_URL | string | Should contain the server URL and port in the format: “server_url:port”. Will be used for the client socket to connect to |
| GAME_SERVER_SERVICE_LOBBY_LIMIT | number | Specifies the lobby limit, capping the amount of lobbies that the server will create |
| GAME_SERVER_SERVICE_LOBBY_USER_LIMIT | number | Specifies the limit for the total users connecting to a single lobby, minimum 4 |

# Endpoints

## GET /health

### Description:

Healthcheck endpoint for docker orchestrator

### Header: N/A

### Body: N/A

### Response:

| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | Server is healthy |

## GET /lobby/:lobbySessionId

### Description:

Endpoint to check if a lobby exists

### Header: N/A

### Body: N/A

### Response:

| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | Lobby exists |
| 404 | N/A | Lobby is not found |

## POST /lobby

### Description:

Creates a new lobby and returns the lobbySessionId

### Header:

```json
Content-Type: application/json
```

### Body:

| Key | Type | Zod Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must be a minimum of 1 character ( FUTURE: Must be UUIDv? ) | Used to establish the lobby host |
| playerUuids | Array<string> | Can accept duplicate UUIDs, but will remove duplicate UUIDs. ( FUTURE: String must be UUID ) | Used to whitelist client socket.io user connections |

Example:

```json
{
	"hostUuid": "host-uuid",
	"playersLimit": 4,
	"playerUuids": ["host-uuid", "player1-uuid", "player2-uuid", "player3-uuid", "spectator-uuid"]
}
```

### Response:

| HTTP Status | Payload | Description |
| --- | --- | --- |
| 201 | lobbySessionId: string | The lobby is successfully created |
| 400 | zod: ZodError.issues | The request fails zod validation |
| 500 | error: string | The server is unable to create a lobby |

## PUT /lobby/:lobbySessionId

### Description:

Updates an existing lobby

### Header:

```json
Content-Type: application/json
```

### Body:

| Key | Type | Zod Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must be a minimum of 1 character ( FUTURE: Must be UUIDv? ) | Used to establish the lobby host |
| playerUuids | Array<string> | Can accept duplicate UUIDs, but will remove duplicate UUIDs. ( FUTURE: String must be UUID ) | Used to whitelist client socket.io user connections. If updated playerUuids do not contain currently connected users, they will be kicked out |

Example:

```json
{
	"hostUuid": "host-uuid",
	"playersLimit": 4,
	"playerUuids": ["host-uuid", "player1-uuid", "player2-uuid", "spectator-uuid", "new-spectator-uuid"]
}
```

### Response:

| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | The lobby is successfully updated |
| 400 | zod: ZodError.issues | The request fails zod validation |
| 404 | N/A | The server is unable to find the lobby requested |
| 500 | error: string | The server is unable to update the lobby |

# Socket.io Endpoints

## Client → Server

| Event | Arguments | Description |
| --- | --- | --- |
| user_seat_take | seatIndex: number, statusCallback: (status) ⇒ {} | A request to take a seat |
| user_seat_leave | statusCallback: (status) ⇒ {} | A request to leave a seat |
| user_seat_change | totalSeats: number, statusCallback: (status) ⇒ {} | A request to change the number of seats by the host |
| player_play_card_hand_request | cardHandTransmit, statusCallback: (status) ⇒ {} | A request to play a card hand |
| player_skip_turn_request | statusCallback: (status) ⇒ {} | A request to skip the player’s turn |
| game_start_request | statusCallback: (status) ⇒ {} | A request to start the game |
| game_settings_set | GameSettingsTransmit, statusCallback: (status) ⇒ {} | A request to change the lobby settings by the host |

## Server → Client

Updates sent to all relevant users

| Event | Arguments | Description |
| --- | --- | --- |
| user_list_update | uuids: Array<string> | Update connection/disconnection changes |
| user_seat_update | SeatOrderTransmit | Update seat changes |
| player_connection_update | Record<uuid: string, isDisconnected: boolean> | Notify players of player connections, boolean is isDisconnected |
| player_turn | PlayerTurnTransmit | Notify of a player’s turn |
| player_play_card_hand | CardHandTransmit | Notify that a player played a card hand |
| player_skip_turn | SkipTurnTransmit | Notify that a player skipped their turn, usually followed up by player_turn |
| game_settings_update | GameSettingsTransmit | Notify that there is an update to the lobby game settings |
| game_end | GameEndStatsTransmit | Notify that the game has ended |
| game_state | GameStateTransmit | For initializing the game state on the client |

Events sent to the relevant user when the server encountered an issue

| Event | Arguments | Description |
| --- | --- | --- |
| connect_error |  | Will be used in the future for authentication token socket validation error |
| graceful_disconnect | reason: string | Sent when the server is kicking the socket and would like the user to disconnect first to avoid error console message |