FROM node:24 AS builder
WORKDIR /app

COPY --from=root	package*.json	./
COPY				package.json	./services/website/

RUN npm install

COPY --from=root	tsconfig.base.json ./
COPY				. ./services/website

RUN npm run build -w website

FROM node:24-slim AS runner
WORKDIR /app

COPY --from=builder /app ./
ENV NODE_ENV=production

ENV PORT=5173
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${PARTY_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1

WORKDIR /app/services/website
CMD ["npm", "run", "dev"]
