# Backend Auth

## Running locally
npm install
npm run dev
Server starts on http://localhost:3000

## API

### POST /signup
Header:
Content-Type: application/json

Body:
{ "email": string, "password": string }

Responses:
- 201: { id, email }
- 400: invalid email/password
- 409: email already registered

### POST /signin
Header:
Content-Type: application/json

Body:
{ "identifier": string, "password": string }

Responses:
- 200: { id }
- 401: account not found / wrong password

### POST /validate
Header:
Authorization: Bearer \<session\_token\>

Responses:
- 200: { id }
- 401: missing or malformed authorization / invalid session

## TESTS
- npm run test:signup \<email\> \<password\>
- npm run test:singin \<identifier\> \<password\>
- npm run test:validate \<session\_token\>
