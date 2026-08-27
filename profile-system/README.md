# Profile System

## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| GET | [`/profile/:uuid`](#get-profileuuid) | get a user's profile information |
| GET | [`/settings/:uuid`](#get-settingsuuid) | get a user's settings configuration |
| GET | [`/search/:query`](#get-searchquery) | get a list of uuids of users whose username matches a search query |
| PUT | [`/profile`](#put-profile) | sets the calling user's modifiable profile information (username, badge, avatar path) |
| PUT | [`/settings`](#put-settings) | sets the calling user's settings configuration |
| PUT | [`/avatar`](#put-avatar) | uploads an image as `$(AVATAR_DIR)/<uuid>.png` with the calling user's uuid |

### GET /profile/:uuid
#### Responses
- 200: Response uses `type UserData` as body. See [`src/types.tx`](./src/types.ts)
- 404: { error: string }
<br><br>

### GET /settings/:uuid
#### Responses
- 200: Response uses `type UserSettings` as body. See [`src/types.tx`](./src/types.ts)
- 404: { error: string }
<br><br>

### GET /search/:query
#### Responses
- 200: { searchResults: string[] } (a list of uuids)
<br><br>

### PUT /profile
#### Body
```
{
	[username:	 string],
	[badge:		 string],
	[avatarPath: string]
}
```
Ommited fields will be unaffected

#### Responses
- 204
- forwards auth system's /validate responses to client on unsuccessful validation
<br><br>

### PUT /settings
#### Request body
Uses `type UserSettings` as body. See [`src/types.ts`](./src/types.ts)<br>
Ommited fields will be unaffected

#### Responses
- 204
- forwards auth system's /validate responses to client on unsuccessful validation
<br><br>

### PUT /avatar
#### Request body
The request body should be a FormData type with .append() used with "avatar" as the name and the image file as the value
Example usage:
```ts
const formData = new FormData();
formData.append("avatar", file);
const res = await fetch(`${PROFILE_SYSTEM_URL}/avatar`, {
	method: "PUT",
	body: formData
});
```
#### Responses
- 204
- 400 { error: string }
- forwards auth system's /validate responses to client on unsuccessful validation