FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN mkdir -p uploads

EXPOSE 5000

CMD ["npx", "tsx", "server.ts"]