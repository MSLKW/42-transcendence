# Game Bot

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| POST | [`/new-bot`](#get-new-bot) | request for a new bot |

### GET /new-bot
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