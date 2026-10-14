# #### --- ori
# # FROM node:24
# # WORKDIR /app

# # COPY package*.json ./
# # RUN npm install

# # COPY . .

# # EXPOSE 5173
# # CMD ["npm", "run", "dev", "--", "--host"]

# FROM node:24
# WORKDIR /app

# COPY ./package*.json ./website/.
# COPY --from=game-types . ./packages/game-types/.
# COPY --from=root package*.json ./

# RUN npm install --workspace=@big2/game-types
# RUN cd ./packages/game-types && npm run docker:build

# RUN npm install

# COPY . ./website/.

# EXPOSE 5173

# WORKDIR /app/website

# CMD ["npm", "run", "dev"]


#### --- fix original implementation of int/KAN-1 to adapt with current directories layout
FROM node:24
WORKDIR /app

COPY --from=game-types	package.json	./packages/types/game-types/
COPY 					package.json	./services/website/
COPY --from=root 		package*.json	./

RUN npm i
# RUN npm ci # better option, but can keep npm i in dev

COPY --from=game-types	. ./packages/types/game-types/
COPY 					. ./services/website/

RUN npm run build	-w @big2/game-types
# # use build only after they have put in types in imports, coz now recieve error below:
# # error TS2307: Cannot find module '@big2/game-types' or its corresponding type declarations.
# RUN npm run build -w website

ENV PORT=5173
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${WEBSITE_SERVICE_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

WORKDIR /app/services/website
CMD ["npm", "run", "dev"]

# #### --- optimized docker to be applied before production
# FROM node:24 AS builder
# WORKDIR /app

# COPY --from=game-types	package.json	./packages/types/game-types/
# COPY 						package.json	./services/website/
# COPY --from=root			package*.json	./

# RUN npm ci

# COPY --from=game-types . ./packages/types/game-types/
# COPY 					 . ./services/website/

# # These must exist at BUILD time: vite build bakes them into the JS.
# # ARG values are visible to RUN commands, so no ENV lines are needed.
# ARG VITE_API_AUTH_PATH
# ARG VITE_API_PROFILE_PATH
# ARG VITE_API_PARTY_PATH
# ARG VITE_API_FRIENDS_PATH
# ARG VITE_API_GAME_STATS_PATH
# ARG VITE_SOCKET_CHAT_PATH
# ARG VITE_SOCKET_PARTY_PATH
# ARG VITE_SOCKET_GAME_SERVER_PATH
# ARG VITE_SOCKET_GAME_BOT_PATH
# ARG VITE_SOCKET_URL

# RUN npm run build -w website

# FROM node:24 AS runner # website might not need runner, will fix on this more later
# WORKDIR /app

# COPY --from=game-types	package.json	./packages/types/game-types/
# COPY 						package.json	./services/website/
# COPY --from=root			package*.json	./

# ENV NODE_ENV=production
# RUN npm ci --omit=dev

# COPY --from=builder	/app/packages/types/game-types/dist	./packages/types/game-types/dist
# COPY --from=builder	/app/services/website/dist			./services/website/dist

# ENV PORT=5173
# # ^ default fallback only, in case someone runs this image standalone without Compose.
# # Compose's `environment: PORT=${WEBSITE_SERVICE_PORT}` overrides this ENV at runtime.

# EXPOSE ${PORT}

# HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=5s \
# 	CMD wget -q --spider http://localhost:${PORT}/health || exit 1
# # this dockerfile uses node:20, not node:20-alpine, 
# 	# double check on this later, if use wget or curl

# WORKDIR /app/services/website
# CMD ["npm", "run", "dev"]
