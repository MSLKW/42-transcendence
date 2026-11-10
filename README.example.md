*This project has been created as part of the 42 curriculum by aimokhta, azsaleh, jchuah, maxliew.*

# Big2

Big2 is a browser-based multiplayer implementation of the card game Big Two, or fondly known to Malaysian locals as Chor Dai Di. Players create accounts, join a lobby with friends, and play together in real time at a 3D-rendered card table. The project is a TypeScript monorepo of a React client and independently deployable services.

The website is served through Nginx, which routes requests to the authentication, party, profile, friends, chat, and game-stats services. The game server manages lobbies and matches, while the game-bot service connects automated players. Shared TypeScript contracts and PostgreSQL schemas live in `packages/`; database setup is in `infra/`.

## Features

| Feature | What it does | Contributors |
|---|---|---|
| Big Two gameplay | Play singles and combinations with turn handling, reconnects, timers, and results. | Max |
| 3D client | View and interact with a Three.js card table; sort, select, drag, play, or pass cards. | Max |
| Game lobbies | Set seats, change game settings, and bot management. | Max |
| Authentication | Register, sign in/out, validate sessions, and protect service requests. | Jeremy |
| Party system | Invite or remove players, set seats, change game settings, and see availability. | Jeremy |
| Game bots | Fill an open seat with a bot with predefined play style. | Jeremy |
| Profiles | Set or retreives a player's username, avatar and badges. Supports uploading a custom avatar. | Jeremy |
| Database | Store user accounts, player profiles / stats and persistent game state securely across sessions  | Aisyah |
| Friends service | Send, accept, reject, and remove friend requests; receive live updates. | Aisyah |
| Game stats | View game results, rankings, XP, levels, achievements, badges, and easter eggs. | Aisyah |
| Website | Provide a responsive, web interface, site layout, navigation and cohesive styling for the entire platform | Azrul |
| Chat and emotes | Send party messages and emotes, see typing activity, and receive rate-limit feedback. | Azrul |
| Notifications | Receive in-app notices for invitations, activity, and progression. | Azrul |
| Windowed UI | Render a draggable window for features like party or chat, complete with a menubar, title and close button | Azrul |

## Instructions

### Prerequisites

- Docker Engine with Docker Compose v2 (Docker Desktop includes both).
- OpenSSL to generate local secrets and a development TLS certificate.
- Ports `8080`, `3001`, `3002`, and `4983` available; the latter three are for chat testing, game-stats testing, and the local Drizzle Gateway respectively.

The containers use Node.js 20 or 24 and PostgreSQL 17. Root `npm install` is only needed for running workspace scripts outside the Docker setup.

### Configure and run

1. Clone the repository and navigate to its root directory.

2. Generate the local environment configuration, database passwords, authentication token, and SSL certificate:

   ```sh
   make secrets
   ```

   This command automatically:
   
   - Creates .env by copying .env.example if .env does not already exist.
   - Creates the required directories under secrets/.
   - Generates six database passwords using openssl rand -hex 32.
   - Generates the game statistics authentication token.
   - Generates a self-signed SSL certificate and private key for localhost.
   
   Existing .env files and generated secrets are preserved. The command skips individual files that already exist, preventing accidental credential regeneration and potential disruption to existing services.
   
   Generated files are stored in the following structure:
   
   ```
   .
   ├── .env
   └── secrets/
       ├── database-passwords/
       │   ├── db-admin-password.txt
       │   ├── db-auth-password.txt
       │   ├── db-party-password.txt
       │   ├── db-profile-password.txt
       │   ├── db-friends-password.txt
       │   └── db-game-stats-password.txt
       ├── tokens/
       │   └── statistics-token.txt
       └── ssl/
           ├── transcendence.key
           └── transcendence.crt
   ```
   
   Important: Keep .env and secrets/ private. They contain credentials and private keys and should never be committed to Git. Make sure both are included in .gitignore.

