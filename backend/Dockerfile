# Backend Dockerfile for TimeCheck API
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set node environment
ENV NODE_ENV=production

# Install dependencies first for optimal layer caching
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "server.js"]
