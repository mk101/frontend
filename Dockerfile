FROM node:22-alpine3.18 AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25.5-alpine
COPY --from=build /usr/src/app/dist/frontend-app/browser /usr/share/nginx/html
