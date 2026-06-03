## Multi-stage Dockerfile: build client, then run server
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false || true
COPY . .
WORKDIR /app
RUN npm run build || echo "skip build"

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json /app/server/package.json
WORKDIR /app/server
RUN npm ci --production --no-audit --progress=false || true
COPY server/ /app/server/
COPY --from=builder /app/dist /app/server/public
EXPOSE 8080
CMD ["node", "index.js"]
