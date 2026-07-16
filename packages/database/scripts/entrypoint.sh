#!/bin/sh

# 1. Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432 -U "${POSTGRES_USER}"; do
  sleep 2
done
echo "postgresql-rdbms is ready!"

# 2. Apply Migrations (DO NOT generate here)
# echo "Drizzle generating database SQL migration files into migrations/..."
# npm run db:generate
echo "Drizzle executing the pending SQL migration files into database..."
npm run db:migrate


# 3. Start the app/studio in the foreground
echo "Starting Drizzle Studio server..."
exec "$@" # will take docker compose's command