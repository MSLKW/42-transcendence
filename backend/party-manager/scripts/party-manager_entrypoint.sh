#!/bin/sh

# 1. Read the mounted secret file into a variable
export PG_PASSWORD=$(cat "${PG_PASSWORD_FILE}")
# Construct the URL using the variable
export DATABASE_URL="${PG_HOST}://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB_NAME}?schema=party-manager_schema"

# 2. Start party-manager to the foreground
echo "Starting party-manager service to the foreground..."
exec "$@"