import requests
import time
import sys

BASE_URL = "http://localhost:3000/api/risk"

def wait_for_server():
    print("Waiting for server...")
    for _ in range(60):
        try:
            r = requests.get(f"{BASE_URL}/jurisdictions")
            if r.status_code == 200:
                print("Server is up!")
                return True
        except requests.ConnectionError:
            pass
        time.sleep(1)
    return False

def test_risk_flow():
    # 1. Jurisdictions
    print("\n[1] Testing Jurisdictions...")
    res = requests.get(f"{BASE_URL}/jurisdictions")
    assert res.status_code == 200
    jurisdictions = res.json()['data']
    assert len(jurisdictions) >= 3
    us_tx = next((j for j in jurisdictions if j['code'] == 'US-TX'), None)
    assert us_tx is not None
    print("OK - Found US-TX")

    # 2. Watchlist (Create one for testing)
    print("\n[2] Creating Test Watchlist...")
    wl_payload = {
        "name": "Test Watchlist",
        "filters": {
            "jurisdiction_ids": [us_tx['id']],
            "keywords": ["test"]
        },
        "created_by": "tester"
    }
    res = requests.post(f"{BASE_URL}/watchlists", json=wl_payload)
    assert res.status_code == 200
    watchlist = res.json()['data']
    wl_id = watchlist['id']
    print(f"OK - Created Watchlist {wl_id}")

    # 3. Create Regulation
    print("\n[3] Creating Regulation...")
    reg_payload = {
        "jurisdiction_id": us_tx['id'],
        "title": "Test Regulation Alpha",
        "description": "This is a test regulation for compliance.",
        "status": "pending",
        "effective_date": "2024-12-31"
    }
    res = requests.post(f"{BASE_URL}/regulations", json=reg_payload)
    assert res.status_code == 200
    reg = res.json()['data']
    reg_id = reg['id']
    print(f"OK - Created Regulation {reg_id}")

    # 4. Update Regulation -> Trigger Version & Watchlist
    print("\n[4] Updating Regulation...")
    update_payload = {
        "title": "Test Regulation Alpha (Revised)",
        "status": "active"
    }
    res = requests.put(f"{BASE_URL}/regulations/{reg_id}", json=update_payload)
    if res.status_code != 200:
        print(f"FAILED: {res.status_code} - {res.text}")
    assert res.status_code == 200
    updated_reg = res.json()['data']
    assert updated_reg['title'] == "Test Regulation Alpha (Revised)"
    assert updated_reg['status'] == "active"
    print("OK - Updated Regulation")

    # 5. Verify Versions
    print("\n[5] Verifying Versions...")
    res = requests.get(f"{BASE_URL}/regulations/{reg_id}/versions")
    assert res.status_code == 200
    versions = res.json()['data']
    print(f"DEBUG: Versions found: {len(versions)}")
    for v in versions:
        print(f" - {v['version']}: {v['changes_summary']}")
    assert len(versions) == 2
    print(f"OK - Found {len(versions)} versions")
    print(f"Latest change: {versions[1]['changes_summary']}")

    # 6. Verify Watchlist Event (Feed)
    print("\n[6] Verifying Watchlist Event...")
    # Give it a moment? It's synchronous in service but just in case
    res = requests.get(f"{BASE_URL}/feed")
    assert res.status_code == 200
    feed = res.json()['data']
    print(f"DEBUG: Feed items: {len(feed)}")
    for f in feed:
        print(f" - {f['type']} on {f.get('regulation_id')} : {f['summary']}")

    # Should find event for our regulation
    event = next((e for e in feed if e['regulation_id'] == reg_id and e['type'] == 'REGULATION_UPDATE'), None)
    assert event is not None
    print(f"OK - Found Feed Event: {event['summary']}")

    # 7. Create Assessment
    print("\n[7] Creating Assessment...")
    asm_payload = {
        "asset_id": "well-01",
        "jurisdiction_id": us_tx['id'],
        "regulation_id": reg_id,
        "status": "WARNING",
        "assessed_by": "tester"
    }
    res = requests.post(f"{BASE_URL}/assessments", json=asm_payload)
    assert res.status_code == 200
    assessment = res.json()['data']
    assert assessment['score'] == 60 # Check deterministic scoring logic
    print(f"OK - Created Assessment {assessment['id']} with score {assessment['score']}")

    # 8. Create Issue
    print("\n[8] Creating Issue...")
    iss_payload = {
        "assessment_id": assessment['id'],
        "asset_id": "well-01",
        "title": "Fix compliance warning",
        "description": "Address the warning status.",
        "severity": "MEDIUM",
        "status": "OPEN",
        "owner_id": "user-1",
        "due_date": "2025-01-01"
    }
    res = requests.post(f"{BASE_URL}/issues", json=iss_payload)
    assert res.status_code == 200
    issue = res.json()['data']
    print(f"OK - Created Issue {issue['id']}")

    print("\n[SUCCESS] All Risk API tests passed!")

if __name__ == "__main__":
    if not wait_for_server():
        print("Server failed to start")
        sys.exit(1)
    test_risk_flow()
