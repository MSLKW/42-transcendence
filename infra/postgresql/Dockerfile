FROM postgres:17-bookworm

ENV PGPORT=5432
# ^ default fallback only, in case someone runs this image standalone without Compose.
# Compose's `environment: PGPORT=${PGPORT}` overrides this ENV at runtime.

EXPOSE ${PGPORT}

HEALTHCHECK --interval=5s --timeout=3s --retries=3 --start-period=10s \
	CMD pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" || exit 1
# HEALTHCHECK CMD pg_isready -U "$POSTGRES_USER"|| exit 1
# pg_isready tool automatically looks at the PGPORT environment variable inside the container. 
# If you change PGPORT=5433 in your environment, 
# pg_isready detects it instantly and checks port 5433. 
# You only need to explicitly type -p if you choose not to use the standard PGPORT environment variable.
# --start-period for postgres esp takes long coz startup costs real cost — init scripts, WAL setup, possible recovery
# pg_isready (like psql and most other libpq tools) defaults the database name to the username when -d/--dbname isn't given.

# Bind mounts (:ro) enforce read-only access at the kernel level, blocking writes even from root.
# File permissions (chmod) fail against root within the container, which can simply override and restore write permissions.
# Combining COPY with a bind mount makes the baked image file unused dead weight, as the mount overlays it at runtime.
# Using a read-only bind mount alone is cleaner and provides stronger security against root-level compromises.