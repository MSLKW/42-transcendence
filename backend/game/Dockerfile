#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/database/package.json ./packages/database/
COPY backend/game/package.json ./backend/game/

RUN npm ci

COPY . .

RUN npm run --prefix packages/database build
RUN npm run --prefix backend/game build:server

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/database/package.json ./packages/database/
COPY backend/game/package.json ./backend/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/backend/game/server_build ./server_build

EXPOSE 3000

CMD ["npm", "run", "--prefix", "backend/game", "run:server"]
