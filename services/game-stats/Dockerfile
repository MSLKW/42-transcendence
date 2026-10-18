#Builder
FROM node:20-alpine AS builder
WORKDIR /app

# TODO : after game-stats completion, recheck & remove game-types everywhere within game-stats if not needed
# TODO (where remove game-types?): package.json, tsconfig's references, dockerfile, imports, etc. might not even need game-types for game-stats, cant ask request to refer their req types, its like ask req to blindly trust what you assign to them when req can be recieved by anyone in any shape
COPY --from=postgres-client     package.json    ./packages/postgres/postgres-client/
COPY --from=auth-schema         package.json    ./packages/postgres/auth-schema/
COPY --from=game-stats-schema   package.json    ./packages/postgres/game-stats-schema/
COPY --from=game-stats-types    package.json    ./packages/types/game-stats-types/
COPY --from=game-types    		package.json    ./packages/types/game-types/
COPY                            package.json    ./services/game-stats/
COPY --from=root                package*.json   ./

RUN npm ci

COPY . .

RUN npm run build:docker -w game-stats

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=postgres-client     package.json    ./packages/postgres/postgres-client/
COPY --from=auth-schema         package.json    ./packages/postgres/auth-schema/
COPY --from=game-stats-schema   package.json    ./packages/postgres/game-stats-schema/
COPY --from=game-stats-types    package.json    ./packages/types/game-stats-types/
COPY --from=game-types    		package.json    ./packages/types/game-types/
COPY                            package.json    ./services/game-stats/
COPY --from=root                package*.json   ./

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/postgres-client/dist     ./packages/postgres/postgres-client/dist
COPY --from=builder /app/packages/postgres/auth-schema/dist         ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/postgres/game-stats-schema/dist   ./packages/postgres/game-stats-schema/dist
COPY --from=builder /app/packages/types/game-stats-types/dist       ./packages/types/game-stats-types/dist
COPY --from=builder /app/packages/types/game-types/dist       		./packages/types/game-types/dist
COPY --from=builder /app/services/game-stats/dist                   ./services/game-stats/dist

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${GAME_STATS_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
	CMD wget -q --spider http://localhost:${PORT}/health || exit 1

WORKDIR /app/services/game-stats
CMD ["npm", "run", "start"]