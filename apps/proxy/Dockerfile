FROM node:lts-alpine as build

WORKDIR /app

COPY tsconfig.json .
COPY package*.json .

RUN npm ci --ignore-scripts
RUN npm i typescript -D --ignore-scrips

COPY ./src ./src

RUN npm run build

FROM nginx:alpine

WORKDIR /etc/nginx

RUN apk add nginx-mod-http-js

COPY ./configs/ ./
COPY --from=build /app/scripts/ ./scripts

CMD [ "nginx","-g", "daemon off;" ]
