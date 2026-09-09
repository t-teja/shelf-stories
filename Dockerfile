# ---- Frontend build ----
FROM node:22-bookworm AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY public ./public
COPY src ./src
ENV VITE_DATA_MODE=api
ENV VITE_API_URL=/api
ENV VITE_BASE=/
RUN npm run build

# ---- Server deps (native better-sqlite3) ----
FROM node:22-bookworm AS server-deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# ---- Runtime ----
FROM node:22-bookworm-slim AS runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends libstdc++6 \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server/package.json ./server/package.json
COPY server/src ./server/src
COPY --from=frontend /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3080
ENV DATA_DIR=/data
ENV UPLOADS_DIR=/data/uploads
ENV DB_PATH=/data/shelf-stories.sqlite
ENV STATIC_DIR=/app/dist

RUN mkdir -p /data/uploads
VOLUME ["/data"]
EXPOSE 3080

WORKDIR /app/server
CMD ["node", "src/index.js"]
