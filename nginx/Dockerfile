FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./server.conf.template /etc/nginx/templates/server.conf.template

EXPOSE 80

# ENTRYPOINT ["nginx", "-g", "daemon off;"]
