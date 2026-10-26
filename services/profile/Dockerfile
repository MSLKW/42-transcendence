# builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY . ./services/profile/.
COPY --from=profile-types . ./packages/types/profile-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/profile-types
RUN cd ./packages/types/profile-types && npm run build:docker

RUN npm install

RUN cd ./services/profile && npm run build


# runner
FROM node:20-alpine AS runner
WORKDIR /app

COPY package*.json ./services/profile/.
COPY --from=builder /app/packages/types/profile-types . ./packages/types/profile-types
COPY --from=root package*.json .

RUN npm install --workspace=@big2/profile-types

RUN npm ci --omit=dev

COPY --from=builder /app/services/profile/dist ./services/profile/dist

WORKDIR /app/services/profile

CMD ["npm", "run", "start"]
