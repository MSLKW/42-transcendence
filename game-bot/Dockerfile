FROM node:20-alpine AS builder
WORKDIR /app

COPY . ./game-bot/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build:docker

RUN npm install

RUN cd ./game-bot && npm run build

# -----

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./game-bot/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json .

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build:docker

RUN npm ci --omit=dev

COPY --from=builder /app/game-bot/dist ./game-bot/dist

EXPOSE 3000

WORKDIR /app/game-bot

CMD ["npm", "run", "start"]
