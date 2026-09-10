#!/bin/sh

# 1. Read the mounted secret file into a variable
export DB_PASSWORD=$(cat "${PGPASSWORD}")
# Construct the URL using the variable
export DATABASE_URL="postgresql://${PGUSER}:${DB_PASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=game_stats_schema"

# 2. Start service to the foreground
echo "Starting game-stats service to the foreground..."
exec "$@"