FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:24-slim
WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "dev"]
