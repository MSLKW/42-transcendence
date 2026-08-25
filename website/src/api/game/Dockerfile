FROM node:24 AS builder
WORKDIR /app

COPY . ./game/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build

RUN npm ci

# RUN cd ./website/src/api/game && npm run build

# FROM node:24-slim AS runner
# WORKDIR /app

# COPY --from=builder /app .

EXPOSE 5000

WORKDIR /app/game

CMD ["npm", "run", "dev"]
