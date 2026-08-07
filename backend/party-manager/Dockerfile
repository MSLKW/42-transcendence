#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/party-manager_schema/package.json ./packages/party-manager_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/party-manager/package.json ./backend/party-manager/

RUN npm ci

COPY . .

RUN npm run --prefix packages/auth_schema build
RUN npm run --prefix packages/party-manager_schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix backend/party-manager build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/auth_schema/package.json ./packages/auth_schema/
COPY packages/party-manager_schema/package.json ./packages/party-manager_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/party-manager/package.json ./backend/party-manager/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/auth_schema/dist ./packages/auth_schema/dist
COPY --from=builder /app/packages/party-manager_schema/dist ./packages/party-manager_schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/backend/party-manager/dist ./backend/party-manager/dist

EXPOSE 3000

COPY backend/party-manager/scripts/party-manager_entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/backend/party-manager
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
