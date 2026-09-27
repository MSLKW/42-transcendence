# #### --- original implementation of int/KAN-1
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

COPY 					./package*.json	./services/website/.
COPY --from=game-types	.				./packages/types/game-types/.
COPY --from=root 		package*.json	./

RUN npm install -w @big2/game-types
RUN npm run docker:build -w @big2/game-types

RUN npm install

COPY . ./services/website/.

EXPOSE 5173

CMD ["npm", "run", "dev", "-w", "website"]

# #### --- optimized docker to be applied before production
#
# FROM node:24 AS builder
# WORKDIR /app

# COPY --from=root			package*.json	./
# COPY --from=game-types	package.json	./packages/types/game-types/
# COPY 						package.json	./services/website/

# RUN npm ci

# COPY --from=game-types . ./packages/types/game-types/
# COPY 					 . ./services/website/

# RUN npm run build:docker -w website

# FROM node:20 AS runner
# WORKDIR /app

# COPY --from=root			package*.json	./
# COPY --from=game-types	package.json	./packages/types/game-types/
# COPY 						package.json	./services/website/

# ENV NODE_ENV=production
# RUN npm ci --omit=dev

# COPY --from=builder	app/packages/types/game-types/dist	./packages/types/game-types/dist
# COPY --from=builder	app/services/website/dist			./services/website/dist

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
