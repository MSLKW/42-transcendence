FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf			/etc/nginx/nginx.conf
COPY ./server.conf.template	/etc/nginx/templates/default.conf.template

ENV DOMAIN_PORT=80
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: DOMAIN_PORT=${DOMAIN_PORT}` overrides this ENV at runtime.

EXPOSE ${DOMAIN_PORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=2s \
	CMD wget -q --spider http://127.0.0.1:${DOMAIN_PORT}/health || exit 1
	# 127.0.0.1 is the explicit IPv4 loopback
	# localhost:
		# - isn't guaranteed to mean "IPv4 loopback only"; 
		# - is a hostname, not an address.
		# - ambiguous on a dual-stack-capable resolver
		# - localhost is ambiguous on a dual-stack-capable resolver (even if you didn't explicitly enable IPv6 on the Docker network, the container's own loopback interface almost always still has ::1 available locally, since loopback IPv6 isn't controlled by your Docker bridge network config at all — it's part of the container's own network namespace/kernel, enabled by default).
# ^ nginx only need to include the port in the URL if you have explicitly changed NGINX to listen 
# on a non-standard port (other than 80) inside its default.conf.template
# shorter start-period = It's not waiting on anything at boot, just needs the process to bind the port

# ENTRYPOINT ["nginx", "-g", "daemon off;"]
