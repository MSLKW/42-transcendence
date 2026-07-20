#!/bin/sh

# 1. Wait for the postgresql-rdbms to be ready
echo "Waiting for postgresql-rdbms..."
while ! pg_isready -h postgresql-rdbms -p 5432; do
  sleep 2
done
echo "postgresql-rdbms is ready!"


# # 2. Apply Migrations (DO NOT generate here)
# if [ -d migrations ] && find migrations -mindepth 1 -maxdepth 1 | grep -q .; then
#   echo "Drizzle executing the pending SQL migration files into database..."
#   npm run db:migrate
# else
#   echo "No migrations found; skipping db:migrate."
# fi


# 2. Wait for initialization (The "Retry Loop" pattern)
echo "Connection ready, applying migrations with retry logic..."

#     We try to migrate up to 5 times
MAX_RETRIES=2
COUNT=0
SUCCESS=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if npm run db:migrate; then
    echo "Migrations applied successfully!"
    SUCCESS=true
    break
  else
    COUNT=$((COUNT+1))
    echo "Migration failed (Attempt $COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    
    # If we reached the limit, stop retrying
    if [ $COUNT -eq $MAX_RETRIES ]; then
      break
    else
      sleep 5
    fi
  fi
done

# 3. Check for final success
if [ "$SUCCESS" = false ]; then
  echo "Error: Migrations failed after $MAX_RETRIES attempts."
  # echo "Exiting now..."
  # exit 1
  #! bug, check mhy not migrating, is it coz its already migrated before? 
fi


# 4. Start the app/studio in the foreground
echo "Starting Drizzle Studio server..."
exec "$@" 
# will take docker compose's command