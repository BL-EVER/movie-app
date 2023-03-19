FROM node:14

ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app
ADD . /app
RUN npm install
RUN npm install pm2 -g

CMD ["pm2-runtime", "index.js"]