3. Build and start the stack:

   ```sh
   make all
   ```

   Alternatively, start the development environment with:

   ```sh
   make dev
   ```

   The Makefile provides the following commands:

   This starts PostgreSQL, runs database migrations, and then starts the website, API services, game server, bot service, and Nginx. The default .env.example config uses HTTP; open http://localhost:8080. To use HTTPS, set SSL_ENABLE=ssl and SOCKET_PROTOCOL=https in .env, then trust the locally generated certificate in your browser.

4. Stop the stack with:

   ```sh
   make dev
   ```

   Persistent database and avatar volumes remain. make fclean also removes project volumes and deletes their data.

The website is bind-mounted for Vite hot reload. See the service READMEs under `services/` for API contracts and service-specific testing instructions.

## Team Information

| Member | Assigned role(s) | Responsibilities |
|---|---|---|
| maxliew (Max) | Product Owner, Project Manager | Defined and coordinated the project work; implemented the game client and authoritative game server. |
| jchuah (Jeremy) | Tech Lead | Guided technical integration; implemented authentication, party management, profile service, and game bot. |
| azsaleh (Azrul) | Developer | Implemented the website and chat service. |
| aimokhta (Aisyah) | Developer | Implemented the database work, friends service, and game-stats service. |

## Project Management

- The team held in-person meetings one to two times per week and divided work by service and feature ownership.
- Planning and coordination used Trello, GitHub Issues, and Figma.
- The team communicated through WhatsApp and Discord.

## Technical Stack

| Area | Technologies | Reason for use |
|---|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand | Component-based interface, typed client code, fast development builds, utility styling, and shared client state. |
| 3D and animation | Three.js, GSAP, Motion | Interactive 3D card table, card movement, and interface animation. |
| Backend services | Node.js, TypeScript, Express 5, Socket.IO | Separate services provide HTTP APIs and live game, party, and chat events. |
| Validation and data access | Zod, Drizzle ORM | Validate service payloads and define typed PostgreSQL schemas and migrations. |
| Database | PostgreSQL 17 | Relational user and game-progress data benefit from foreign keys, uniqueness rules, transactions, and separate service schemas. Each data-owning service connects with its own database role. |
| Infrastructure | Docker Compose, Nginx, GNU Make, OpenSSL | Run the multi-service stack locally; Nginx routes browser HTTP and WebSocket traffic through a single origin. Make automates environment setup and secret generation, while OpenSSL generates secure random credentials and local TLS certificates. |

The client and server are both TypeScript-based so their game events and payloads can share types. Services are separated by responsibility so identity, profile, social, chat, game, and progression code can evolve independently.

## Database Schema

The shared PostgreSQL database separates service-owned tables into schemas. UUIDs link service data to the authentication user, and cascading foreign keys remove dependent records when a user is deleted.

| Schema / table | Key fields and relationships |
|---|---|
| `auth_schema.users` | `id UUID` primary key; unique `email TEXT`; optional unique `username TEXT`; `password_hash TEXT`; creation/update timestamps; login lock fields. |
| `auth_schema.sessions` | `token_hash TEXT` primary key; unique `user_id UUID` referencing users; `expires_at TIMESTAMPTZ`. |
| `profile_schema.user_data` | `id UUID` primary/foreign key to users; unique optional `username TEXT`; optional `avatar_path TEXT`. |
| `profile_schema.user_settings` | `id UUID` primary/foreign key to user data; game-rule `BOOLEAN` values and settings `INTEGER` values. |
| `party_schema.player_status` | `id UUID` primary/foreign key to users; `last_online` and `updated_at` timestamps. |
| `friends_schema.friendships` | UUID primary key and two UUID user references stored in canonical order with a unique pair constraint. |
| `friends_schema.friend_requests` | UUID primary key; sender and receiver UUID references; status enum; timestamps; generated canonical pair columns prevent duplicate pending requests in either direction. |
| `game_stats_schema.player_stats` | User UUID primary/foreign key; integer level, XP, games, wins, and win streak; displayed badge text. |
| `game_stats_schema.player_achievements` / `player_badges` | Player UUID foreign key, achievement/badge text ID, unlock timestamp; composite primary key per player and item. |
| `game_stats_schema.processed_rounds` | Round UUID primary key, JSONB response, and processing timestamps; makes repeated round submissions idempotent. |

