# Chat Service Endpoints

## GET /health
### Description:
Healthcheck endpoint for docker orchestrator
### Header: N/A
### Body: N/A
### Response:
| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | Server is healthy |

<br><br>

## POST /party
### Description:
Creates a new party whitelist in chat service. Party manager uses endpoint to notify chat service that a new party exists and UUID of players belonging to the party. Connected players are automatically moved to the party's chat room.
### Header:
```json
Authorization: Bearer <PARTY_MANAGER_TOKEN>
Content-Type: application/json
```
### Body:
| Key | Type | Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must be a non-empty string | UUID of the party host. Used as the party's chat room ID |
| playerUuids | Array<string> | Must contain only non-empty strings. Duplicate UUIDs are removed | UUIDs of players authorized to join the party's chat room |
### Example Body:
```json
{
	"hostUuid": "host-uuid",
	"playerUuids": [
		"host-uuid",
		"player1-uuid",
		"player2-uuid",
		"player3-uuid"
	]
}
```
Solo Party Example:
```json
{
	"hostUuid": "player-uuid",
	"playerUuids": [
		"player-uuid"
	]
}
```
### Response:
| HTTP Status | Payload | Description |
| --- | --- | --- |
| 201 | hostUuid and playerUuids | The party whitelist is successfully created |
| 400 | error: string | The request body fails validation |
| 401 | error: string | The request is not authorized as a Party Manager request |
| 409 | error: string | A party with the specified host UUID already exists |
| 500 | error: string | The server is unable to create the party whitelist |
### Example Response:
```json
{
	"hostUuid": "host-uuid",
	"playerUuids": [
		"host-uuid",
		"player1-uuid",
		"player2-uuid",
		"player3-uuid"
	]
}
```

<br><br>

## PUT /party/:hostUuid
### Description:
Updates an existing party whitelist. This handles adding/removing players from party's chat room and, if host changes, migrates the party's chat room to the new host UUID. Players removed from the party are moved to their own UUID chat room.
### Header:
```json
Authorization: Bearer <PARTY_MANAGER_TOKEN>
Content-Type: application/json
```
### URL Parameters:
| Parameter | Type | Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must identify an existing party | Current host UUID of the party |
### Body:
| Key | Type | Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must be a non-empty string | New/current host UUID for the party |
| playerUuids | Array<string> | Must contain only non-empty strings. Duplicate UUIDs are removed | Complete list of UUIDs authorized to join the party's chat room |
### Example:
```json
#PUT /party/host-uuid
{
	"hostUuid": "host-uuid",
	"playerUuids": [
		"host-uuid",
		"player1-uuid",
		"player2-uuid",
		"new-player-uuid"
	]
}
```
Host Change Example:
```json
#PUT /party/old-host-uuid
{
	"hostUuid": "new-host-uuid",
	"playerUuids": [
		"new-host-uuid",
		"player1-uuid",
		"player2-uuid"
	]
}
```
### Response:
| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | The party whitelist is successfully updated |
| 400 | error: string | The request body fails validation |
| 401 | error: string | The request is not authorized as a Party Manager request |
| 404 | error: string | The specified party does not exist |
| 409 | error: string | The new host UUID already belongs to another party |
| 500 | error: string | The server is unable to update the party whitelist |

<br><br>

## DELETE /party/:hostUuid
Description:
Deletes an existing party whitelist. All currently connected players belonging to the party are moved from the party's chat room to their own UUID chat rooms. Players that remain connected after the party is deleted are moved to their own UUID chat rooms. This ensures every connected player always has an assigned chat room.
### Header:
```json
Authorization: Bearer <PARTY_MANAGER_TOKEN>
```
### URL Parameters:
| Parameter | Type | Validation | Description |
| --- | --- | --- | --- |
| hostUuid | string | Must identify an existing party | Host UUID of the party to delete |
### Body:
N/A
### Response:
| HTTP Status | Payload | Description |
| --- | --- | --- |
| 204 | N/A | The party whitelist is successfully deleted |
| 401 | error: string | The request is not authorized as a Party Manager request |
| 404 | error: string | The specified party does not exist |
| 500 | error: string | The server is unable to delete the party whitelist |