#!/bin/sh

# 1. Read the mounted secret file into a variable
export PGPASSWORD=$(cat "${PGPASSWORD}")
# Construct the URL using the variable
export DATABASE_URL="${PGHOST}://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=profile-system_schema"

# 2. Start party-manager to the foreground
echo "Starting profile-system service to the foreground..."
exec "$@"