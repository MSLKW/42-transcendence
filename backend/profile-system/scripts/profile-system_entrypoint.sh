#!/bin/sh

# 1. Read the mounted secret file into a variable
export DB_PASSWORD=$(cat "${DB_PASSWORD_FILE}")
# Construct the URL using the variable
export DATABASE_URL="${DB_HOST}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=profile-system_schema"

# 2. Start party-manager to the foreground
echo "Starting profile-system service to the foreground..."
exec "$@"