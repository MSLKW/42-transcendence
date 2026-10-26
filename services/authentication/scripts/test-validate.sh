#!/bin/bash
# Usage: ./validate.sh <token>

if [ "$#" -ne 1 ]; then
	echo "Usage: $0 <token>"
	exit 1
fi

if [ -f .env ]; then
	export $(cat .env | grep PORT)
fi

TOKEN="$1"
BASE_URL="${BASE_URL:-http://localhost}"
PORT="${PORT:-3000}"

curl -s -X GET "$BASE_URL:$PORT/validate" \
	-H "Authorization: Bearer $TOKEN" \
	-v
echo ""
