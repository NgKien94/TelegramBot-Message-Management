FROM node:22 as builder-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY .env.docker .env

RUN npx nx build web

# copy assets
RUN cp -r /app/apps/web/public/. /app/dist/apps/web/

# Nginx serve file
FROM nginx:1.27-alpine as production-stage
COPY --from=builder-stage /app/dist/apps/web /usr/share/nginx/html

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
