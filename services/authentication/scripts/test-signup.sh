#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <email> <password>"
  exit 1
fi

if [ -f .env ]; then
	export $(cat .env | grep PORT)
fi

EMAIL="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"
# BASE_URL="${BASE_URL:-http://localhost}"
# PORT="${PORT:-3000}"

# curl -s -X POST "$BASE_URL:$PORT/signup" \
curl -s -X POST "$BASE_URL/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -v
echo ""
