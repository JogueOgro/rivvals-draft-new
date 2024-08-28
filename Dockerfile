FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install -g npm@10.7.0 --force
RUN npm install react-app-rewired --force
RUN npm install --force
COPY . .
RUN npm run build

FROM node:20-slim

WORKDIR /app
COPY --from=builder /app .
ENV PORT=80
EXPOSE $PORT

CMD ["npm", "start"]
