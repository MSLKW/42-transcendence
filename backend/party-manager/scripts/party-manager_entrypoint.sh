#!/bin/sh

# 1. Read the mounted secret file into a variable
export DB_PASSWORD=$(cat "${DB_PASSWORD_FILE}")
# Construct the URL using the variable
export DATABASE_URL="${DB_HOST}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=party-manager_schema"

# 2. Start party-manager to the foreground
echo "Starting party-manager service to the foreground..."
exec "$@"