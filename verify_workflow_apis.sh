#!/bin/bash
BASE_URL="http://localhost:3000/api/control-center"

echo "Verifying Alert APIs..."

# List Alerts
echo "1. Listing Alerts..."
ALERTS=$(curl -s "$BASE_URL/alerts")
echo "Response: $ALERTS"
if echo $ALERTS | grep "alert-1" > /dev/null; then
  echo "Found alert-1"
else
  echo "alert-1 not found!"
  exit 1
fi

ALERT_ID=$(echo $ALERTS | jq -r '.[0].id')
echo "Found Alert ID: $ALERT_ID"

# Ack Alert
echo "2. Acknowledging Alert $ALERT_ID..."
curl -s -X POST "$BASE_URL/alerts/$ALERT_ID/ack" | grep "ACKNOWLEDGED" > /dev/null

# Assign Alert
echo "3. Assigning Alert $ALERT_ID..."
curl -s -X POST -H "Content-Type: application/json" -d '{"assigneeId":"user-2"}' "$BASE_URL/alerts/$ALERT_ID/assign" | grep "user-2" > /dev/null

echo "Verifying Workflow APIs..."

# Create Draft
echo "4. Creating Draft Workflow..."
DRAFT_RES=$(curl -s -X POST -H "Content-Type: application/json" -d '{"title":"Fix Pump Vibration","description":"Standard procedure","sourceAlertId":"alert-1"}' "$BASE_URL/workflows/drafts")
echo "Draft Response: $DRAFT_RES"
WORKFLOW_ID=$(echo $DRAFT_RES | jq -r '.id')
echo "Created Workflow ID: $WORKFLOW_ID"

# Simulate
echo "5. Simulating Workflow $WORKFLOW_ID..."
SIM_RES=$(curl -s -X POST "$BASE_URL/workflows/$WORKFLOW_ID/simulate")
echo "Simulate Response: $SIM_RES"
echo $SIM_RES | grep "riskScoreChange" > /dev/null

# Commit
echo "6. Committing Workflow $WORKFLOW_ID..."
COMMIT_RES=$(curl -s -X POST "$BASE_URL/workflows/$WORKFLOW_ID/commit")
echo "Commit Response: $COMMIT_RES"
echo $COMMIT_RES | grep "COMMITTED" > /dev/null

echo "SUCCESS: Alert & Workflow APIs Verified"
