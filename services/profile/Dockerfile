#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=root            package*.json   ./
COPY --from=auth-schema     package.json    ./packages/postgres/auth-schema/
COPY --from=profile-types	package.json    ./packages/types/profile-types/
COPY --from=profile-schema	package.json    ./packages/postgres/profile-schema/
COPY --from=postgres-client	package.json    ./packages/postgres/postgres-client/
COPY						package.json	./services/profile/

RUN npm ci

COPY --from=root			tsconfig.base.json	./
COPY --from=auth-schema		.					./packages/postgres/auth-schema/
COPY --from=profile-types	.					./packages/types/profile-types/
COPY --from=profile-schema	.					./packages/postgres/profile-schema/
COPY --from=postgres-client	.					./packages/postgres/postgres-client/
COPY						.					./services/profile/

RUN npm run build:docker -w profile

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=root			package*.json	./
COPY --from=auth-schema		package.json    ./packages/postgres/auth-schema/
COPY --from=profile-types	package.json    ./packages/types/profile-types/
COPY --from=profile-schema	package.json    ./packages/postgres/profile-schema/
COPY --from=postgres-client	package.json    ./packages/postgres/postgres-client/
COPY						package.json	./services/profile/

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder /app/packages/postgres/auth-schema/dist		./packages/postgres/auth-schema/dist
COPY --from=builder /app/packages/types/profile-types/dist		./packages/types/profile-types/dist
COPY --from=builder /app/packages/postgres/profile-schema/dist	./packages/postgres/profile-schema/dist
COPY --from=builder /app/packages/postgres/postgres-client/dist	./packages/postgres/postgres-client/dist
COPY --from=builder /app/services/profile/dist 					./services/profile/dist
COPY --from=builder /app/services/profile/test					./services/profile/test

COPY scripts/* /usr/local/bin

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${PROFILE_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
	CMD wget -q --spider http://localhost:${PORT}/health || exit 1
	
WORKDIR /app/services/profile
ENTRYPOINT ["/usr/local/bin/profile-entrypoint.sh"]
CMD ["npm", "run", "start"]
