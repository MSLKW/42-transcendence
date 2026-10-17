#!/bin/bash

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 <botSessionToken> <lobbyId> <seatIndex>"
  exit 1
fi

if [ -f .env ]; then
	export $(cat .env | grep PORT)
fi

BOT_SESSION_TOKEN="$1"
LOBBY_ID="$2"
SEAT_INDEX="$3"
BASE_URL="${BASE_URL:-http://localhost}"
PORT="${PORT:-3000}"

curl -s -X POST "$BASE_URL:$PORT/new-bot" \
  --json "{\"botSessionToken\":\"$BOT_SESSION_TOKEN\",\"lobbyId\":\"$LOBBY_ID\",\"seatIndex\":$SEAT_INDEX}" \
  -v
echo ""
