FROM node:alpine

WORKDIR /usr/api

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD yarn start