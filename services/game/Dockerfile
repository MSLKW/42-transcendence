#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/game-schema/package.json ./packages/postgres/game-schema/
COPY packages/postgres/db-client/package.json ./packages/postgres/db-client/
COPY services/game/package.json ./services/game/

RUN npm ci

COPY . .

RUN npm run --prefix packages/postgres/game-schema build
RUN npm run --prefix packages/postgres/db-client build
RUN npm run --prefix services/game build:server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/game-schema/package.json ./packages/postgres/game-schema/
COPY packages/postgres/db-client/package.json ./packages/postgres/db-client/
COPY services/game/package.json ./services/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/game-schema/dist ./packages/postgres/game-schema/dist
COPY --from=builder /app/packages/postgres/db-client/dist ./packages/postgres/db-client/dist
COPY --from=builder /app/services/game/server_build ./server_build

EXPOSE 3000

CMD ["npm", "run", "--prefix", "services/game", "run:server"]