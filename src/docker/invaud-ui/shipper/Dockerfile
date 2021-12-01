FROM node:14 as builder
RUN mkdir -p /app
WORKDIR /app

COPY tsconfig.base.json .
COPY tsconfig.packages.json .
COPY package.json .
COPY yarn.lock .

COPY ./core/package.json ./core/
COPY ./core/tsconfig.json ./core/

COPY ./invaud-ui/package.json ./invaud-ui/
COPY ./invaud-ui/yarn.lock ./invaud-ui/
COPY ./invaud-ui/tsconfig.json ./invaud-ui/

RUN yarn install

COPY ./core ./core
COPY ./invaud-ui ./invaud-ui

WORKDIR /app/invaud-ui

RUN yarn build

### STAGE 2: Run ###
FROM nginx:1.15.8-alpine

COPY --from=builder /app/invaud-ui/dist/invaud-ui /usr/share/nginx/html
COPY ./docker/invaud-ui/shipper/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
