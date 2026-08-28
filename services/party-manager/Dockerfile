#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/postgres/party-manager-schema/package.json ./packages/postgres/party-manager-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/party-manager/package.json ./services/party-manager/

RUN npm ci

COPY . .

RUN npm run --prefix packages/postgres/auth-schema build
RUN npm run --prefix packages/postgres/party-manager-schema build
RUN npm run --prefix packages/postgres/postgres-client build
RUN npm run --prefix services/party-manager build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/postgres/party-manager-schema/package.json ./packages/postgres/party-manager-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/party-manager/package.json ./services/party-manager/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/postgres/party-manager-schema/dist ./packages/postgres/party-manager-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/party-manager/dist ./services/party-manager/dist

EXPOSE 3000

COPY services/party-manager/scripts/party-manager-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/services/party-manager
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
