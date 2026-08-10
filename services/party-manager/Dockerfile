#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/auth-schema/package.json ./packages/auth-schema/
COPY packages/party-manager-schema/package.json ./packages/party-manager-schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY services/party-manager/package.json ./services/party-manager/

RUN npm ci

COPY . .

RUN npm run --prefix packages/auth-schema build
RUN npm run --prefix packages/party-manager-schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix services/party-manager build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/auth-schema/package.json ./packages/auth-schema/
COPY packages/party-manager-schema/package.json ./packages/party-manager-schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY services/party-manager/package.json ./services/party-manager/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/auth-schema/dist ./packages/auth-schema/dist
COPY --from=builder /app/packages/party-manager-schema/dist ./packages/party-manager-schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/services/party-manager/dist ./services/party-manager/dist

EXPOSE 3000

COPY services/party-manager/scripts/party-manager_entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/services/party-manager
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
