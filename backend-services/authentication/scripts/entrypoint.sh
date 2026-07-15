#!/bin/sh

# Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432 -U "${POSTGRES_USER_ADMIN}"; do
  sleep 2
done
echo "postgresql-rdbms is ready!"

# Read the secret file into a variable
export DB_PASSWORD=$(cat /run/secrets/database_password)
# Construct the URL using the variable
export DATABASE_URL="postgresql://${POSTGRES_USER_ADMIN}:${DB_PASSWORD}@postgresql-rdbms:${POSTGRES_PORT}/${POSTGRES_DB}?schema=auth_schema"

# START THE APP IN THE FOREGROUND
echo "Starting Node server..."
exec "$@"