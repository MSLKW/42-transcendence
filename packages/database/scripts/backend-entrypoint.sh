#!/bin/sh

# Wait for the database to be ready
echo "Waiting for database..."
while ! pg_isready -h database -p 5432 -U "${PRISMA_USER}"; do
  sleep 2
done
echo "Database is ready!"

# Read the secret file into a variable
export DB_PASSWORD=$(cat /run/secrets/database_password)
# Construct the URL using the variable
export DATABASE_URL="postgresql://${PRISMA_USER}:${DB_PASSWORD}@database:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

# START THE APP IN THE FOREGROUND
echo "Starting Node server..."
exec "$@"