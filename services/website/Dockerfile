FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=game-types   package.json ./packages/types/game-types/
COPY --from=friends-types package.json ./packages/types/friends-types/
COPY                  package.json ./services/website/
COPY --from=root       package*.json ./

RUN npm ci

COPY --from=game-types    . ./packages/types/game-types/
COPY --from=friends-types . ./packages/types/friends-types/
COPY                  . ./services/website/

ARG VITE_API_AUTH_PATH
ARG VITE_API_PROFILE_PATH
ARG VITE_API_PARTY_PATH
ARG VITE_API_FRIENDS_PATH
ARG VITE_API_GAME_STATS_PATH
ARG VITE_SOCKET_CHAT_PATH
ARG VITE_SOCKET_PARTY_PATH
ARG VITE_SOCKET_GAME_SERVER_PATH
ARG VITE_SOCKET_GAME_BOT_PATH
ARG VITE_SOCKET_URL
ARG SHOW_DEV_SECTION=false

RUN npm run build:docker -w @big2/game-types
RUN npm run build -w website

FROM nginx:alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/services/website/dist /usr/share/nginx/html

EXPOSE 5173
HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=5s \
	CMD wget -q --spider http://127.0.0.1:5173/ || exit 1
