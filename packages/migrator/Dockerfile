#Builder
FROM node:24-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/database/package.json ./packages/database/

# Install dependencies at the root
RUN npm ci

# Copy all the actual source code
COPY . .

RUN npm run --prefix packages/database build 

#Runner
FROM node:24-bookworm-slim AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/database/package.json ./packages/database/

ENV NODE_ENV=production
RUN npm ci --omit=dev

# postgresql-client
# => a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# => contains: Connectivity Testing (pg_isready)
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# all services that communicate with database need this line => database's compiled js files
COPY --from=builder /app/packages/database/dist ./packages/database/dist 
# these 3 folders&files are a must for Migrator one-shot container only (sql files for migrating, other 2 used by drizzle-kit for migrating)
COPY packages/database/migrations ./packages/database/migrations
COPY packages/database/tsconfig.drizzle.json ./packages/database/tsconfig.drizzle.json
COPY packages/database/drizzle.config.ts ./packages/database/drizzle.config.ts

# Copy the script using the correct path from the root
COPY packages/database/scripts/database-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the script as the entrypoint
WORKDIR /app/packages/database
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "start"]