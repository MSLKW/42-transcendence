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

COPY --from=root                    tsconfig.base.json   ./
COPY --from=auth-schema             . ./packages/postgres/auth-schema/
COPY --from=friends-system-types    . ./packages/types/friends-system-types/
COPY --from=friends-system-schema   . ./packages/postgres/friends-system-schema/
COPY --from=postgres-client         . ./packages/postgres/postgres-client/
COPY                                . ./services/friends-system/

RUN npm run build:docker -w friends-system
# RUN npm run build -w @big2/auth-schema
# RUN npm run build -w @big2/friends-system-types
# RUN npm run build -w @big2/friends-system-schema
# RUN npm run build -w @big2/postgres-client
# RUN npm run build -w friends-system

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root                    package*.json   ./
COPY --from=auth-schema             package.json    ./packages/postgres/auth-schema/
COPY --from=friends-system-types    package.json    ./packages/types/friends-system-types/
COPY --from=friends-system-schema   package.json    ./packages/postgres/friends-system-schema/
COPY --from=postgres-client         package.json    ./packages/postgres/postgres-client/
COPY                                package.json    ./services/friends-system/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist             ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/friends-system-types/dist       ./packages/types/friends-system-types/dist
COPY --from=builder /app/packages/postgres/friends-system-schema/dist   ./packages/postgres/friends-system-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist         ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/friends-system/dist                   ./services/friends-system/dist

COPY scripts/* /usr/local/bin

EXPOSE 3000

WORKDIR /app/services/friends-system
ENTRYPOINT ["/usr/local/bin/friends-system-entrypoint.sh"]
CMD ["npm", "run", "start"]