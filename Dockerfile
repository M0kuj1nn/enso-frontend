# 1. Сборка
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Продакшн
FROM node:18

WORKDIR /app

COPY --from=builder /app ./

RUN npm install --production

CMD ["npm", "start"]