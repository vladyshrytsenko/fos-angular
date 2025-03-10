FROM node:18.19.0-bullseye-slim AS build
WORKDIR /project

RUN npm install -g @angular/cli@13

COPY package.json package-lock.json ./
RUN npm i

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /project/dist/angular /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
