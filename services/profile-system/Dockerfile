#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/types/profile-system-types/package.json ./packages/types/profile-system-types/
COPY packages/postgres/profile-system-schema/package.json ./packages/postgres/profile-system-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/profile-system/package.json ./services/profile-system/

RUN npm ci

COPY . .

RUN npm run --prefix packages/postgres/auth-schema build
RUN npm run --prefix packages/types/profile-system-types build
RUN npm run --prefix packages/postgres/profile-system-schema build
RUN npm run --prefix packages/postgres/postgres-client build
RUN npm run --prefix services/profile-system build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
COPY packages/postgres/auth-schema/package.json ./packages/postgres/auth-schema/
COPY packages/types/profile-system-types/package.json ./packages/types/profile-system-types/
COPY packages/postgres/profile-system-schema/package.json ./packages/postgres/profile-system-schema/
COPY packages/postgres/postgres-client/package.json ./packages/postgres/postgres-client/
COPY services/profile-system/package.json ./services/profile-system/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist ./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/profile-system-types/dist ./packages/types/profile-system-types/dist
COPY --from=builder /app/packages/postgres/profile-system-schema/dist ./packages/postgres/profile-system-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist ./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/profile-system/dist ./services/profile-system/dist
COPY --from=builder /app/services/profile-system/test ./services/profile-system/test

EXPOSE 3000

COPY services/profile-system/scripts/profile-system-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/services/profile-system
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
