#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <identifier> <password>"
  exit 1
fi

if [ -f .env ]; then
	export $(cat .env | grep PORT)
fi

IDENTIFIER="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost}"
PORT="${PORT:-3000}"

curl -s -X POST "$BASE_URL:$PORT/signin" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$IDENTIFIER\",\"password\":\"$PASSWORD\"}" \
  -v
echo ""
