FROM node:22-alpine AS dev-tools
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY drizzle.config.ts tsconfig.json ./

FROM dev-tools AS builder
ARG DATABASE_URL
COPY src ./src
ARG CACHE_BUST
RUN npm run db:introspect
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]

FROM builder AS debug
EXPOSE 3001 9229
CMD ["node_modules/.bin/tsx", "--inspect=0.0.0.0:9229", "src/index.ts"]
