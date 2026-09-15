#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=party-manager-schema    package.json    ./packages/postgres/party-manager-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/party-manager/

RUN npm ci

COPY --from=root                    tsconfig.base.json ./
COPY --from=postgres-client         . ./packages/postgres/postgres-client/
COPY --from=auth-schema             . ./packages/postgres/auth-schema/
COPY --from=party-manager-schema    . ./packages/postgres/party-manager-schema/
COPY                                . ./services/party-manager/

RUN npm run build:docker -w party-manager

# RUN npm run build -w @big2/auth-schema
# RUN npm run build -w @big2/party-manager-schema
# RUN npm run build -w @big2/postgres-client
# RUN npm run build -w party-manager

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=party-manager-schema    package.json    ./packages/postgres/party-manager-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/party-manager/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist             ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/postgres/party-manager-schema/dist    ./packages/postgres/party-manager-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist         ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/party-manager/dist                    ./services/party-manager/dist

COPY scripts/* /usr/local/bin

EXPOSE 3000

WORKDIR /app/services/party-manager
ENTRYPOINT ["/usr/local/bin/party-manager-entrypoint.sh"]
CMD ["npm", "run", "start"]
