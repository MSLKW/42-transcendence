FROM node:20-alpine AS builder
WORKDIR /app

COPY . ./services/game-bot/.
COPY --from=game-types . ./packages/types/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/types/game-types && npm run build:docker

RUN npm install

RUN cd ./services/game-bot && npm run build

# -----

FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./services/game-bot/.
COPY --from=game-types . ./packages/types/game-types/.
COPY --from=root package*.json .

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/types/game-types && npm run build:docker

RUN npm ci --omit=dev

COPY --from=builder /app/services/game-bot/dist ./services/game-bot/dist

EXPOSE 3000

WORKDIR /app/services/game-bot

CMD ["npm", "run", "start"]
