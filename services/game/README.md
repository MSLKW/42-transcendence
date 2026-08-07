# Game Server

### Description

The Game Server manages the lobby and game sessions. Handling the lobby and its relevant information, ensuring synchronization between clients, and acts as an authoritative server for the game to the clients.

### Environment Variables

| Name | Type | Description |
| --- | --- | --- |
| GAME_SERVER_URL | string | Should contain the server URL and port in the format: “server_url:port”. Will be used for the client socket to connect to |
| GAME_SERVER_LOBBY_LIMIT | number | Specifies the lobby limit, capping the amount of lobbies that the server will create |
| GAME_SERVER_LOBBY_USER_LIMIT | number | Specifies the limit for the total users connecting to a single lobby |

## POST /lobby endpoint responses

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
| playersLimit | number | Must be in between 1-4 | Used to limit the amount of players in the game. The total amount of users that can connect to the lobby will be limited by GAME_SERVER_LOBBY_USERS_LIMIT |
| playerUuids | Array<string> | Can accept duplicate UUIDs, but will remove duplicate UUIDs. ( FUTURE: String must be UUID ) | Used to whitelist client socket.io user connections. If updated playerUuids do not contain currently connected users, they will be kicked out |

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
| playersLimit | number | Must be in between 1-4 | Used to limit the amount of players in the game. The total amount of users that can connect to the lobby will be limited by GAME_SERVER_LOBBY_USERS_LIMIT |
| playerUuids | Array<string> | Can accept duplicate UUIDs, but will remove duplicate UUIDs. ( FUTURE: String must be UUID ) | Used to whitelist client socket.io user connections |

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
| 200 | N/A | The lobby is successfully created |
| 400 | zod: ZodError.issues | The request fails zod validation |
| 404 | N/A | The server is unable to find the lobby requested |
| 500 | error: string | The server is unable to update the lobby |
