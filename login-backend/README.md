# Auth Backend

## Running locally
npm install
npm run dev
Server starts on http://localhost:3000

## API

### POST /signup
Content-Type: application/json required.

Body:
{ "email": string, "password": string }

Responses:
- 201: { id, email }
- 400: invalid email/password
- 409: email already registered
