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
```
- 200: UserData 
- 404: { error: string }
```
Response code 200 uses `type UserData` as body. See [`profile-types`](../../packages/types/profile-types/src/Types.ts)

<br><br>

### GET /settings/:uuid
#### Responses
```
- 200: UserSettings
- 404: { error: string }
```
Response code 200 uses `type UserSettings` as body. See [`profile-types`](../../packages/types/profile-types/src/Types.ts)

<br><br>

### GET /search/:query
#### Responses
```
- 200: { searchResults: string[] } (a list of uuids)
```
<br><br>

### PUT /profile
#### Body
Uses `type UserData` as body. See [`profile-types`](../../packages/types/profile-types/src/Types.ts)<br>
Ommited fields will be unaffected

#### Responses
```
- 200 { message: string }
- 400 { error: ZodIssue[] }
- 422 { error: string } (username invalid)
- 409 { error: string } (username taken)
- forwards auth system's /validate responses to client on unsuccessful validation
```
<br><br>

### PUT /settings
#### Request body
Uses `type UserSettings` as body. See [`profile-types`](../../packages/types/profile-types/src/Types.ts)<br>
Ommited fields will be unaffected

#### Responses
```
- 200: { message: string }
- 400: { error: ZodIssue[] }
- forwards auth system's /validate responses to client on unsuccessful validation
```
<br><br>

### PUT /avatar
#### Request body
The request body should be a FormData type with .append() used with "avatar" as the name and the image file as the value
Example usage:
```ts
function uploadFile(file: File)
{
	const formData = new FormData();
	formData.append("avatar", file);
	const res = await fetch(`${PROFILE_SYSTEM_URL}/avatar`, {
		method: "PUT",
		body: formData
	});
}
```
#### Responses
```
- 200 { message: string, filename: string }
- 400 { error: string }
- forwards auth system's /validate responses to client on unsuccessful validation
```