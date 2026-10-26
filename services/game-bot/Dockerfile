# builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=game-types	package.json	./packages/types/game-types/
COPY 					package.json	./services/game-bot/
COPY --from=root		package*.json	./

RUN npm ci

COPY --from=game-types	. ./packages/types/game-types/
COPY 					. ./services/game-bot/

RUN npm run build:docker -w game-bot

# runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=game-types	package.json	./packages/types/game-types/
COPY 					package.json	./services/game-bot/
COPY --from=root		package*.json	./

RUN npm ci --omit=dev

COPY --from=builder	/app/packages/types/game-types/dist	./packages/types/game-types/dist
COPY --from=builder	/app/services/game-bot/dist			./services/game-bot/dist

EXPOSE 3000

WORKDIR /app/services/game-bot

CMD ["npm", "run", "start"]
