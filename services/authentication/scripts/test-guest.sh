#!/bin/bash

IDENTIFIER="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"
# BASE_URL="${BASE_URL:-http://localhost:3000}"

curl -s -X POST "$BASE_URL/guest" \
  -v
echo ""
