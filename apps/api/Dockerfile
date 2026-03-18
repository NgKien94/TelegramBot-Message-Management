FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=libs/db/src/prisma/schema.prisma
RUN npx nx build api

CMD [ "node","dist/apps/api/main.js" ]
