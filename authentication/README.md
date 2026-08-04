# Backend Auth

## Running locally
```
npm install
npm run dev
```
Server starts on http://localhost:3000

## Endpoints

### POST /signup
Header:
Content-Type: application/json

Body:
{ "email": string, "password": string }

Responses:
- 201: { id, email }
- 400: { error } (invalid email/password)
- 409: { error } (email already registered)

#### Example request:
```
POST /signup HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 46

{"email":"jchuah@42.fr","password":"12345678"}
```
#### Example response
```
HTTP/1.1 409 Conflict
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 54
ETag: W/"36-wXGTlzsdKOUrQHdTvRLiPZQLYgk"
Date: Sun, 12 Jul 2026 13:05:20 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"An account with this email already exists."}
```

### POST /signin
Header:  
Content-Type: application/json

Body:  
{"identifier": string, "password": string}

Responses:
- 200: { id }
- 401: account not found / wrong password

#### Example request:
```
POST /signin HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Content-Length: 45

{"identifier":"jchuah","password":"12345678"}
```
#### Example response:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Set-Cookie: session_token=681a9f12ef8c47db65b040185b9f5f3578fcf2a539d77fcff58156b0d3f6a13e; Path=/; Expires=Sun, 12 Jul 2026 12:53:57 GMT; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json; charset=utf-8
Content-Length: 45
ETag: W/"2d-W1UTDtjIDH7AbBA1tlorZSZ5E20"
Date: Sun, 12 Jul 2026 12:53:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":"884b840c-2bcb-41cb-8e87-f7183cc9ada1"}
``` 

### DELETE /logout
Header:  
Authorization: Bearer \<session\_token\>

Responses:
- 200: { message } (successful logout)
- 401: { error } (missing or malformed authorization / invalid session)

#### Example Request:
```
DELETE /logout HTTP/1.1
Host: localhost:3000
Accept: */*
Authorization: Bearer 681a9f12ef8c47db65b040185b9f5f3578fcf2a539d77fcff58156b0d3f6a13e
```
#### Example Response:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 38
ETag: W/"26-QmMKQ7Ehtu+p4nfPmYpM+SsKPqc"
Date: Sun, 12 Jul 2026 13:17:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"message":"Logged out successfully."}
```

### GET /validate
Header:  
Authorization: Bearer \<session\_token\>

Responses:
- 200: { userId }
- 401: { error } (missing or malformed authorization / invalid session)

#### Example Request:
```
GET /validate HTTP/1.1
Host: localhost:3000
Authorization: Bearer 681a9f12ef8c47db65b040185b9f5f3578fcf2a539d77fcff58156b0d3f6a13e 
```
#### Example Response:
```
HTTP/1.1 401 Unauthorized
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 39
ETag: W/"27-RPCqAMtqQ1wqgM5D997LHzTux5k"
Date: Sun, 12 Jul 2026 13:11:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Invalid or expired session."}
```

## TESTS
- npm run test:signup \<email\> \<password\>
- npm run test:singin \<identifier\> \<password\>
- npm run test:logout \<session\_toekn\>
- npm run test:validate \<session\_token\>
