FROM node:lts-alpine as builder
WORKDIR /static

ARG VITE_API_PROVIDER
ARG VITE_CONTRACT_NAME
ARG VITE_CONTRACTS_SERVICE_HOST

COPY ./package*.json /static/
RUN npm ci --ignore-scripts --omit=dev
RUN npm ci typescript

COPY index.html .
COPY .babelrc .
COPY tsconfig*.json .
COPY vite.config.ts .

COPY ./.env.production ./

COPY ./src  ./src

RUN npm run build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /static/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
