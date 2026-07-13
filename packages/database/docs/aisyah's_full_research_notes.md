# Comprehensive Fullstack Architecture & Prisma Guide
**Project:** 3D Big2 Web App Game (PERN Stack + Docker + Monorepo Microservices)<br>
**Purpose:** Documentation and onboarding guide for the team regarding Database Management, Microservices, and API Gateway Architecture.<br>
**Source:** Full chat history with Gemini, https://share.gemini.google/sRqvtgouhwR7 

---

## 1. Prisma ORM Essentials & Workflow
Prisma acts as the ORM layer between Node.js/TypeScript and PostgreSQL. 

### Core Commands Reference
**Setup & Formatting**
* `npx prisma init`: Initializes the `/prisma` folder and `.env` file (Run once).
* `npx prisma format`: Auto-formats and indents `schema.prisma` (Like Prettier).
* `npx prisma validate`: Checks `schema.prisma` for syntax/logical errors without DB actions.

**Migration (Production/Safe Workflow)**
* `npx prisma migrate dev`: Detects schema changes, creates a SQL migration file, and applies it to the local DB. (Use `--name <name>` to name it, e.g., `--name add_users`).
* `npx prisma migrate dev --create-only`: Creates the SQL migration file but *doesn't* apply it yet.
* `npx prisma migrate deploy`: Applies pending migrations to Production/Docker. Does *not* create new files.
* `npx prisma migrate status`: Checks if the DB is synced with migration files.
* `npx prisma migrate reset`: Wipes local DB clean and re-runs all migrations.
* `npx prisma migrate resolve`: Fixes failed or partially applied migrations.

**Prototyping (Quick & Dirty Workflow)**
* `npx prisma db push`: Syncs schema directly to DB without creating migration history. (Fast, but loses audit trail. Use `migrate dev` for real projects).
* `npx prisma db pull`: Introspects an existing DB to generate `schema.prisma` based on current tables.

**Data & Lifecycle Management**
* `npx prisma generate`: Regenerates the TS client so the IDE recognizes new models/fields.
* `npx prisma studio`: Opens a local GUI browser to view/edit DB data.
* `npx prisma db seed`: Runs custom seed scripts to populate initial data.
* `npx prisma db execute`: Runs raw SQL scripts for complex operations unsupported by ORM.

**Extra Flags**
* `--schema <path>`: Points to a specific schema if not in the default location.
* `--preview-feature`: Required to use beta/unreleased Prisma features.

### Prisma in Docker Integration
* **DATABASE_URL:** In Docker, `localhost` is the container itself. URL must point to the Docker compose service name (e.g., `postgresql://user:password@postgres:5432/mydb`).
* **Startup Command:** Always run migrations before starting the Node server in the Dockerfile/entrypoint: 
  `npx prisma migrate deploy && node dist/index.js`

---

## 2. Database Strategy: The "Modular Monolith"
For a project of this scale, using a **Modular Monolith** (one shared PostgreSQL database used by all services) is recommended over true Microservices (Database-per-service). 

### Postgres Schema vs. Prisma Schema
* **PostgreSQL Schema:** A "folder" inside the database (e.g., `public`, `chat`, `auth`).
* **Prisma Schema (`schema.prisma`):** The text blueprint defining tables and TS types.

### Architectural Recommendation
* **Use the Default `public` Schema:** Do not over-engineer with multiple private Postgres schemas (which require manual `GRANT/REVOKE` permissions). Everything goes into the default `public` schema.
* **One Single `schema.prisma` File:** Do not split the Prisma file. Group tables using comment blocks:
  ```prisma
  // --- AUTH MODELS ---
  model User { ... }
  
  // --- CHAT MODELS ---
  model Message { ... }
  ```
* *Why?* This prevents cross-domain join limitations, allows for easy `include` queries, and reduces structural headache. 

---

## 3. Monorepo Architecture: Workspaces & Organization
The app uses a Monorepo Workspace approach (managed by `npm`, `pnpm`, or `yarn`). Dependencies flow UP: Services rely on packages.

