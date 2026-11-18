# Website

The `website` service is the React frontend for Big2, a browser-based multiplayer Big Two game. It provides account flows, social and lobby screens, interactive 3D gameplay, and player profiles. It communicates with the backend services over HTTP, Socket.IO, and Server-Sent Events (SSE).

## Features

### Accounts and onboarding

- Create an account, sign in, sign out, and validate the current session.
- Complete a profile with a username and an avatar chosen from the built-in set or uploaded by the player.
- Show a setup prompt when the signed-in player has not completed their profile.

### Home, parties, and lobbies

- Start a 2-, 3-, or 4-player game session; the party host controls the player count.
- Search for players, invite them to a party, accept or reject invitations, and remove or leave a party.
- View party members, online/away status, host indicators, and connection updates.
- Take or leave seats, add or remove bots, and start a game when all seats are filled.
- Let the host configure whether three of a kind can be played, whether a game may finish with the 2 of Spades, and the automatic-pass delay.

### Multiplayer Big Two gameplay

- Render the table, cards, and login background with Three.js; animate cards and transitions with GSAP and Motion.
- Select or drag cards, sort the hand by rank or suit, and play or pass when it is the player's turn.
- Display opponents, remaining card counts, active turns, disconnections, and game state updates.
- Rejoin a game after a connection interruption, spectate an active game, and view round results and rankings.
- Open the card ranking reference during play.

### Chat and social features

- Use party chat with messages, emotes, join/leave reports, typing indicators, and server rate-limit feedback.
- Send and manage friend requests, view friendship status, and receive updates over SSE.
- Open a player's profile or public statistics, inspect achievements, and remove a friend or kick a party member where permitted.

### Profiles and progression

- Edit a username, select or upload an avatar, and choose an unlocked displayed badge.
- View account age, online availability, level, XP progress, played games, wins, win streak, and achievements.
- Receive notifications for invitations, party events, account actions, achievement unlocks, and easter eggs.
- Read the privacy policy and terms of service in the information window.

### Interface

- Use draggable, dismissible windows for chat, parties, profiles, statistics, settings, notifications, and results.
- View the responsive interface with scene-specific navigation and a dedicated 3D canvas.
- Enable the development controls by setting `SHOW_DEV_SECTION=true`.

## Technology stack

| Area | Technologies |
|---|---|
| UI | React 19, React DOM, TypeScript |
| Development and build | Vite 8, TypeScript compiler, Vite React plugin |
| Styling | Tailwind CSS 4 and the Tailwind Vite plugin; project utilities and responsive theme tokens in `src/css/` |
| 3D graphics and animation | Three.js, GSAP, Motion |
| Client state | Zustand with persistence for selected user settings and cached data |
| Real-time communication | Socket.IO Client for party, chat, and game events; browser `EventSource` for friends events |
| Shared contracts | `@big2/game-types` and `@big2/friends-types` workspace packages |

The frontend does not own game rules or persistent account data. The game server is authoritative for gameplay; account, profile, party, friends, chat, and game-stats services provide their respective APIs and events.

## Run the website

The default Compose configuration builds the website into static assets and serves them with Nginx. From the repository root, configure `.env` and the secret files as described in the [root README](../../README.md), then run:

```sh
docker compose up --build -d
```

Open the configured domain (default: [http://localhost:8080](http://localhost:8080)). The outer Nginx proxy routes website requests to the static website container on port `5173`; client-side routes fall back to `index.html`. API and Socket.IO settings are embedded in the built assets, so changing the `VITE_*` values or `SHOW_DEV_SECTION` requires rebuilding the website image. `SOCKET_URL` must use the same public host and protocol as the deployment; set `SOCKET_PROTOCOL=https` when TLS is enabled.

For website development with Vite hot reload, use the development Compose overlay:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The `make all` command starts the production configuration. Use `make dev` for the hot-reload development configuration. The backend API and socket services must also be available for account, lobby, social, chat, and gameplay features to work.

### Workspace scripts

Run commands from the repository root:

```sh
npm install
npm run dev -w website
npm run build -w website
npm run lint -w website
npm run preview -w website
```

The Vite development and build commands require the frontend environment variables below. Compose supplies them from the root `.env`; when running Vite directly, export them in the shell first. `npm run preview -w website` serves a previously built `dist/` bundle.

## Environment variables

Vite checks that all API and socket variables are set when the dev server or build starts. The values below match `.env.example`:

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_AUTH_PATH` | `/api/auth` | Authentication API base path. |
| `VITE_API_PROFILE_PATH` | `/api/profile` | Profile, settings, search, and avatar API base path. |
| `VITE_API_PARTY_PATH` | `/api/party` | Party and online-status API base path. |
| `VITE_API_FRIENDS_PATH` | `/api/friends` | Friends API and SSE base path. |
| `VITE_API_GAME_STATS_PATH` | `/api/game-stats` | Player progression and statistics API base path. |
| `VITE_SOCKET_CHAT_PATH` | `/socket/chat` | Chat Socket.IO path. |
| `VITE_SOCKET_PARTY_PATH` | `/socket/party` | Party Socket.IO path. |
| `VITE_SOCKET_GAME_SERVER_PATH` | `/socket/game` | Game-server Socket.IO path. |
| `VITE_SOCKET_GAME_BOT_PATH` | `/socket/game-bot` | Game-bot Socket.IO path. |
| `VITE_SOCKET_URL` | `http://localhost:8080` | Socket.IO origin; use `https://` when local TLS is enabled. |
| `SHOW_DEV_SECTION` | `false` | Enables the development controls at the bottom of the page when `true`. |

`DOMAIN_PORT` is also used by Vite's HMR WebSocket configuration; Compose sets it from the root `.env` (default `8080`).

## Source layout

| Path | Responsibility |
|---|---|
| `src/App.tsx` | Scene composition, service connections, subscriptions, and session validation. |
| `src/components/` | Login, home, lobby, game, party, chat, profile, stats, results, and shared UI. |
| `src/api/` | HTTP handlers, Socket.IO clients, SSE events, and the Three.js game client. |
| `src/store/` | Zustand stores for authentication, game, party, chat, friends, profiles, settings, and progression. |
| `src/utilities/` | Reusable React hooks, validation, tooltips, and socket helpers. |
| `src/css/` | Tailwind theme utilities and animation styles. |
| `public/` | Card, avatar, and other static visual assets. |

## Limitations

- Guest authentication is not implemented by the authentication service, so the website currently requires a registered account.
- Gameplay and social features depend on the corresponding backend services in the full project stack.
