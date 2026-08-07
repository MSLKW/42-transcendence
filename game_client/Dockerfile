FROM node:24 AS builder
WORKDIR /app

COPY . ./game_client/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm ci

RUN cd ./game_client && npm run build

# FROM node:24-slim AS runner
# WORKDIR /app

# COPY --from=builder /app .

EXPOSE 5000

WORKDIR /app/game_client

CMD ["npm", "run", "dev"]
