# Game Bot

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| POST | [`/new-bot`](#post-new-bot) | request for a new bot |

### POST /new-bot
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