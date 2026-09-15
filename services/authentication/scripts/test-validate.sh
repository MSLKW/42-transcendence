#!/bin/bash
# Usage: ./validate.sh <token>

if [ "$#" -ne 1 ]; then
	echo "Usage: $0 <token>"
	exit 1
fi

TOKEN="$1"
BASE_URL="${BASE_URL:-http://localhost/api/auth}"

curl -s -X GET "$BASE_URL/validate" \
	-H "Authorization: Bearer $TOKEN" \
	-v
echo ""
