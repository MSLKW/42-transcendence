## Index of this DATABASE_README.md
- [Binary Tree for Big2](#binary-tree-for-big2)
- [services/auth vs packages/auth-utils](#servicesauth-vs-packagesauth-utils)
- [database/ as a package + all 3 package.json + Singleton Prisma object](#database-as-a-package--all-3-packagejson--singleton-prisma-object)
- [Calling database through API vs Shared Library](#calling-database-through-api-vs-shared-library)
- [api-gateway/ as a microservice (code)](#api-gateway-as-a-microservice-code)
- [api-gateway/ as a microservice (flow)](#api-gateway-as-a-microservice-flow)

<br>
<br>
<br>


# Binary Tree for Big2
```
/big2
  ├── /packages
  │   ├── database/         <-- SHARED DATABASE LIBRARY (Prisma, PostgreSQL) , (every services/*/ imports the DB client from @myapp/database)
  │   └── auth-utils/       <-- SHARED SECURITY/TOKENS CHECK (the maths logic only)
  │
  ├── /services
  │   ├── chat/             <-- A MICROSERVICE (Handles WebSocket/Chat Logic)
  │   ├── game/             <-- A MICROSERVICE (Handles Game Loop/Logic)
  │   ├── bot/              <-- A MICROSERVICE (Handles Game-Bots logic)
  │   ├── authentication/   <-- A MICROSERVICE (Handles Authentications)
  │   └── api-gateway/      <-- A MICROSERVICE (The RECEPTION DESK for React)
  │
  └── /frontend             <-- A MICROSERVICE (The website)
```
<br>
<br>
<br>

# services/auth vs packages/auth-utils
```
/packages
  └── auth-utils/      <-- The "Shared Math": Encryption, token verification logic.
/services
  └── auth/            <-- The "Active Service": Handles the database, logins, and signups.
```
- If your app is complex, you actually end up with both
- **Why?** Because the api-gateway needs the logic (the math from auth-utils) to check tokens quickly, but the auth-service needs to run to handle the heavy lifting (writing to the database when a user signs up).
<br>
<br>
<br>


<!--
It is completely normal to feel dizzy! Let’s simplify the "Why" behind all these files. Think of it as a **hierarchy of responsibilities**.

You are not adding "extra" files; you are just following the rules of how a professional project keeps everything organized.

### 1. Why three different `package.json` files?

Every project, service, or library needs to declare what it needs to run.

* **The Root `package.json`:** This is the **"Manager."** It doesn't actually run your game code. Its only job is to say: *"Hey, look inside `packages/` and `services/`—those are all part of one big project."* It connects everything together.
* **The `/packages/database/package.json`:** This is the **"Kitchen Recipe."** It only lists what the Database needs (like `prisma`). It doesn't care about `socket.io` or `phaser`.
* **The `/services/chat/package.json`:** This is the **"Waiter's Order."** It lists what the Chat service needs (like `express`, `socket.io`, **AND** your `@my-game/db` package).

**They are separate because they have different jobs.** If you put everything in one file, your `chat` service would be forced to download all the game engine files, and your `game` engine would be forced to download all the chat server files. That would make your project massive and slow.

---

### 2. Is everything a Singleton?

**No, only the ones that need to be.**

* **Prisma Client:** This *must* be a singleton. Because it holds the connection to your database, if you create 10 copies, you will crash your PostgreSQL server. That is why we put it in `packages/database`.
* **Other things (like express or socket.io):** These are **not** singletons. Each service (`chat`, `game`) runs its own instance of `express` on its own port. They are completely independent.

---

### 3. The "Dependency" Rule

Here is the secret to not getting dizzy: **Dependencies only flow UP.**

* `services` (like `chat`) look at the `packages` (like `database`).
* `packages` **never** look at the `services`.

**Think of it like this:**

1. You (the Database Package) are the **Power Grid**.
2. The Services (Chat, Game) are the **Appliances** (Toaster, Fridge).
3. The Root is the **House**.

The Appliances plug into the Power Grid. The Power Grid does not plug into the Toaster!

---

### 4. What you *actually* put in the root `package.json`
-->


# Making database/ as a package + all 3 package.json + Singleton Prisma object
- To make this work, you are going to use **Monorepo Workspaces**. This is the standard industry way to share code (like your database client) between services without needing to publish it to a public website (like npmjs.com).
- Here is the explicit setup to make your `database` folder the "Single Source of Truth."

### The Project Structure
```
/my-game-app
  ├── package.json            <-- Root file (defines workspaces)
  │  
  ├── /packages
  │   └── database            <-- Your Database Singleton
  │       ├── package.json    <-- Install @prisma/client & prisma
  │       └── prisma/
  │           └── schema.prisma
  │
  └── /services
      ├── chat/           
      │   └── package.json    <-- Uses your database
      │
      ├── game/           
      │   └── package.json    <-- Uses your database
      │
      └── authentication/ 
          └── package.json    <-- Uses your database

```

### 1. At the Root
- You only put the **"Workspace Configuration"** there. You do **not** put your dependencies there. It should look almost empty like this:

  `/package.json` (at the root - tell Node.js where your services are)
    ```json
    {
      "name": "my-game-app",
      "private": true,
      "workspaces": [
        "packages/*",
        "services/*",
        "frontend/*"
      ]
    }
    ```
- That's it! It's just a map for your computer to know where all the folders are.

  *This allows the folder `database/` to talk to `chat/` locally.*


---

### 2. At the packages/

`packages/database/package.json` (must define the name of database's library)
```json
{
  "name": "@my-game/db", // The name of database's library
  "version": "1.0.0",
  "main": "index.ts",
  "dependencies": {
    "@prisma/client": "^5.0.0"
  }
}
```

`packages/database/index.ts` (export **Singleton Prisma object**)
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') 
  globalForPrisma.prisma = prisma;
```

---

### 3. At services/*/ or frontend/

`services/chat/package.json`. (simply point to the name of databse's library)
```json
{
  "name": "chat-service",
  "dependencies": {   // this is where you point to database's library
    "@my-game/db": "*" 
  }
}

// "*" = tells your package manager (npm/yarn/pnpm) 
// to look in the workspace for a package named `@my-game/db`
```


`services/chat/index.ts`
```typescript
import { prisma } from '@my-game/db'; // It just works!

async function getMessages() {
  return await prisma.message.findMany();
}
```
<!--
---

### Why this is the "Pro" way:

1. **Strict Security:** The `chat` service doesn't have the `prisma` CLI installed. It **cannot** run `migrate` or `db push`. It only has the `prisma` **object** to read/write data. You are the only one who can run the CLI commands in the `packages/database` folder.
2. **No Redundancy:** You never have to copy `schema.prisma`. If you add a field to your database, you run `npx prisma generate` inside the `packages/database` folder. Every other service automatically sees the new fields in their IDE autocompletion.
3. **Singleton behavior:** Because the `database` package is loaded by Node.js, the `prisma` constant in the `index.ts` file acts as a **Singleton** for the entire running application. It will share the same connection pool across your whole app.

**Quick question:** Are you currently using a specific package manager like **npm**, **pnpm**, or **yarn**? Each one handles the "workspaces" feature slightly differently, and I want to make sure you use the right command to link them.
-->
<br>
<br>
<br>


# Calling database through API vs Shared Library 
### 1. Database Side (`packages/database`)
- You write the "recipes" here. You never write raw SQL or Prisma calls inside your services—you only call these functions.

  `/packages/database/src/logic/chat-logic.ts`
  ```typescript
  import { prisma } from '../client'; // Your Singleton

  // This function is the "Logic" - used by everyone
  export const getMessagesByRoom = async (roomId: string) => { 
    return await prisma.message.findMany({ 
      where: { roomId },
      orderBy: { createdAt: 'asc' }
    });
  };
  ```

### 2. The Microservice Side: Direct Access (`services/chat`)
- Because the `chat` service is part of your Monorepo or backend microservices, it doesn't need an API. It calls your code directly. It is **blazing fast** and **Type Safe**.

  `/services/chat/src/index.ts`
  ```typescript
  import { getMessagesByRoom } from '@my-game/db'; 

  const messages = await getMessagesByRoom('room-123'); // This runs instantly, no network call!
  console.log(messages); 
  ```

### 3. The API Side: Exposed Access (`services/api`)
- This service is for the frontend or "outside world" (e.g., if you build a React frontend that needs to show messages, or if a partner app needs to see data). It uses your logic but wraps it in an HTTP response.

  `/services/api-gateway/src/routes/messages.ts`
  ```typescript
  import { getMessagesByRoom } from '@my-game/db';

  export const getMessagesHandler = async (req, res) => {
    const roomId = req.params.roomId;
    
    const messages = await getMessagesByRoom(roomId);   // Reuse the exact same logic!
    res.json({ success: true, data: messages });        // Now it's an API
  };
  ```
<br>
<br>
<br>

# api-gateway/ as a microservice (code)
### 1. Binary tree
- To design a robust `api-gateway` in a microservices architecture, you need to think of it as a **traffic controller**. 
- It should not contain *business logic* (like game rules or chat history). 
- Instead, it contains **routing, middleware, and request forwarding logic**.
- You organize your `api-gateway` by "delegating" tasks. Each service (Chat, Game) gets its own route file.

  ```
  /services/api-gateway
  ├── /src
  │   ├── /config               <-- Environment variables, port, service URLs
  │   │   └── gateway.ts
  │   │
  │   ├── /middleware           <-- The "Security Guards"
  │   │   ├── auth.ts           <-- Calls auth-utils (or Auth Service) to verify tokens
  │   │   ├── rateLimiter.ts
  │   │   └── error.ts
  │   │
  │   ├── /routes               <-- The "Receptionist Desk"
  │   │   ├── auth.routes.ts    <-- Only handles /api/chat/*  (Forwards to Auth Service)
  │   │   ├── chat.routes.ts    <-- Only handles /api/chat/*  (Forwards to Chat Service)
  │   │   └── game.routes.ts    <-- Only handles /api/game/*  (Forwards to Game Service)
  │   │
  │   ├── /proxy                <-- The "Transport System"
  │   │   └── http-proxy.ts     <-- Uses 'http-proxy' or 'axios' to send requests
  │   │
  │   └── index.ts              <-- Main entry point (the app start)
  |
  ├── .env                      <-- API Keys, URL endpoints (e.g., CHAT_SERVICE_URL=...)
  ├── Dockerfile                <-- Containerizes the gateway
  ├── package.json              <-- Dependencies (express, http-proxy, cors, etc.)
  └── tsconfig.json
  ```

### 2. index.ts
- Inside your **`index.ts`**, you are just telling the server: *"If the request starts with `/chat`, send it to the Chat Router."*

  `services/api-gateway/index.ts`
  ```typescript
  import chatRoutes from './routes/chat.routes';
  import gameRoutes from './routes/game.routes';

  // The "Switchboard"
  app.use('/api/chat', chatRoutes); 
  app.use('/api/game', gameRoutes);
  ```

### 3. Gateway / Handle Permissions (The "Security Guard" role)
- This is where the Gateway earns its keep. You use **Middleware**. Middleware is a function that runs *before* your route code.

  `services/api-gateway/middleware/auth.middleware.ts`
  ```typescript
  export const checkPermissions = (req, res, next) => {
    const token = req.headers.authorization;
    if (isTokenValid(token)) {
      next(); // "Guard says: OK, you can enter the Chat office."
    } else {
      res.status(401).send("Unauthorized"); // "Guard says: STOP!"
    }
  };
  ```

  `services/api-gateway/routes/chat.routes.ts`
  ```typescript
  router.use(checkPermissions); // Every request to /api/chat MUST pass this guard first
  router.post('/send', handleSendMessage);
  ```
<br>
<br>
<br>

# api-gateway/ as a microservice (flow)
### How this works (The Flow)
1. **Frontend** sends a request to `GET /api/chat/history`.
2. **`index.ts`** receives it and runs the **Global Middleware** (logs it, checks rate limits).
3. **`chat.routes.ts`** detects that this belongs to the **Chat Service**.
4. **`auth.ts` Middleware** runs *first*:
* It checks the `Authorization` header.
* It calls `auth-utils` (or queries your DB) to see if the user is logged in.
* If **Valid**, it proceeds. If **Invalid**, it returns `401 Unauthorized` immediately.
5. **`http-proxy.ts`** forwards the request to the `Chat` service's internal URL (e.g., `http://chat-service:3002/history`).
6. **Chat Service** finishes the work and returns the data back through the proxy to the user.

---

### Why this is a "Full Picture" structure:
* **Explicit Separation:** Notice there is **no database logic** here. The Gateway doesn't know about `prisma`. It only knows about *URLs* and *Tokens*.
* **Proxy Logic:** By separating the `proxy` logic, you make it easy to change how you talk to other services (e.g., you can switch from HTTP to gRPC later without touching your route definitions).
* **The Middleware is the Key:** This is where you put your `auth-utils` logic. By placing it here, it applies to *all* routes without having to copy-paste the "is the user logged in" code into the Chat or Game service.

---

### Pro-Tip for your Teammate:

When you show them this, emphasize the **"Proxy Pattern"**:

> "The Gateway doesn't execute the code for Chat or Game; it just acts as a tunnel. This means we can deploy a new version of the `Game` service without ever restarting the `Gateway` or the `Chat` service. It decouples everything."

It keeps your code tidy and ensures that the Gateway stays focused purely on **routing and security.**

