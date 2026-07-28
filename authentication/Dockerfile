# --- Stage 1: Build the TypeScript application ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies like typescript)
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build


# --- Stage 2: Create the runner/production image ---
FROM node:20-alpine AS runner
WORKDIR /app

# Configure environmental variable to optimize for production
ENV NODE_ENV=production

# Copy manifests to track dependencies
COPY package*.json ./

# Install ONLY production dependencies to keep the image lightweight
RUN npm ci --omit=dev

# Copy the compiled files from the builder stage
COPY --from=builder /app/dist ./dist

# Document the port your application exposes (change as needed)
EXPOSE 3000

# Execute your build:run command (or direct node start)
CMD ["npm", "run", "start"]

