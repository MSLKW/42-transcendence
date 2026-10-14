FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=game-types	package.json	./packages/types/game-types/
COPY 					package.json	./services/game-server/
COPY --from=root		package*.json	./

RUN npm ci

COPY --from=game-types	. ./packages/types/game-types/
COPY 					. ./services/game-server/

RUN npm run build:docker -w game-server

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=game-types	package.json	./packages/types/game-types/
COPY 					package.json	./services/game-server/
COPY --from=root		package*.json	./

RUN npm ci --omit=dev

COPY --from=builder /app/packages/types/game-types/dist		./packages/types/game-types/dist
COPY --from=builder /app/services/game-server/server_build	./services/game-server/server_build

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${GAME_SERVER_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1

WORKDIR /app/services/game-server

CMD ["node", "server_build/src/server.js"] 
# CMD ["npm", "run", "server"]
