FROM node:24-bookworm-slim
WORKDIR /app

RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY infra/migrator/package.json ./infra/migrator/
# copy schemas
COPY packages ./packages

# Install dependencies at the root
# RUN npm ci
# ENV NODE_ENV=production
# RUN npm ci --omit=dev
RUN npm ci

# RUN apt-get update && \
#     apt-get install -y postgresql-client && \
#     rm -rf /var/lib/apt/lists/*

# these 3 folders&files are a must for Migrator one-shot container only (sql files for migrating, other 2 used by drizzle-kit for migrating)
COPY infra/migrator/migrations ./infra/migrator/migrations
COPY infra/migrator/tsconfig.drizzle.json ./infra/migrator/tsconfig.drizzle.json
COPY infra/migrator/drizzle.config.ts ./infra/migrator/drizzle.config.ts

# Copy the script using the correct path from the root
COPY infra/migrator/scripts/migrator-entrypoint.sh /usr/local/bin/entrypoint.sh
COPY infra/migrator/scripts/grant-permissions.sh /usr/local/bin/grant-permissions.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/grant-permissions.sh

# Use the script as the entrypoint
WORKDIR /app/infra/migrator
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]