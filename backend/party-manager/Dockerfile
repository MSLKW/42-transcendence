# FROM node:24-bookworm-slim 

# # These are for debian base images
# # Install system dependencies
# # Install postgresql-client -> pg_isready
# RUN apt-get update && \
# 	apt-get install -y openssl postgresql-client curl && \
# 	rm -rf /var/lib/apt/lists/*

# # Set working directory to root first
# WORKDIR /app

# # Copy necessary package.json files for workspaces
# COPY package.json ./
# COPY backend/party-manager/package.json ./backend/party-manager/
# COPY packages/database/package.json ./packages/database/

# # Install dependencies at the root
# RUN npm install

# # Copy all the actual source code
# COPY . . 
# # actually should be only the compiled javascript files from typescript only, not all files blindly -> MVP

# # # ---> ADD THIS LINE: Build all workspace packages (including @big2/database) <---
# # RUN npm run build

# # ---> BUILD THE DATABASE PACKAGE EXPLICITLY <---
# RUN npm run --prefix packages/database build || npm run build

# # Now switch to the specific service directory
# WORKDIR /app/backend/party-manager

# # # Copy the script using the correct path from the root
# COPY backend/party-manager/scripts/party-manager_entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

# ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# CMD ["npm", "run", "dev"] 


# THEIRS
# 
# 
# 
#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY backend/party-manager/package.json ./backend/party-manager/
COPY packages/database/package.json ./packages/database/

RUN npm ci

COPY . .

RUN npm run build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY backend/party-manager/package.json ./backend/party-manager/
COPY packages/database/package.json ./packages/database/

RUN npm ci --omit=dev

RUN apk update && \
    apk add --no-cache openssl postgresql-client curl && \
    rm -rf /var/cache/apk/*

COPY --from=builder /app/dist ./dist

EXPOSE 3000

COPY backend/party-manager/scripts/party-manager_entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
