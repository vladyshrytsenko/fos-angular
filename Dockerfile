FROM node:18.19.0-bullseye-slim

WORKDIR /project

RUN npm install -g @angular/cli@13

COPY package.json package-lock.json ./
RUN npm i

COPY . .

EXPOSE 4200
CMD [ "npm", "start" ]