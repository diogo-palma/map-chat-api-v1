# Use a imagem Node.js 20 como base
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /home/node/app

COPY . .

RUN npm install

EXPOSE 3000

# ENV VAR_NAME=value


CMD ["npm", "run", "start"]