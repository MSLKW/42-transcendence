FROM ghcr.io/drizzle-team/gateway:1.6.2

ENV PORT=4983
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PORT=${DRIZZLE_GATEWAY_PORT}` overrides this ENV at runtime.

EXPOSE ${PORT}

# as of v1.0.5, Drizzle Gateway added a native container health check via the /health endpoint, 
# meaning there's no need to define a custom healthcheck in Docker or Compose.
# the base image's own (bun run healthcheck.js, 30s/5s/3/10s) is inherited automatically since we don't override it

# masterpass is optional:
	# https://gateway.drizzle.team/docs/docker
