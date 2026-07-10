FROM node:24.18.0-bookworm-slim

# postgresql-client 
# => a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# => Install system dependencies required by Prisma Client
# => contains: Connectivity Testing (pg_isready)
RUN apt-get update && \
    apt-get install -y openssl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app


# 1. Copy only the package files first
COPY package*.json ./

# 2. Install dependencies
# if do COPY . . first, npm install will be forced to re-run every time you change a single line of code in your source files
# Every single time you change a line of code in src/, Docker thinks the whole project has changed. It throws away the cache for the npm install layer and re-downloads your entire node_modules folder.
# If you change your code but not your dependencies, Docker skips the npm install step entirely. This can save you 1-2 minutes on every single build.
# RUN npm install
RUN npm install

# Only then copy the rest of the source code
COPY . .

# Generate Prisma Client
# RUN npx prisma generate
RUN npm run generate

# Build your TypeScript code (creates the 'dist' folder)
RUN npm run build

# Put all the main commands in the script file
## for backend
COPY ./scripts/backend-entrypoint.sh /usr/local/bin/backend-entrypoint.sh
RUN chmod +x /usr/local/bin/backend-entrypoint.sh
## for prisma_studio
COPY ./scripts/prisma_studio-entrypoint.sh /usr/local/bin/prisma_studio-entrypoint.sh
RUN chmod +x /usr/local/bin/prisma_studio-entrypoint.sh

# Use the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/backend-entrypoint.sh"]
CMD ["npm", "start"] 
# npm => The Ecosystem (npm): When you use Node.js, you get npm (Node Package Manager). This is the tool that downloads all your "building blocks" (libraries).
# run start => tell Node.js to execute 'start' in package.json
