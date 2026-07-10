#!/bin/sh
set -e

echo "Waiting for database..."
while ! pg_isready -h database -p "${DATABASE_PORT}" -U "${PRISMA_USER}"; do
	sleep 2
done
echo "database is ready!"

DB_PASSWORD=$(cat /run/secrets/database_password)
export DATABASE_URL="postgresql://${PRISMA_USER}:${DB_PASSWORD}@database:${DATABASE_PORT}/${DATABASE_NAME}?schema=public"

echo "Starting auth server..."
exec "$@"