### Folder Structure (The "Binary Tree")
```text
/my-big2-web-game-app
  ├── package.json               <-- ROOT (The "Master Breaker Panel" / Workspace Map)
  │
  ├── /packages                  <-- THE "FACTORY" (Libraries / Tools)
  │   ├── /database              <-- Single Source of Truth for Prisma
  │   │   ├── package.json
  │   │   ├── index.ts           <-- Exports Singleton Prisma Client & Logic functions
  │   │   └── /prisma
  │   │       └── schema.prisma
  │   └── /auth-utils            <-- Shared security logic
  │ 
  ├── /services                  <-- THE "CHEFS" (Active backend processes)
  │   ├── /api-gateway           <-- The "Receptionist" (Public facing)
  │   ├── /chat                  <-- Private backend service
  │   ├── /authentication        <-- Private backend service
  │   ├── /bot                   <-- Private backend service
  │   └── /game                  <-- Private backend service
  │
  └── /frontend                  <-- THE "SHOWROOM" (React UI)
```

### The Roles of `package.json` and `node_modules`
* **Root `package.json`:** Does *not* hold code dependencies. It holds the `workspaces` array (`"packages/*"`, `"services/*"`). It acts as the command center to symlink internal packages and run global commands (e.g., via a Makefile).
* **Local Development `node_modules`:** Uses "Hoisting." The root folder has one massive `node_modules` to save space. Services use shortcuts (symlinks) to access it, making updates fast.

---

## 4. The Database Package & Singleton Pattern
The database must be treated as a single, centralized library (Package), NOT a microservice. This prevents multiple connections from crashing PostgreSQL.

**Setup (`packages/database/package.json`):**
```json
{
  "name": "@my-game/db",
  "dependencies": { "@prisma/client": "^5.0.0" }
}
```

**Singleton Initialization (`packages/database/index.ts`):**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export "Recipes" (Wrapper functions) for other services to use
export const getMessagesByRoom = async (roomId: string) => {
  return await prisma.message.findMany({ where: { roomId } });
};
```
* **Guardianship:** The DB owner modifies `schema.prisma` via PRs (Pull Requests). The rest of the team just imports the functions without owning the schema.

---

## 5. Connecting Services: Shared Library vs. API
How do other parts of the app access the database? 

### The "Two Rooms" Rule
**World A: The Server Room (Backend / Node.js)**
* **Who lives here?** `/services/chat`, `/services/game`, `/services/api-gateway`.
* **Access Method:** **Shared Library**. Since these run on the secure backend, they can directly import the database package for blazing-fast memory access.
  ```typescript
  // In services/chat/index.ts
  import { getMessagesByRoom } from '@my-game/db'; 
  const msgs = await getMessagesByRoom('room1'); // Direct, Type-Safe, No network delay
  ```

**World B: The Public Room (Frontend / React)**
* **Who lives here?** The User's Browser.
* **Access Method:** **API ONLY**. The frontend is "blind" and publicly exposed. It cannot hold DB passwords or speak PostgreSQL. It must use HTTP requests (e.g., `fetch()`) to talk to the Server Room.

---

## 6. The API Gateway: Security & Traffic Control
React needs an API. Instead of letting every service (like chat or game) handle internet traffic and permissions, we build an **API Gateway Microservice**.

### The Analogy
* **The Factory (Backend):** Where raw materials (Database) are processed into products (Game/Chat logic). Customers cannot enter.
* **The Showroom (React):** Where the user looks at the finished product (e.g. game points).
* **The Receptionist/Store Clerk (API Gateway):** The user asks the clerk for data. The clerk checks permissions, walks into the factory, gets the data, and brings it back to the user.

### API Gateway Implementation
The API Gateway is its own Microservice that isolates backend routes and acts as a central security guard. It prevents internal services (like Chat/Game) from ever being exposed to the internet.

**Modular Route Structure:**
```text
/services/api/
├── index.ts             <-- Main Switchboard
├── /routes
│   └── messages.ts      <-- Route definitions
```

**The Switchboard (`index.ts`):**
```typescript
// /services/api/src/routes/messages.ts
import { getMessagesByRoom } from '@my-game/db'; // Your Shared Library

export const getMessagesHandler = async (req, res) => {
  const roomId = req.params.roomId;
  
  // Reuse the exact same logic!
  const messages = await getMessagesByRoom(roomId);
  
  // Now it's an API
  res.json({ success: true, data: messages });
};
```

This guarantees the React frontend never accesses the database directly and protects sensitive data while maintaining high development speed.