#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root			package*.json	./
COPY --from=auth-schema		package.json    ./packages/postgres/auth-schema/
COPY --from=friends-types	package.json    ./packages/types/friends-types/
COPY --from=friends-schema	package.json    ./packages/postgres/friends-schema/
COPY --from=postgres-client	package.json    ./packages/postgres/postgres-client/
COPY						package.json    ./services/friends/

RUN npm ci

COPY --from=auth-schema		. ./packages/postgres/auth-schema/
COPY --from=friends-types	. ./packages/types/friends-types/
COPY --from=friends-schema	. ./packages/postgres/friends-schema/
COPY --from=postgres-client	. ./packages/postgres/postgres-client/
COPY						. ./services/friends/

RUN npm run build:docker -w friends

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root			package*.json	./
COPY --from=auth-schema		package.json    ./packages/postgres/auth-schema/
COPY --from=friends-types	package.json    ./packages/types/friends-types/
COPY --from=friends-schema	package.json    ./packages/postgres/friends-schema/
COPY --from=postgres-client	package.json    ./packages/postgres/postgres-client/
COPY						package.json    ./services/friends/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist		./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/friends-types/dist		./packages/types/friends-types/dist
COPY --from=builder /app/packages/postgres/friends-schema/dist	./packages/postgres/friends-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist	./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/friends/dist					./services/friends/dist

COPY scripts/* /usr/local/bin

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${FRIENDS_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1

WORKDIR /app/services/friends
ENTRYPOINT ["/usr/local/bin/friends-entrypoint.sh"]
CMD ["npm", "run", "start"]