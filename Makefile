# --- Colours  --------------------------------------------------------------
GREEN = \033[0;32m
BLUE = \033[0;34m
PURPLE = \033[1;35m
PURPLE_BG_WHITE_TEXT = \033[37;45m			# Standard white text on a purple background
BRIGHT_WHITE_PURPLE_BG = \033[1;37;45m		# Bright/Bold white text on a purple background (usually looks cleaner)
RESET = \033[0K\033[0m  					#\033[0K for reset background colour


# --- Put this at the very top of your file, before the "all:" target -------
include .env
export


# --- Compose ---------------------------------------------------------------
# Single compose file for now (no dev override yet).
COMPOSE				=	docker compose -f ./docker-compose.yml
SHELLABLE_SERVICES	:=	website authentication party profile friends chat game-server game-bot game-stats \
               			postgresql nginx 
# drizzle-gateway migrator redis


# --- Makefile Commands -----------------------------------------------------
## Build (cached) and start all services; recreates only whats changed
all: 
	@echo "$(PURPLE)\n🛠️  Building and launching full Docker environment from scratch... \n$(RESET)"
	@$(COMPOSE) up --build 
#-d
 

## Stop and remove containers + network (keeps images & volumes)
down: 
	@echo "$(PURPLE) Removing all containers & networks on Docker (except images and volumes)...\n$(RESET)" 
	@$(COMPOSE) down
 

## Start existing containers, no rebuild (ignoring changes)
up: 
	@echo "$(PURPLE) Starting/Resuming services after down/stop, ignoring changes on Docker...\n$(RESET)"
	@$(COMPOSE) up 
#-d
 

## Down + Up with network/volumes untouched
recreate: 
	@echo "$(PURPLE) Starting/Resuming services, picking up changes on docker by replacing containers (except touching volumes)...\n$(RESET)"
	@$(COMPOSE) up --force-recreate
#-d


## Remove containers, networks, and images (keeps volumes)
clean: 
	@echo "$(PURPLE)\n🗑️  Removing all containers, network and images including public base images (keeping volumes)...\n$(RESET)"
	@$(COMPOSE) down --rmi all
	@echo "$(PURPLE)\n🗑️  Done cleaning all containers, networks and images! \n$(RESET)"


## Clean + wipe volumes
fclean: clean 
	@echo "$(PURPLE)\n🗑️🚨 Removing this project's Docker volumes...\n$(RESET)"
	@$(COMPOSE) down --volumes
	@echo "$(PURPLE)\n🗑️💥 Done, Absolutely everything are removed now!\n$(RESET)"


## Full rebuild from scratch
re: fclean all 
 

## Stream logs from all running services
logs:
	@if [ $$($(COMPOSE) ls | wc -l) -eq 1 ]; then \
		echo "No services running"; \
	else \
		$(COMPOSE) logs -f; \
	fi;


## Open a shell in a service (e.g. make shell-website)
shell-:
	@printf 'Usage: make shell-<%s>\n' "$(shell echo $(SERVICES) | tr ' ' '|')"
define SHELL_TEMPLATE
shell-$(1):
	@$(COMPOSE) exec $(1) sh
endef
$(foreach service,$(SHELLABLE_SERVICES),$(eval $(call SHELL_TEMPLATE,$(service)))) 

## List containers, networks, images, volumes
ls:
# 	@echo "$(PURPLE)Project Containers: $(COMPOSE) ps -a$(RESET)"
# 	@$(COMPOSE) ps -a
	@echo "$(PURPLE)All Containers: docker ps -a$(RESET)"
	@docker ps -a
	@echo "$(PURPLE)\ndocker network ls$(RESET)"
	@docker network ls
	@echo "$(PURPLE)\ndocker image ls$(RESET)"
	@docker image ls
	@echo "$(PURPLE)\ndocker volume ls$(RESET)"
	@docker volume ls


## Destructive! Total system wipe out across entire machine.
nuclear:
	@echo "$(PURPLE)docker system prune -a --volumes -f$(RESET)"
	@docker system prune -a --volumes -f
# -a: Removes all unused images, not just dangling ones.
# --volumes: Removes all unused volumes.
# -f: Forces removal without prompting.
 

## Remove everything belonging to this specific stack/project
purge:
	@docker stop $$(docker ps -aq) 2>/dev/null || true
	@docker rm $$(docker ps -aq) 2>/dev/null || true
	@docker rmi $$(docker images -q) 2>/dev/null || true
	@docker volume prune -f
	@docker network prune -f


## Build images with plain text output including exact error messages for debugging 
progress: 
	@$(COMPOSE) build --progress=plain
 

## See what Docker reads from docker compose
config: 
	@$(COMPOSE) config 
 
 
## Show available Makefile commands
help: 
	@awk '/^## /{desc=substr($$0,4); next} \
	/^[a-zA-Z_-]+:/{split($$1,a,":"); if(desc) \
	printf "  \033[36m%-20s\033[0m %s\n", a[1], desc; desc=""}' $(MAKEFILE_LIST)
 
 
.PHONY: all down up recreate clean fclean re logs nuclear purge progress config ls ls-all help shell-


# --- as references only, not to be run via makefile commands ----------------------------------------------
## Step-by-step full teardown of THIS project only (stop, rm containers, rm images, rm volumes, rm networks)
# complete-clean:
# 	@echo "$(PURPLE)Stopping all running containers for this project...$(RESET)"
# 	@$(COMPOSE) stop
# 	@echo "$(PURPLE)Removing all containers for this project...$(RESET)"
# 	@$(COMPOSE) rm -f
# 	@echo "$(PURPLE)Removing all images built for this project...$(RESET)"
# 	@$(COMPOSE) down --rmi all
# 	@echo "$(PURPLE)Removing all volumes for this project...$(RESET)"
# 	@$(COMPOSE) down --volumes
# 	@echo "$(PURPLE)Removing this project's network...$(RESET)"
# 	@$(COMPOSE) down
# 	@echo "$(PURPLE)Done — this project's containers, images, volumes and networks are gone.$(RESET)"
