#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/game_schema/package.json ./packages/game_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/game/package.json ./backend/game/

RUN npm ci

COPY . .

RUN npm run --prefix packages/game_schema build
RUN npm run --prefix packages/db-client build
RUN npm run --prefix backend/game build:server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/game_schema/package.json ./packages/game_schema/
COPY packages/db-client/package.json ./packages/db-client/
COPY backend/game/package.json ./backend/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/game_schema/dist ./packages/game_schema/dist
COPY --from=builder /app/packages/db-client/dist ./packages/db-client/dist
COPY --from=builder /app/backend/game/server_build ./server_build

EXPOSE 3000

CMD ["npm", "run", "--prefix", "backend/game", "run:server"]