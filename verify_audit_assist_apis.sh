#!/bin/bash
set -e

BASE_URL="http://localhost:3000/api/control-center"

echo "Verifying Assist API..."
ASSIST_RES=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query":"Analyze pump vibration"}' "$BASE_URL/assist")
echo "Assist Response: $ASSIST_RES"
echo $ASSIST_RES | grep "confidence" > /dev/null

echo "Verifying Audit API..."
AUDIT_RES=$(curl -s "$BASE_URL/audit")
echo "Audit Response Length: $(echo $AUDIT_RES | jq '. | length')"
# Check if the assist query was logged
echo $AUDIT_RES | grep "Analyze pump vibration" > /dev/null

echo "SUCCESS: Audit & Assist APIs Verified"
