To manage your database workflow efficiently, you need to configure `drizzle-kit` commands in your `packages/database/package.json`. These commands will allow you to generate migrations, apply them, and manage your studio.

### 1. Recommended `scripts` for `package.json`

Add these to your `packages/database/package.json`. These ensure your team uses consistent commands.

```json
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}

```

* **`db:generate`**: Scans your `src/*.schema.ts` files and creates SQL migration files in your `migrations/` folder.


* **`db:migrate`**: Executes the pending SQL migration files against your database.
* **`db:push`**: Useful for rapid prototyping. It syncs your schema directly to the database without generating migration files.


* **`db:studio`**: Launches the Drizzle Studio visual UI.



---

### 2. Docker & Entrypoint Integration

Your `drizzle-orm` container runs `drizzle-kit studio` via the `command` in `docker-compose.yml`. To handle migrations automatically before the app starts, update your `entrypoint.sh`.

**Updated `packages/database/scripts/entrypoint.sh`:**

```sh
#!/bin/sh

# Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432 -U "${POSTGRES_USER}"; do
  sleep 2
done
echo "postgresql-rdbms is ready!"

# Run migrations automatically every time the container starts
echo "Running database migrations..."
npx drizzle-kit migrate

# START THE APP / COMMAND
echo "Starting Drizzle Studio server..."
exec "$@" 

```

---

### 3. Summary of Workflow

| Action | Command | Usage |
| --- | --- | --- |
| **Schema Change** | `npm run db:generate` | Run locally whenever you edit a `*.schema.ts` file. |
| **Apply Changes** | `npm run db:migrate` | Run to update your local or production database. |
| **Visualize Data** | `npm run db:studio` | Run locally to see your tables and rows in your browser. |

### Important Notes:

* **Drizzle Studio**: Your current `docker-compose.yml` already runs `npx drizzle-kit studio --port ${DRIZZLE_STUDIO_PORT}` as the container command. This is perfect; it will start automatically when the container comes up.


* **Migrations**: Since you have an `init.sql` for schema creation, ensure your `drizzle.config.ts` points to the correct migration folder. The `entrypoint.sh` logic above ensures that as soon as the Postgres container is healthy, your Drizzle migrations are applied before the studio starts.


* **Development**: While working, you can simply run `npm run db:generate` locally in the `packages/database` folder whenever you change your schemas in `src/`.