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
# COPY backend/authentication/package.json ./backend/authentication/
# COPY packages/auth_schema/package.json ./packages/auth_schema/

# # Install dependencies at the root
# RUN npm install

# # Copy all the actual source code
# COPY . . 
# # actually should be only the compiled javascript files from typescript only, not all files blindly -> MVP

# # ---> ADD THIS LINE: Build all workspace packages (including @big2/database) <---
# RUN npm run build

# # ---> BUILD THE DATABASE PACKAGE EXPLICITLY <---
# RUN npm run --prefix packages/auth_schema build || npm run build

# # Now switch to the specific service directory
# WORKDIR /app/backend/authentication

# # # Copy the script using the correct path from the root
# COPY backend/authentication/scripts/auth-entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

# ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# CMD ["npm", "run", "dev"] 

# 
# 
# 
# jeremy's version
# 
# 
# 
#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/profile-system_schema/package.json ./packages/profile-system_schema/
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/authentication/package.json ./backend/authentication/

RUN npm ci

COPY . .

RUN npm run --prefix packages/profile-system_schema build
RUN npm run --prefix packages/auth_schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix backend/authentication build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/profile-system_schema/package.json ./packages/profile-system_schema/
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/authentication/package.json ./backend/authentication/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/profile-system_schema/dist ./packages/profile-system_schema/dist
COPY --from=builder /app/packages/auth_schema/dist ./packages/auth_schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/backend/authentication/dist ./backend/authentication/dist

EXPOSE 3000

COPY backend/authentication/scripts/auth-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/backend/authentication
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
