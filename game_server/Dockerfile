FROM node:20-alpine AS builder
WORKDIR /app

COPY . ./game_server/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build

RUN npm install

RUN cd ./game_server && npm run build

# -----

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./game_server/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json .

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build

RUN npm ci --omit=dev

COPY --from=builder /app/game_server/server_build ./game_server/server_build

EXPOSE 3000

WORKDIR /app/game_server

CMD ["node", "server_build/src/server.js"]
