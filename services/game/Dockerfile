#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/db/game-schema/package.json ./packages/db/game-schema/
COPY packages/db/db-client/package.json ./packages/db/db-client/
COPY services/game/package.json ./services/game/

RUN npm ci

COPY . .

RUN npm run --prefix packages/db/game-schema build
RUN npm run --prefix packages/db/db-client build
RUN npm run --prefix services/game build:server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/db/game-schema/package.json ./packages/db/game-schema/
COPY packages/db/db-client/package.json ./packages/db/db-client/
COPY services/game/package.json ./services/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/db/game-schema/dist ./packages/db/game-schema/dist
COPY --from=builder /app/packages/db/db-client/dist ./packages/db/db-client/dist
COPY --from=builder /app/services/game/server_build ./server_build

EXPOSE 3000

CMD ["npm", "run", "--prefix", "services/game", "run:server"]