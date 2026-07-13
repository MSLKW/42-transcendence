#!/bin/bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <identifier> <password>"
  exit 1
fi

IDENTIFIER="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -s -X POST "$BASE_URL/signin" \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"$IDENTIFIER\",\"password\":\"$PASSWORD\"}" \
  -v
echo ""
