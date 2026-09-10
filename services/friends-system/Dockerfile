#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=friends-system-types    package.json    ./packages/types/friends-system-types/
COPY --from=friends-system-schema   package.json    ./packages/postgres/friends-system-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/friends-system/

RUN npm ci

COPY . .

RUN npm run build -w @big2/auth-schema
RUN npm run build -w @big2/friends-system-types
RUN npm run build -w @big2/friends-system-schema
RUN npm run build -w @big2/postgres-client
RUN npm run build -w friends-system

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/types/friends-system-types/package.json ./packages/types/friends-system-types/
COPY packages/postgres/friends-system-schema/package.json ./packages/postgres/friends-system-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/friends-system/package.json ./services/friends-system/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist             ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/friends-system-types/dist       ./packages/types/friends-system-types/dist
COPY --from=builder /app/packages/postgres/friends-system-schema/dist   ./packages/postgres/friends-system-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist         ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/friends-system/dist                   ./services/friends-system/dist

EXPOSE 3000

WORKDIR /app/services/friends-system
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]