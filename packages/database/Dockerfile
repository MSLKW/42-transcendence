FROM node:24-bookworm-slim 

# postgresql-client 
# => a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# => Install system dependencies required by Prisma Client
# => contains: Connectivity Testing (pg_isready)
RUN apt-get update && \
    apt-get install -y openssl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# # Set the workdir explicitly to match where you want your app
# WORKDIR /app/packages/database

# Copy from the context (root) into the container
# Use the relative path from the context (root)
COPY package*.json ./
COPY ./packages/database/package*.json ./packages/database/

# 2. Install dependencies
# if do COPY . . first, npm install will be forced to re-run every time you change a single line of code in your source files
# Every single time you change a line of code in src/, Docker thinks the whole project has changed. It throws away the cache for the npm install layer and re-downloads your entire node_modules folder.
# If you change your code but not your dependencies, Docker skips the npm install step entirely. This can save you 1-2 minutes on every single build.
RUN npm install

# Only then copy the rest of the source code
COPY . .

# # Build your TypeScript code (creates the 'dist' folder)
# RUN npm run build

# Put all the main commands in the script file
COPY ./packages/database/scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
