FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf			/etc/nginx/nginx.conf
COPY ./server.conf.template	/etc/nginx/templates/default.conf.template

ENV DOMAIN_PORT=80
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: DOMAIN_PORT=${DOMAIN_PORT}` overrides this ENV at runtime.

EXPOSE ${DOMAIN_PORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=2s \
	CMD wget -q --spider http://localhost:${DOMAIN_PORT}/health || exit 1
# ^ nginx only need to include the port in the URL if you have explicitly changed NGINX to listen 
# on a non-standard port (other than 80) inside its default.conf.template
# shorter start-period = It's not waiting on anything at boot, just needs the process to bind the port

# ENTRYPOINT ["nginx", "-g", "daemon off;"]
