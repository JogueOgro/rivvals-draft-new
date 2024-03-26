FROM node:20.11.0-alpine

RUN npm install -g serve

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3001

CMD [ "yarn", "start" ]
