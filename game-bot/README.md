# Game Bot

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| POST | [`/new_bot`](#get-new_bot) | request for a new bot |

### GET /new_bot
#### Body
```
{
	lobbyId:		string,
	seatIndex:		number,
	sessionToken:	string			
}
```
#### Responses
- 200: { botId: string }
- 400: { error: string }
<br><br>