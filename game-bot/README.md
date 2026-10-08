# Game Bot

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| POST | [`/new-bot`](#get-new-bot) | request for a new bot |

### POST /new-bot
#### Body
```
{
	lobbyId:			string,
	seatIndex:			number,
	botSessionToken:	string			
}
```
#### Responses
- 200: { botId: string }
- 400: { error: string }
<br><br>