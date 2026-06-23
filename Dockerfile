FROM node:20 AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# DEV
FROM base AS dev

CMD ["npm", "run", "dev"]

# PROD BUILD
FROM base AS builder

RUN npm run build

# PROD
FROM node:20-alpine AS prod

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

CMD ["npm", "start"]