Live parties, lobbies, hands, and turns are held by the game and party services rather than persisted as database tables.

## Modules

Module points follow the project rubric: Major = 2 points, Minor = 1 point.

| Type | Module | Points | Why it was chosen; implementation and contributors |
|---|---|---:|---|
| Major | Complete web-based game | 2 | Deliver a full playable game; Big Two client, lobby, rules, and results — Max. |
| Major | Remote players | 2 | Enable play across computers; Socket.IO game sessions — Max. |
| Major | Multiplayer (more than two players) | 2 | Support a full table; server-managed seats for up to four players — Max. |
| Major | Advanced 3D graphics | 2 | Make card play tactile and visual; Three.js table, cards, and hand — Max, Azrul. |
| Minor | Gamification | 1 | Reward continued play; XP, levels, achievements, badges, and easter eggs — Aisyah, Max, Azrul. |
| Minor | Spectator mode | 1 | Let users watch ongoing games; new spectators receive the current game state — Max. |
| Major | AI opponent | 2 | Allow solo or bot-filled games; game-bot chooses legal hands with varied play styles — Jeremy. |
| Major | Frameworks for frontend and backend | 2 | Use maintainable web frameworks on both sides; React/Vite and Express/TypeScript — Azrul and service owners. |
| Major | Real-time features | 2 | Keep game and social interactions responsive; Socket.IO and SSE — Max, Jeremy, Azrul, Aisyah. |
| Major | User interaction | 2 | Support social play; parties, chat, friends, profiles, and presence — Jeremy, Azrul, Aisyah. |
| Major | User management and authentication | 2 | Identify users and protect accounts; auth/session service and profile integration — Jeremy, Azrul. |
| Minor | Game statistics and match history | 1 | Track outcomes and progression; round results, totals, rankings, and player stats — Aisyah, Max, Azrul. |
|  | **Total** | **21** | |

## Features and Individual Contributions

| Feature / component | Contribution |
|---|---|
| Game client and game server | **Max:** 3D game client, lobby/game UI, authoritative multiplayer rules, seat management, reconnects, spectators, and result events. |
| Authentication, party, profile, and bot services | **Jeremy:** account/session APIs; party invites and presence; profile and settings APIs; bot lifecycle and decision controllers. |
| Database, friends, and game stats | **Aisyah:** PostgreSQL schemas and migrations; friendship requests and live events; XP, levels, badges, and achievements |
| Website and chat | **Azrul:** React UI, client state and service integration, site layout and navigation, ui web interfaces, and real-time chat. |

The service boundaries and shared TypeScript types address a central integration challenge: keeping independently developed APIs and real-time messages consistent. Other important implementation challenges include restoring a client to an active game after reconnecting and preventing retried game-end requests from counting a round twice; these are handled with game-state synchronization and persisted round IDs/responses.

## Resources

- [Big Two rules reference](https://www.pagat.com/climbing/bigtwo.html)
- [React documentation](https://react.dev/learn)
- [Three.js documentation](https://threejs.org/docs/)
- [Socket.IO documentation](https://socket.io/docs/v4/)
- [PostgreSQL 17 documentation](https://www.postgresql.org/docs/17/)
- [Drizzle ORM documentation](https://orm.drizzle.team/docs/overview)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- Service-specific API and development notes: `services/*/README.md`; database migrations: `infra/migrator/migrations/`.

## AI use

AI assistance was used to draft this README from the repository’s code and documentation. In that work, AI did not change application logic or generate project features; the implementation and technical decisions remain the team’s.
