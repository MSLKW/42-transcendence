#!/bin/sh

# 1. Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432; do
  sleep 2
done
echo "postgresql-rdbms is ready!"

# 2. Apply Migrations (DO NOT generate here)
if [ -d migrations ] && find migrations -mindepth 1 -maxdepth 1 | grep -q .; then
  echo "Drizzle executing the pending SQL migration files into database..."
  npm run db:migrate
else
  echo "No migrations found; skipping db:migrate."
fi

# 3. Start the app/studio in the foreground
echo "Starting Drizzle Studio server..."
exec "$@" 
# will take docker compose's command