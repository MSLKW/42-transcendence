# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aimokhta <aimokhta@student.42kl.edu.my>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2026/06/16 09:31:30 by aimokhta          #+#    #+#              #
#    Updated: 2026/07/16 16:43:14 by aimokhta         ###   ########.fr        #
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
	@mkdir -p $(PWD)/data/$(DB_VOLUME_NAME)
	@echo "$(PURPLE)\n🛠️  Building and launching containers...\n$(RESET)"
	@docker compose -f ./docker-compose.yml up --build -d

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
	@sudo rm -rf $(PWD)/data
	@echo "$(PURPLE)\n🗑️  Removed all volumes on host! $(RESET)\n"

re: fclean all

logs:
	docker logs postgres-rdbms
	docker logs drizzle-orm
	docker logs auth
	docker logs website
	docker logs game
	docker logs game-bot
	docker logs chat

# Run this once you are done developing to lock the doors & ready to harden the DB
harden-db:
	@echo "$(PURPLE)Hardening database...\n$(RESET)"
# 	This command replaces ${VAR} in the SQL file with actual values from .env
	@cat ./packages/database/scripts/harden.sql | envsubst | docker exec -i postgresql-rdbms psql -U $(POSTGRES_USER_NAME_ADMIN) -d $(POSTGRES_DB_NAME)
# 	@docker exec -i postgresql-rdbms psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f ./packages/database/scripts/harden.sql



.PHONY: all down recreate clean fclean re logs harden-db
