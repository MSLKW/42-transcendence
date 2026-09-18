FROM postgres:17-bookworm
EXPOSE 5432

# Bind mounts (:ro) enforce read-only access at the kernel level, blocking writes even from root.
# File permissions (chmod) fail against root within the container, which can simply override and restore write permissions.
# Combining COPY with a bind mount makes the baked image file unused dead weight, as the mount overlays it at runtime.
# Using a read-only bind mount alone is cleaner and provides stronger security against root-level compromises.