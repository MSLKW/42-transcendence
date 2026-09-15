#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root 			package*.json	./
COPY --from=game-schema		package.json	./packages/postgres/game-schema/
COPY --from=postgres-client	package.json	./packages/postgres/postgres-client/
COPY 						package.json	./services/game/

RUN npm ci

COPY --from=root 			tsconfig.base.json ./
COPY --from=game-schema		. ./packages/postgres/game-schema/
COPY --from=postgres-client	. ./packages/postgres/postgres-client/
COPY 						. ./services/game/

RUN npm run build:docker -w game 
# RUN npm run build 			-w @big2/game-schema
# RUN npm run build 			-w @big2/postgres-client
# RUN npm run build:server	-w game 

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root 			package*.json	./
COPY --from=game-schema		package.json	./packages/postgres/game-schema/
COPY --from=postgres-client	package.json	./packages/postgres/postgres-client/
COPY 						package.json	./services/game/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/game-schema/dist ./packages/postgres/game-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/game/server_build ./server_build

EXPOSE 3000

WORKDIR /app/services/game
CMD ["npm", "run", "run:server"]