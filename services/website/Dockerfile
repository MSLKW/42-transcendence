FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
COPY frontend/website/package.json ./frontend/website/

RUN npm install

COPY . .

FROM node:24-slim
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 5173
CMD ["npm", "run", "--prefix", "frontend/website", "dev"]
