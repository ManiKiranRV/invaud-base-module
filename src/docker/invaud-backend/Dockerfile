FROM node:14-alpine AS node

FROM node AS builder

ENV NODE_ENV=build

WORKDIR /usr/src

COPY package.json .
COPY yarn.lock .

COPY ./core/package.json ./core/
# COPY ./core/yarn.lock ./core/

COPY ./invaud-backend/package.json ./invaud-backend/
# COPY ./invaud-backend/yarn.lock ./invaud-backend/

RUN yarn install

COPY ./core ./core
COPY ./invaud-backend ./invaud-backend

COPY tsconfig.base.json .
COPY tsconfig.packages.json .

WORKDIR /usr/src/invaud-backend

RUN yarn run prisma generate
##This is done to ensure the cache is used for this build step
#COPY ./invaud-backend/package.json ./
#COPY ./invaud-backend/yarn.lock ./
#
#RUN yarn install

RUN yarn run tsc -b -f

RUN yarn run build

FROM node AS production

ENV NODE_ENV=production

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL

WORKDIR /usr/src

COPY package.json .
COPY yarn.lock .

COPY ./core/package.json ./core/
# COPY ./core/yarn.lock ./core/

COPY ./invaud-backend/package.json ./invaud-backend/
# COPY ./invaud-backend/yarn.lock ./invaud-backend/

RUN yarn install

COPY --from=builder /usr/src/invaud-backend/dist ./invaud-backend/dist
COPY --from=builder /usr/src/invaud-backend/prisma ./invaud-backend/prisma
COPY --from=builder /usr/src/core/build ./core/build

WORKDIR /usr/src/invaud-backend

# This has to be done for bcrypt to still work
RUN apk add --no-cache make gcc g++ python
RUN yarn install
RUN npm rebuild bcrypt --build-from-source

#regenerate prisma schema
RUN yarn run prisma generate

CMD ["yarn", "run","start:prod"]
