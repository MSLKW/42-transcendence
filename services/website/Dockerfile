FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
COPY services/website/package.json ./services/website/

RUN npm install

COPY . .

FROM node:24-slim AS runner
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 5173
CMD ["npm", "run", "--prefix", "services/website", "dev"]
