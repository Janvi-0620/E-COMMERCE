FROM node:20-alpine
WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server source code
COPY server/ ./

# Render provides PORT via env var (default 10000)
EXPOSE 10000

CMD ["node", "src/server.js"]
