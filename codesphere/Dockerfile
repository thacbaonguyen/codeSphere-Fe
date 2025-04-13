FROM node:14-alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

## run stage
FROM nginx:alpine
COPY --from=build /app/dist/codesphere/* /usr/share/nginx/html/

## create and move asset file to html/assets
RUN mkdir -p /usr/share/nginx/html/assets

RUN mv /usr/share/nginx/html/images /usr/share/nginx/html/assets/ || true
RUN mv /usr/share/nginx/html/svg-icon /usr/share/nginx/html/assets/ || true
RUN mv /usr/share/nginx/html/logo-dashboard /usr/share/nginx/html/assets/ || true

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
