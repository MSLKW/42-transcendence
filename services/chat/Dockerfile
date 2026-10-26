#### --- original implementation of int/KAN-1
# #Builder
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# #Runner
# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# COPY package*.json ./
# RUN npm ci --omit=dev
# COPY --from=builder /app/dist ./dist
# EXPOSE 3000
# CMD ["npm", "run", "start"]

# #### --- fix original implementation of int/KAN-1 to adapt with current directories layout
# #Builder
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY --from=root	package*.json	./
# COPY 				package.json	./services/chat/

# RUN npm ci

# COPY . ./services/chat/

# RUN npm run build -w chat

# #Runner
# FROM node:20-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=root	package*.json	./
# COPY 				package.json	./services/chat/

# RUN npm ci --omit=dev

# COPY --from=builder /app/services/chat/dist ./services/chat/dist
# # COPY --from=builder /app/dist ./dist

# EXPOSE 3000
# CMD ["npm", "run", "start", "-w", "chat"]


# #### --- optimized docker to be applied before production
#Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY				package.json	./services/chat/
COPY --from=root	package*.json	./

RUN npm ci

COPY . ./services/chat/

RUN npm run build:docker -w chat

#Runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY				package.json	./services/chat/
COPY --from=root	package*.json	./

ENV NODE_ENV=production
RUN npm ci --omit=dev

COPY --from=builder	app/services/chat/dist ./services/chat/dist

ENV PORT=3000
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${CHAT_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1
	
WORKDIR /app/services/chat
CMD ["npm", "run", "start"]
