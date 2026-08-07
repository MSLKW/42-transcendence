#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <session_token>"
  exit 1
fi

TOKEN="$1"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"

curl -s -X DELETE "$BASE_URL/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -v
echo ""
