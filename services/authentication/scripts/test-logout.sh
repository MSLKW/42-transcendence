#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <session_token>"
  exit 1
fi

if [ -f .env ]; then
	export $(cat .env | grep PORT)
fi

TOKEN="$1"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"
# BASE_URL="${BASE_URL:-http://localhost}"
# PORT="${PORT:-3000}"

# curl -s -X DELETE "$BASE_URL:$PORT/logout" \
curl -s -X DELETE "$BASE_URL/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -v
echo ""
