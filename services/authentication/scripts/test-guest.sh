#!/bin/bash

IDENTIFIER="$1"
PASSWORD="$2"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"

curl -s -X POST "$BASE_URL/guest" \
  -v
echo ""
