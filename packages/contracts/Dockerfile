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

# Иначе сыпится ошибка с отсутствием бинарников для sqlite
RUN npm uninstall sqlite3
RUN npm install sqlite3 -S

COPY --from=build /app/dist/* .

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
