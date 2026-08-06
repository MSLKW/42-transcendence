#!/bin/sh

# Read the secret file mounted by Docker and export it for psql and drizzle-kit
echo "[1/5]  Extracting postgres user password..."
if [ -f "/run/secrets/db_admin_password" ]; then
  export PGPASSWORD="$(cat /run/secrets/db_admin_password)"
else
  echo "[1/5] Error! Secret file /run/secrets/db_admin_password not found!"
  echo "[1/5] Failure! Exit failure migrator container with failure now..."
  exit 1
fi
echo "[1/5] Success extracting and exporting postgres user password!"

# 1. Wait for the postgresql to be ready
echo "[2/5]  Waiting for ${PG_HOST}..."
while ! pg_isready -h ${PG_HOST} -p ${PG_PORT}; do
  sleep 2
done
echo "[2/5]  ${PG_HOST} is ready!"


# # # 2. Apply Generate(DO NOT generate here, only for 1st time after editing, locally only)
# echo "[2.5/5] Drizzle generating SQL migration files into database..."
# npm run db:generate


# 2. Wait for initialization (The "Retry Loop" pattern)
echo "[3/5] Connection ready, applying migrations with retry loops logic..."

#     We try to migrate up to 5 times
MAX_RETRIES=2
COUNT=0
SUCCESS=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if npm run db:migrate; then 
    echo "\n[3/5]  Migrations applied successfully!"
    SUCCESS=true
    break
  else
    COUNT=$((COUNT+1))
    echo "[3/5]  Migration failed (Attempt $COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    
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
  echo "[3/5]  Error: Migrations failed after $MAX_RETRIES attempts."
  echo "[3/5]  Failure! Exit failure migrator container upon migration failure now..."
  exit 1
fi


# 4. apply grant permissions -> establishing private schemas for microservices to be 'loosely-coupled services'
echo "[4/5] Applying schema permissions for each microservices..."
if ! /usr/local/bin/grant-permissions.sh; then
  echo "[4/5] Error: Applying schema permissions failed"
  echo "[4/5] Failure! Exit failure migrator container upon schema permissions application failure now..."
  exit 1
fi
echo "[4/5] Schema permissions application succeed!"

# 5. Execute the container to the foreground
echo "[5/5] Success! Exit success migrator container now..."