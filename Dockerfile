FROM node:alpine

RUN mkdir -p /usr/src/code-academy-authentication && chown -R node:node /usr/src/code-academy-authentication

WORKDIR /usr/src/code-academy-authentication

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 4000
