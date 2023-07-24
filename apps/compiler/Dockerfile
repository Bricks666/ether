FROM node:lts-alpine as build

WORKDIR /app

COPY tsconfig.json .
COPY package*.json .
RUN npm i --ignore-scripts

COPY ./rollup.config.js .

COPY ./src ./src

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY package*.json .
RUN npm i --omit dev --ignore-scripts

COPY --from=build /app/dist/* .

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
