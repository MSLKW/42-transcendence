FROM node:24-bookworm-slim 

# postgresql-client
# => a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# => contains: Connectivity Testing (pg_isready)
RUN apt-get update && \
    apt-get install -y openssl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy necessary dependency files, package.json files, for workspaces
# COPY package.json ./
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/

# Install dependencies at the root
RUN npm install

# Copy all the actual source code
COPY . .

# Now switch to the database directory
WORKDIR /app/packages/database

# compiling your TypeScript files into JavaScript 
RUN npm run build 

# Copy the script using the correct path from the root
COPY packages/database/scripts/database-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]