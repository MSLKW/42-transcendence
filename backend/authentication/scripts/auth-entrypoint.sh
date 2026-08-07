#!/bin/sh

# 1. Read the mounted secret file into a variable
export DB_PASSWORD=$(cat "${PGPASSWORD}")
# Construct the URL using the variable
export DATABASE_URL="postgresql://${PGUSER}:${DB_PASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=auth_schema"

# 2. Start auth to the foreground
echo "Starting authentication service to the foreground..."
exec "$@"