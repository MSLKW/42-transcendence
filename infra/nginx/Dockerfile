FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./server.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# ENTRYPOINT ["nginx", "-g", "daemon off;"]
