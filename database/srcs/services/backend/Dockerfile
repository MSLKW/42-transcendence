FROM node:24.18.0-bookworm-slim

# # # TO USE .env's VARS
# Dockerfile =>
# # 1. Declare the build arg
# # 2. Convert it into an env var for Node.js (process.env.PORT)
# # 3. PORT will be used directly in EXPOSE step
# ARG BACKEND_PORT
# ENV PORT=${BACKEND_PORT}
# EXPOSE ${PORT}
# docker compose=>
    # build:
      # context: ./services/backend/.
      # args:
      #   - BACKEND_PORT=${BACKEND_PORT}    # Passes the value into the Dockerfile


# postgresql-client = a package containing command-line tools that allow your backend container to "talk" to your PostgreSQL database container.
# Connectivity Testing (pg_isready): 
# Install system dependencies required by Prisma Client
RUN apt-get update && apt-get install -y openssl postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# By default, Docker looks for package.json in the SAME folder (prisma/) as the Dockerfile
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate its client binaries
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application files (including the tools directory)
COPY . .

# Put all the main commands in the script file
COPY ./tools/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use the script as the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# These are already inside entrypoint.sh
# # Pushes database changes on boot, then launches from the tools folder
# CMD ["sh", "-c", "npx prisma db push && node tools/index.js"]
