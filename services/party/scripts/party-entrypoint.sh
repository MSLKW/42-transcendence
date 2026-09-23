#!/bin/sh

# 1. Read the mounted secret file into a variable
export PGPASSWORD=$(cat "${PGPASSWORD_FILE}")
# Construct the URL using the variable
export DATABASE_URL="postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=party_schema"

# 2. Start party to the foreground
echo "Starting party service to the foreground..."
exec "$@"