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
EXPOSE 5173

WORKDIR /app/services/website
CMD ["npm", "run", "dev"]
