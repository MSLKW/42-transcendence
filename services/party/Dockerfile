#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=party-schema    		package.json    ./packages/postgres/party-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/party/

RUN npm ci

COPY --from=root                    tsconfig.base.json	./
COPY --from=postgres-client         . 					./packages/postgres/postgres-client/
COPY --from=auth-schema             . 					./packages/postgres/auth-schema/
COPY --from=party-schema    		. 					./packages/postgres/party-schema/
COPY                                . 					./services/party/

RUN npm run build:docker -w party

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=party-schema    		package.json    ./packages/postgres/party-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/party/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist		./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/postgres/party-schema/dist    ./packages/postgres/party-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist	./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/party/dist                    ./services/party/dist

COPY scripts/* /usr/local/bin

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${PARTY_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
	CMD wget -q --spider http://localhost:${PORT}/health || exit 1
	
WORKDIR /app/services/party
ENTRYPOINT ["/usr/local/bin/party-entrypoint.sh"]
CMD ["npm", "run", "start"]
