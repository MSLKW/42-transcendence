FROM node:24-bookworm-slim
WORKDIR /app

# for healthcheck upon PostgreSQL (pg_isready)
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install all dependencies, thats needed ONLY FOR MIGRATOR'S DEPLOYEMENT
COPY package*.json ./
COPY infra/migrator/package.json ./infra/migrator/
RUN npm ci

# these 3 folders&files are a must for Migrator one-shot container only (sql files for migrating, other 2 used by drizzle-kit for migrating)
COPY infra/migrator/migrations ./infra/migrator/migrations
COPY infra/migrator/tsconfig.drizzle.json ./infra/migrator/tsconfig.drizzle.json
COPY infra/migrator/drizzle.config.ts ./infra/migrator/drizzle.config.ts

# Copy the script using the correct path from the root
COPY infra/migrator/scripts/migrator-entrypoint.sh /usr/local/bin/entrypoint.sh
COPY infra/migrator/scripts/grant-permissions.sh /usr/local/bin/grant-permissions.sh
COPY infra/migrator/scripts/updated-at-trigger.sql /usr/local/bin/updated-at-trigger.sql
COPY infra/migrator/scripts/user-settings-trigger.sql /usr/local/bin/user-settings-trigger.sql
RUN chmod +x    /usr/local/bin/entrypoint.sh \
                /usr/local/bin/grant-permissions.sh

# Use the script as the entrypoint
WORKDIR /app/infra/migrator
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# # no need to copy schemas! (COPY packages ./packages) => ignored by drizzle-kit migrate anyway
# # only drizzle-kit generate & drizzle-kit push commands will need to refer schema
# # which both commands done locally anyway, not for deployement 
