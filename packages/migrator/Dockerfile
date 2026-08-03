#Builder
FROM node:24-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/auth_schema/package.json ./packages/database/
COPY packages/game_schema/package.json ./packages/database/
COPY packages/party-manager/package.json ./packages/database/
COPY packages/profile-system/package.json ./packages/database/
COPY packages/db-client/package.json ./packages/database/

# Install dependencies at the root
RUN npm ci

# Copy all the actual source code
COPY . .

RUN npm run --prefix packages/migrator build 

#Runner
FROM node:24-bookworm-slim AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/migrator/package.json ./packages/migrator/

ENV NODE_ENV=production
RUN npm ci --omit=dev

# postgresql-client
# => a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# => contains: Connectivity Testing (pg_isready)
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# all services that communicate with database need this line => database's compiled js files
COPY --from=builder /app/packages/migrator/dist ./packages/migrator/dist 
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
CMD ["npm", "start"]