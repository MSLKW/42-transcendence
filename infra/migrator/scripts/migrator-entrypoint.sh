#!/bin/sh


# 1. Read the secret file mounted by Docker and export it for psql and drizzle-kit
echo "[1/7]  Extracting postgres user password..."
if [ -f "/run/secrets/db-admin-password" ]; then
  export PGPASSWORD="$(cat /run/secrets/db-admin-password)"
else
  echo "[1/7] Error! Secret file /run/secrets/db-admin-password not found!"
  echo "[1/7] Failure! Exit failure migrator container with failure now..."
  exit 1
fi
echo "[1/7] Success extracting and exporting postgres user password!"


# pg_isready only needs to confirm "the server is up and talking," 
# not "my specific app user/db exist" — so this is actually a more robust check than the current one,
# That said, keeping the explicit flags is also fine if you'd rather the healthcheck be self-documenting 
# — it's a style call, not a correctness one.
# while ! pg_isready -h ${PGHOST} -p ${PGPORT}; do
#
# 2. Wait for the postgresql to be ready
echo "[2/7]  Waiting for ${PGHOST}..."
while ! pg_isready; do
  sleep 2
done
echo "[2/7]  ${PGHOST} is ready!"


# #. Apply Generate
# (WARNING! generate is only done locally, never during deployement)


# 3. Wait for initialization (The "Retry Loop" pattern)
echo "[3/7] Connection ready, applying migrations with retry loops logic..."

# We try to migrate up to (MAX_RETRIES) times
MAX_RETRIES=2   
COUNT=0
SUCCESS=false

while [ $COUNT -lt $MAX_RETRIES ]; do
  if npm run db:migrate; then 
    echo "\n[3/7]  Migrations applied successfully!"
    SUCCESS=true
    break
  else
    COUNT=$((COUNT+1))
    echo "[3/7]  Migration failed (Attempt $COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    
    # If we reached the limit, stop retrying
    if [ $COUNT -eq $MAX_RETRIES ]; then
      break
    else
      sleep 5
    fi
  fi
done

# Check for final success
if [ "$SUCCESS" = false ]; then
  echo "[3/7]  Error: Migrations failed after $MAX_RETRIES attempts."
  echo "[3/7]  Failure! Exit failure migrator container upon migration failure now..."
  exit 1
fi


# 4. apply grant permissions -> establishing private schemas for microservices to be 'loosely-coupled services'
echo "[4/7] Applying Postgres's Grant Privileges for each schemas for each microservices..."
if ! /usr/local/bin/grant-permissions.sh; then
  echo "[4/7] Error: Postgres's Grant Privileges application failed"
  echo "[4/7] Failure! Exit failure migrator container upon Postgres's Grant Privileges application failure now..."
  exit 1
fi
echo "[4/7] Postgres Grant Privileges application succeed!"


# 5. apply updateAt trigger after all schemas and tables are created through completed migrations above
echo "[5/7] Applying Postgres updatedAt Trigger for debugging purposes..."
if ! psql -v ON_ERROR_STOP=1 -f /usr/local/bin/updated-at-trigger.sql; then
  echo "[5/7] Error: Applying Postgers updatedAt Trigger failed"
  echo "[5/7] Failure! Exit failure migrator container upon Postgres updatedAt Trigger application failure now..."
  exit 1
fi
echo "[5/7] Postgres updatedAt Trigger application succeed!"


# 6. apply triggers after all schemas and tables are created through completed migrations above
echo "[6/7] Applying Postgres userSettings Trigger for working eagerly (write on account creation)..."
if ! psql -v ON_ERROR_STOP=1 -f /usr/local/bin/user-settings-trigger.sql; then
  echo "[6/7] Error: Applying Postgers userSettings Trigger failed"
  echo "[6/7] Failure! Exit failure migrator container upon Postgres userSettings Trigger application failure now..."
  exit 1
fi
echo "[6/7] Postgres userSettings Trigger application succeed!"

# 7. Completed all jobs , exit the one-shot container 
echo "[7/7] Complete successfully all migrations and psql executions!"
echo "[7/7] Success! Exit success migrator container now..."


# ANY SEEDINGS CAN BE PLACED HERE AFTER ALL DDL IS COMPLETE
# DDL = Data Definition Language 
#   the SQL category that defines database structure.
#   (CREATE, ALTER, DROP)
# as opposed to DML = Data Manipulation Language
#   the SQL category that defines which operate on the data inside that structure.
#   (SELECT/INSERT/UPDATE/DELETE/MERGE) 

