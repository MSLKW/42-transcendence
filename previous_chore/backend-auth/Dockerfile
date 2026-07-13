FROM node:24.18.0-bookworm-slim

RUN apt-get update && \
	apt-get install -y openssl postgresql-client python3 make g++ && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run generate
RUN npm run build

COPY ./scripts/docker-entrypoint.sh /usr/local/bin/auth-entrypoint.sh
RUN chmod +x /usr/local/bin/auth-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/auth-entrypoint.sh"]
CMD ["npm", "run", "docker:start"]