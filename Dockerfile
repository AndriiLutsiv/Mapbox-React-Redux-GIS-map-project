# build frondend
FROM node:16-alpine as frontend-build
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run build

FROM nginx 
WORKDIR /app
COPY --from=frontend-build /app/build /usr/share/nginx/html