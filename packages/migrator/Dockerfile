FROM node:24-bookworm-slim
WORKDIR /app

COPY package*.json                                  ./
COPY packages/migrator/package.json                 ./packages/migrator/

# Install dependencies at the root
# RUN npm ci
ENV NODE_ENV=production
RUN npm ci --omit=dev

RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# these 3 folders&files are a must for Migrator one-shot container only (sql files for migrating, other 2 used by drizzle-kit for migrating)
COPY packages/migrator/migrations ./packages/migrator/migrations
COPY packages/migrator/tsconfig.drizzle.json ./packages/migrator/tsconfig.drizzle.json
COPY packages/migrator/drizzle.config.ts ./packages/migrator/drizzle.config.ts

# Copy the script using the correct path from the root
COPY packages/migrator/scripts/migrator-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the script as the entrypoint
WORKDIR /app/packages/migrator
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]