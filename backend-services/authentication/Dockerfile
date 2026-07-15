# FROM node:24-bookworm-slim 

COPY package*.json ./

RUN npm install

COPY . .

COPY ./scripts/entrypoint.sh /usr/local/bin/backend-entrypoint.sh
RUN chmod +x /usr/local/bin/backend-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "dev"] 
