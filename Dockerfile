FROM node:stretch-slim as builder

RUN npm i -g pkg

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm i
COPY src src
RUN mkdir /home/node/app/src/credential/use-case/file

EXPOSE 7002
CMD ["node","dist/app.js"]