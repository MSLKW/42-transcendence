FROM node:20-alpine AS builder
WORKDIR /app

COPY . ./game-server/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run docker:build

RUN npm install

RUN cd ./game-server && npm run docker:build

# -----

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./game-server/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json .

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run docker:build

RUN npm ci --omit=dev

COPY --from=builder /app/game-server/server_build ./game-server/server_build

EXPOSE 3000

WORKDIR /app/game-server

CMD ["node", "server_build/src/server.js"]
