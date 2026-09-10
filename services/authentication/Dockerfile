#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root            package*.json   ./
COPY --from=auth-schema     package.json    ./packages/postgres/auth-schema/
COPY --from=postgres-client package.json    ./packages/postgres/postgres-client/
COPY                        package.json    ./services/authentication/

RUN npm ci

# in docker-compose: context is services/authentication, so we copy everything exists within `context` only
COPY . .

RUN npm run build -w @big2/auth-schema
RUN npm run build -w @big2/postgres-client
RUN npm run build -w authentication

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root            package*.json   ./
COPY --from=auth-schema     package.json    ./packages/postgres/auth-schema/
COPY --from=postgres-client package.json    ./packages/postgres/postgres-client/
COPY                        package.json    ./services/authentication/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist     ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/authentication/dist           ./services/authentication/dist

EXPOSE 3000

WORKDIR /app/services/authentication
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
