#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/game-schema/package.json ./packages/game-schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY services/game/package.json ./services/game/

RUN npm ci

COPY . .

RUN npm run --prefix packages/game-schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix services/game build:server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/game-schema/package.json ./packages/game-schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY services/game/package.json ./services/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/game-schema/dist ./packages/game-schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/services/game/server_build ./server_build

EXPOSE 3000

CMD ["npm", "run", "--prefix", "services/game", "run:server"]