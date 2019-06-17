FROM node:10.16.0-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock .env ./

RUN yarn install --prod

COPY src/ src/

CMD ["yarn", "start"]
