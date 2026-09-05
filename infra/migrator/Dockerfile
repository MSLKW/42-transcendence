FROM node:24-bookworm-slim
WORKDIR /app

# for healthcheck upon PostgreSQL (pg_isready)
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install all dependencies, thats needed ONLY FOR MIGRATOR'S DEPLOYEMENT
# need both package*.json from root for: Strict Reproducibility and Lightning-Fast Caching.
COPY --from=root package*.json ./
COPY package.json ./infra/migrator/
RUN npm ci

# these 3 folders&files are a must for Migrator one-shot container only (sql files for migrating, other 2 used by drizzle-kit for migrating)
COPY migrations ./infra/migrator/migrations
COPY tsconfig.drizzle.json ./infra/migrator/tsconfig.drizzle.json
COPY drizzle.config.ts ./infra/migrator/drizzle.config.ts

# Copy the script using the correct path from the root
# COPY scripts/migrator-entrypoint.sh /usr/local/bin/entrypoint.sh
# COPY scripts/grant-permissions.sh /usr/local/bin/grant-permissions.sh
# COPY scripts/apply-triggers.sh /usr/local/bin/apply-triggers.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/grant-permissions.sh /usr/local/bin/apply-triggers.sh

# Copies the scripts AND marks them executable at the exact same moment
COPY --chmod=755 scripts/ /usr/local/bin/

# Use the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# # no need to copy schemas! (COPY packages ./packages) => ignored by drizzle-kit migrate anyway
# # only drizzle-kit generate & drizzle-kit push commands will need to refer schema
# # which both commands done locally anyway, not for deployement 
