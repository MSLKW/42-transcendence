#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root 			package*.json	./
COPY 						package.json	./services/game-server/

RUN npm ci

COPY --from=root 			tsconfig.base.json ./
COPY 						. ./services/game-server/

RUN npm run build -w game-server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root 			package*.json	./
COPY 						package.json	./services/game-server/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/services/game-server/server_build ./server_build

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${GAME_SERVER_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1

WORKDIR /app/services/game-server
CMD ["npm", "run", "run:server"]