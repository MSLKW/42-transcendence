#!/bin/sh

# Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432 -U "${POSTGRES_USER_ADMIN}"; do
  sleep 2
done
echo "postgresql-rdbms is ready!"

# migrations

# START THE APP IN THE FOREGROUND
echo "Starting Drizzle Studio server..."
exec "$@" # will take docker compose's command