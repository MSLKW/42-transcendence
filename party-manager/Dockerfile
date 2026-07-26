FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

FROM node:24-slim
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "run", "dev"]
