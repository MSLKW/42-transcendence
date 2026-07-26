FROM node:24-bookworm-slim 

# Install system dependencies
# Install postgresql-client -> pg_isready
RUN apt-get update && \
	apt-get install -y postgresql-client curl && \
	rm -rf /var/lib/apt/lists/*

# Set working directory to root first
WORKDIR /app

# Copy necessary package.json files for workspaces
COPY package.json ./
COPY backend/authentication/package.json ./backend/authentication/
COPY packages/database/package.json ./packages/database/

# Install dependencies at the root
RUN npm install

# Copy all the actual source code
COPY . . 
# actually should be only the compiled javascript files from typescript only, not all files blindly -> MVP

# # ---> ADD THIS LINE: Build all workspace packages (including @big2/database) <---
# RUN npm run build

# ---> BUILD THE DATABASE PACKAGE EXPLICITLY <---
RUN npm run --prefix packages/database build || npm run build

# Now switch to the specific service directory
WORKDIR /app/backend/authentication

# # Copy the script using the correct path from the root
COPY backend/authentication/scripts/auth-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "dev"] 