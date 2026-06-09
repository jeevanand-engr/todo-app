# Stage 1 — install dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2 — lean runtime image
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY src/ ./src/

# Don't run as root inside container
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
