#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root 			package*.json	./
COPY 						package.json	./services/game/

RUN npm ci

COPY --from=root 			tsconfig.base.json ./
COPY 						. ./services/game/

RUN npm run build:docker -w game 

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root 			package*.json	./
COPY 						package.json	./services/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/services/game/server_build ./server_build

EXPOSE 3000

WORKDIR /app/services/game
CMD ["npm", "run", "run:server"]