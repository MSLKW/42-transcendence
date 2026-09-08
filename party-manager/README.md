# Party Manager

## Frontend To Party Manager Socket Transmits

| <center>Event Name</center> | <center>JSON Payload</center> | <center>Callback</center> |
|-|-|-|
| "send_invite" | recipientUuid: string | <center>-</center> |
| "kick_player" | recipientUuid: string | <center>-</center> |
| "accept_invite" | hostUuid: string | success: boolean,<br>reason?: string (if success == false) |
| "reject_invite" | hostUuid: string | <center>-</center> |
| "leave_party" | <center>-</center>|<center>-</center> |
| "start_game_session" | <center>-</center>|<center>-</center> |
| "refresh" | <center>-</center> | <center>-</center> |

## Party Manager To Frontend Socket Transmits
| <center>Event Name</center> | <center>JSON Payload</center> | <center>Callback</center> |
|-|-|-|
| "party_state" | host: string,<br>members: string[],<br>gameId: string \| null | <center>-</center> |
| "invite_received" | hostUuid: string | <center>-</center> |
| "kicked" | message: string | <center>-</center> |
| "game_session_start" | gameId: string | <center>-</center> |
| "disconnect_with_reason" | reason: string | <center>-</center> |
