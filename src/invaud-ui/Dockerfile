# Production like docker file - we could use later
# Stage 0: compile angular
# FROM node:14 AS build
# RUN mkdir -p /app
# WORKDIR /app
# COPY . .
# RUN yarn install
# RUN yarn build

# # Stage 1: Serve
# FROM nginx:latest
# COPY --from=build /app/dist/ui  /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80

FROM node:14
RUN mkdir -p /app
WORKDIR /app

COPY tsconfig.base.json .
COPY tsconfig.packages.json .
COPY package.json .
COPY yarn.lock .

COPY ./core/package.json ./core/
COPY ./core/tsconfig.json ./core/
COPY ./core/yarn.lock ./core/

COPY ./ui/package.json ./ui/
COPY ./ui/yarn.lock ./ui/
COPY ./ui/tsconfig.json ./ui/

RUN yarn install

COPY ./core ./core
COPY ./ui ./ui

WORKDIR /app/ui

EXPOSE 4200 49153

CMD ["yarn", "start"]
