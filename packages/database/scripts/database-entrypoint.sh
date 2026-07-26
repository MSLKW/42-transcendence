#!/bin/sh

# 1. Wait for the postgresql to be ready
echo "[1/5]  Waiting for ${DB_HOST}..."
while ! pg_isready -h ${DB_HOST} -p 5432; do
  sleep 2
done
echo "[2/5]  ${DB_HOST} is ready!"


# # # 2. Apply Generate(DO NOT generate here, only for 1st time locally only)
# echo "[2.5/5] Drizzle generating SQL migration files into database..."
# npm run db:generate


# 2. Wait for initialization (The "Retry Loop" pattern)
echo "[3/5]  Connection ready, applying migrations with retry loops logic..."

#     We try to migrate up to 5 times
MAX_RETRIES=2
COUNT=0
SUCCESS=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if npm run db:migrate; then
    echo "\n[4/5]  Migrations applied successfully!"
    SUCCESS=true
    break
  else
    COUNT=$((COUNT+1))
    echo "[4/5]  Migration failed (Attempt $COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    
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
  echo "[4/5]  Error: Migrations failed after $MAX_RETRIES attempts."
  echo "[4/5]  Exiting migrator container upon migration failure now..."
  exit 1
fi


# 4. Execute the container to the foreground
echo "[5/5]  Starting migrator..."
# exec node /app/packages/database/dist/index.js
cd /app/packages/database
exec "$@" 
# will take docker compose's command