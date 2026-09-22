# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aimokhta <aimokhta@student.42kl.edu.my>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/06/16 09:31:30 by aimokhta          #+#    #+#              #
#    Updated: 2026/09/22 19:43:52 by aimokhta         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

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
COMPOSE		= docker compose -f ./docker-compose.yml
SERVICES	:= website authentication party profile friends chat game-server game-bot game-stats \
               postgresql drizzle-gateway migrator nginx redis


# --- Makefile Commands -----------------------------------------------------
## Build and start everything
all: 
	@echo "$(PURPLE)\n🛠️  Building and launching full Docker environment from scratch... \n$(RESET)"
	@$(COMPOSE) up --build 
#-d
 

## Removes the containers & networks. Images & volumes are still saved in disk
down: 
	@echo "$(PURPLE) Removing all containers & networks on Docker (except images and volumes)...\n$(RESET)" 
	@$(COMPOSE) down
 

## Start/Resume services (ignoring changes)
up: 
	@echo "$(PURPLE) Starting/Resuming services after down/stop, ignoring changes on Docker...\n$(RESET)"
	@$(COMPOSE) up 
#-d
 

## A "soft" restart that picks up changes but keeps data
recreate: 
	@echo "$(PURPLE) Starting/Resuming services, picking up changes on docker by replacing containers (except touching volumes)...\n$(RESET)"
	@$(COMPOSE) up --force-recreate
#-d


## Remove everything except volumes
clean: 
	@echo "$(PURPLE)\n🗑️  Removing all containers, network and images including public base images (keeping volumes)...\n$(RESET)"
	@$(COMPOSE) down --rmi all
	@echo "$(PURPLE)\n🗑️  Done cleaning all containers, networks and images! \n$(RESET)"


## Wipeout everything including volumes (with permission request)
fclean: clean 
	@echo "$(PURPLE)\n🗑️🚨 Removing this project's Docker volumes...\n$(RESET)"
	@$(COMPOSE) down --volumes
	@echo "$(PURPLE)\n🗑️💥 Done, Absolutely everything are removed now!\n$(RESET)"


## Wipeout everything and rebuild everything again
re: fclean all 
 

## Show logs from all containers (labeled & colored per service by compose)
logs:
	@if [ $$($(COMPOSE) ls | wc -l) -eq 1 ]; then \
		echo "No services running"; \
	else \
		$(COMPOSE) logs -f; \
	fi;


## Enter a running container with sh (some images, e.g. distroless, may not have one)
shell-:
	@printf 'Usage: make shell-<%s>\n' "$(shell echo $(SERVICES) | tr ' ' '|')"
define SHELL_TEMPLATE
shell-$(1):
	@$(COMPOSE) exec $(1) sh || echo "$(PURPLE)No shell available in '$(1)'$(RESET)"
endef
$(foreach service,$(SERVICES),$(eval $(call SHELL_TEMPLATE,$(service))))
 

## List all containers, networks, images & volumes
ls: 
	@echo "$(PURPLE)docker ps$(RESET)"
	@docker ps
	@echo "$(PURPLE)\ndocker network ls$(RESET)"
	@docker network ls
	@echo "$(PURPLE)\ndocker image ls$(RESET)"
	@docker image ls
	@echo "$(PURPLE)\ndocker volume ls$(RESET)"
	@docker volume ls


## Nuke ALL unused Docker data on this machine (not just this project) - use with care
nuclear:
	@echo "$(PURPLE)docker system prune -a --volumes -f$(RESET)"
	@docker system prune -a --volumes -f
# -a: Removes all unused images, not just dangling ones.
# --volumes: Removes all unused volumes.
# -f: Forces removal without prompting.
 

## Print the full build output including exact error messages
progress: 
	@$(COMPOSE) build --progress=plain
 

## See what Docker reads from docker compose
config: 
	@$(COMPOSE) config 
 
 
## Guide users what make commands available to use
help: 
	@awk '/^## /{desc=substr($$0,4); next} \
	/^[a-zA-Z_-]+:/{split($$1,a,":"); if(desc) \
	printf "  \033[36m%-20s\033[0m %s\n", a[1], desc; desc=""}' $(MAKEFILE_LIST)
 
 
.PHONY: all down up recreate clean fclean re logs nuclear progress config ls help shell- complete-clean


# --- as references only, not to be run via makefile commands ----------------------------------------------

## Run before eval as per inception's eval, to show nothing is running before eval
# complete-clean:
# 1. Stop all running containers
# 2. Remove all containers
# 3. Remove all images
# 4. Remove all volumes
# 5. Remove all networks
# 	docker stop $(docker ps -aq)
# 	docker rm $(docker ps -aq)
# 	docker rmi $(docker images -q)
# 	docker volume prune -f
# 	docker network prune -f


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
