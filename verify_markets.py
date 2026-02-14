import time
from playwright.sync_api import sync_playwright

def verify(page):
    print("Navigating to /modules/markets")
    try:
        page.goto("http://localhost:3000/modules/markets", timeout=60000)
    except Exception as e:
        print(f"Navigation failed: {e}")
        return

    # Check for password gate
    try:
        # Wait a bit to see if gate appears
        page.wait_for_timeout(2000)
        if page.get_by_placeholder("Enter access key...").is_visible():
            print("Password Gate detected. Entering key.")
            page.get_by_placeholder("Enter access key...").fill("PetroV0")
            page.get_by_role("button", name="AUTHENTICATE").click()
            print("Authenticated. Waiting for load...")
            page.wait_for_timeout(5000)
    except Exception as e:
        print(f"Gate check failed: {e}")

    # Wait for content
    print("Waiting for load...")
    page.wait_for_timeout(5000)

    # Check default view (TRADER)
    print("Capturing Trader View")
    page.screenshot(path="verification_trader.png", full_page=True)

    # Switch to Risk
    print("Switching to RISK")
    try:
        page.get_by_text("RISK VIEW").click()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification_risk.png", full_page=True)
    except Exception as e:
        print(f"Failed to switch to Risk: {e}")

    # Switch to Executive
    print("Switching to EXECUTIVE")
    try:
        page.get_by_text("EXECUTIVE VIEW").click()
        page.wait_for_timeout(2000)
        page.screenshot(path="verification_executive.png", full_page=True)
    except Exception as e:
        print(f"Failed to switch to Executive: {e}")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    try:
        verify(page)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
