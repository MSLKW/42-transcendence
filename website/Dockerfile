# FROM node:24
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host"]

FROM node:24
WORKDIR /app

COPY ./package*.json ./website/.
COPY --from=game-types . ./packages/game-types/.
COPY --from=root package*.json ./

RUN npm install --workspace=@big2/game-types
RUN cd ./packages/game-types && npm run build

RUN npm install

COPY . ./website/.

EXPOSE 5173

WORKDIR /app/website

CMD ["npm", "run", "dev"]
