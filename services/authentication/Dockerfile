#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# COPY packages/db/profile-system-schema/package.json ./packages/db/profile-system-schema/
COPY packages/db/auth-schema/package.json ./packages/db/auth-schema/
COPY packages/db/db-client/package.json ./packages/db/db-client/
COPY services/authentication/package.json ./services/authentication/

RUN npm ci

COPY . .

# RUN npm run --prefix packages/db/profile-system-schema build
RUN npm run --prefix packages/db/auth-schema build
RUN npm run --prefix packages/db/db-client build
RUN npm run --prefix services/authentication build

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./
# COPY packages/db/profile-system-schema/package.json ./packages/db/profile-system-schema/
COPY packages/db/auth-schema/package.json ./packages/db/auth-schema/
COPY packages/db/db-client/package.json ./packages/db/db-client/
COPY services/authentication/package.json ./services/authentication/

RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

ENV NODE_ENV=production
RUN npm ci --omit=dev

# COPY --from=builder /app/packages/db/profile-system-schema/dist ./packages/db/profile-system-schema/dist
COPY --from=builder /app/packages/db/auth-schema/dist ./packages/db/auth-schema/dist
COPY --from=builder /app/packages/db/db-client/dist ./packages/db/db-client/dist
COPY --from=builder /app/services/authentication/dist ./services/authentication/dist

EXPOSE 3000

COPY services/authentication/scripts/auth-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app/services/authentication
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "start"]
