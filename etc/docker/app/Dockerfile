FROM node:20.17.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./etc/docker/app/entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod 744 /usr/bin/entrypoint.sh
CMD ["bash", "/usr/bin/entrypoint.sh"]
