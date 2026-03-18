FROM node:22 as builder-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx nx build web

# copy assets
RUN cp -r /app/apps/web/public/. /app/dist/apps/web/

# Nginx serve file
FROM nginx:1.27-alpine as production-stage
COPY --from=builder-stage /app/dist/apps/web /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
