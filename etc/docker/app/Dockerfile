FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./etc/docker/app/entrypoint.sh ./entrypoint.sh
RUN chmod 744 ./entrypoint.sh
CMD ["./entrypoint.sh"]
