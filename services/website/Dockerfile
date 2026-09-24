<<<<<<< HEAD
# FROM node:24
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host"]

FROM node:24
WORKDIR /app

COPY ./package*.json ./website/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build

RUN npm install

COPY . ./website/.

EXPOSE 5173

WORKDIR /app/website

=======
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
>>>>>>> origin/int/KAN-36-website-db
CMD ["npm", "run", "dev"]
