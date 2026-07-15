#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <email> <password>"
  exit 1
fi

EMAIL="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -s -X POST "$BASE_URL/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -v
echo ""
