#Node
FROM node:14-alpine as build
WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install -g serve
COPY . .
RUN npm run build
ENTRYPOINT [ "serve","-s","build" ]

#Nginx
#FROM nginx:alpine
#COPY --from=build /app/build /usr/share/nginx/html