#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# COPY packages/profile-system_schema/package.json ./packages/profile-system_schema/
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/authentication/package.json ./backend/authentication/

RUN npm ci

COPY . .

# RUN npm run --prefix packages/profile-system_schema build
RUN npm run --prefix packages/auth_schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix backend/authentication build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
# COPY packages/profile-system_schema/package.json ./packages/profile-system_schema/
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/authentication/package.json ./backend/authentication/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

# COPY --from=builder /app/packages/profile-system_schema/dist ./packages/profile-system_schema/dist
COPY --from=builder /app/packages/auth_schema/dist ./packages/auth_schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/backend/authentication/dist ./backend/authentication/dist

EXPOSE 3000

COPY backend/authentication/scripts/auth-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/backend/authentication
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
