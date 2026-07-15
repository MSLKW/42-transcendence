#!/bin/sh

# Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432 -U "${POSTGRES_USER}"; do
  sleep 2
done
echo "Database is ready!"

# Read the secret file into a variable
export DB_PASSWORD=$(cat /run/secrets/database_password)
# Construct the URL using the variable
export DATABASE_URL="postgresql://${POSTGRES_USER}:${DB_PASSWORD}@postgresql-rdbms:${POSTGRES_PORT}/${POSTGRES_DB_NAME}?schema=public"

# START THE APP IN THE FOREGROUND
echo "Starting Node server..."
exec "$@"