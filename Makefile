# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aimokhta <aimokhta@student.42kl.edu.my>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/06/16 09:31:30 by aimokhta          #+#    #+#              #
#    Updated: 2026/07/26 16:28:32 by aimokhta         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Colours
GREEN = \033[0;32m
BLUE = \033[0;34m
PURPLE = \033[1;35m
PURPLE_BG_WHITE_TEXT = \033[37;45m			# Standard white text on a purple background
BRIGHT_WHITE_PURPLE_BG = \033[1;37;45m		# Bright/Bold white text on a purple background (usually looks cleaner)
RESET = \033[0K\033[0m  					#\033[0K for reset background colour

# Put this at the very top of your file, before the "all:" target
include .env
export

all:
	@mkdir -p $(HOME)/data/$(PG_VOLUME_NAME)
	@mkdir -p $(HOME)/data/$(DG_VOLUME_NAME)
	@sudo chmod -R 777 $(HOME)/data/$(DG_VOLUME_NAME)
	@echo "$(PURPLE)\n🛠️  Building and launching containers...\n$(RESET)"
	@docker compose -f ./docker-compose.yml up --build

down:
# Docker removes the containers & networks, keeps built images saved on your disk.
	@echo "$(PURPLE) Removing everything on Docker except images...\n$(RESET)" 
	@docker compose -f ./docker-compose.yml down

up:
# Start/Resume services (ignoring changes)
	@echo "$(PURPLE) Starting/Resuming services after down/stop, ignoring changes on Docker...\n$(RESET)"
	@docker compose -f ./docker-compose.yml up -d

# A "soft" restart that picks up changes but keeps data
recreate:
	@echo "$(PURPLE) Starting/Resuming services, picking up changes on docker except on host (volumes)...\n{RESET)"
	@docker compose -f ./docker-compose.yml up -d --force-recreate

clean:
	@echo "$(PURPLE)\n🗑️  Removing all containers, volumes, network and images including public base images in Docker...\n$(RESET)"
	@docker compose -f ./docker-compose.yml down --volumes --rmi all
	@echo "$(PURPLE)\n🗑️  Done removed every single containers, volumes and images in Docker! \n$(RESET)"
	
fclean: clean
	@sudo rm -rf $(HOME)/data
	@echo "$(PURPLE)\n🗑️  Removed all volumes on host! $(RESET)\n"

re: fclean all

logs:
	docker logs postgresql
	docker logs migrator
	docker logs drizzle-gateway
	docker logs auth
# 	docker logs website
# 	docker logs game
# 	docker logs game-bot
# 	docker logs chat

nuclear:
	@docker system prune -a --volumes -f
# -a: Removes all unused images, not just dangling ones.
# --volumes: Removes all unused volumes.
# -f: Forces removal without prompting.

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

debug-logs:
# This will force Docker to print the full output of every step, including the exact error message from npm
	@docker compose build --progress=plain

debug-config:
# 	to see what docker reads from docker compose
	@docker compose config 


.PHONY: all down recreate clean fclean re logs nuclear debug-logs
