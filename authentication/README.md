# Backend Auth

## Running locally
```
npm install
npm run dev
```
## Endpoints

| Method | Path | Purpose |
|:---:|---|---|
| POST | [`/signup`](#post-signup) | creates a user with an email and password |
| POST | [`/signin`](#post-signin) | creates a session for a user and set the session token as a cookie in its response |
| DELETE | [`/logout`](#delete-logout) | deletes the session for a use and clears the cookie |
| GET | [`/validate`](#get-validate) | checks if a session is valid and resets its expiry |
| GET | [`/created-at/:uuid`](#get-created-atuuid) | gets a user's account creation time |
<br><br>

### POST /signup
#### Header:
```
Content-Type: application/json
```

#### Body:
```
{
	email:		string,
	password:	string
}
```

#### Responses:
```
- 201: { id: string, email: string }
- 400: { error: string } (invalid email/password)
- 409: { error: string } (email already registered)
```
<br><br>

### POST /signin
#### Header:
```
Content-Type: application/json
```

#### Body:
```
{
	identifier:	string,
	password:	string
}
```

#### Responses:
```
- 200: { id: string }
- 401: { error: string } (account not found / wrong password)
```
<br><br>

### DELETE /logout
#### Responses:
```
- 200: { message: string } (successful logout)
- 401: { error: string } (missing or malformed authorization / invalid session)
```
<br><br>

### GET /validate
#### Responses:
```
- 200: { userId: string }
- 401: { error: string } (missing or malformed authorization / invalid session)
```

### GET /created-at/:uuid
#### Responses:
```
- 200: { createdAt: string }
- 404: { error: string }
```
<br><br>

## TESTS
- npm run test:signup \<email\> \<password\>
- npm run test:singin \<identifier\> \<password\>
- npm run test:logout \<session\_token\>
- npm run test:validate \<session\_token\>
