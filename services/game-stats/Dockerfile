#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/types/badge-types/package.json ./packages/types/badge-types/
COPY packages/types/game-stats-types/package.json ./packages/types/game-stats-types/
COPY packages/postgres/game-stats-schema/package.json ./packages/postgres/game-stats-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/game-stats/package.json ./services/game-stats/

RUN npm ci

COPY . .

RUN npm run --prefix packages/postgres/auth-schema build
RUN npm run --prefix packages/types/badge-types build
RUN npm run --prefix packages/types/game-stats-types build
RUN npm run --prefix packages/postgres/game-stats-schema build
RUN npm run --prefix packages/postgres/postgres-client build
RUN npm run --prefix services/game-stats build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/types/badge-types/package.json ./packages/types/badge-types/
COPY packages/types/game-stats-types/package.json ./packages/types/game-stats-types/
COPY packages/postgres/game-stats-schema/package.json ./packages/postgres/game-stats-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/game-stats/package.json ./services/game-stats/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/badge-types/dist ./packages/types/badge-types/dist
COPY --from=builder /app/packages/types/game-stats-types/dist ./packages/types/game-stats-types/dist
COPY --from=builder /app/packages/postgres/game-stats-schema/dist ./packages/postgres/game-stats-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/game-stats/dist ./services/game-stats/dist

EXPOSE 3000

COPY services/game-stats/scripts/game-stats-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/services/game-stats
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]