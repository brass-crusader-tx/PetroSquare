import time
from playwright.sync_api import sync_playwright

def verify_risk_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Log console messages
            page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
            page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

            print("Navigating to Risk Module...")
            try:
                page.goto("http://localhost:3000/modules/risk", timeout=60000)
            except Exception as e:
                print(f"Navigation failed: {e}")
                page.screenshot(path="error_nav.png")
                raise

            # Handle Password Gate
            if page.is_visible("text=Enter access key") or page.is_visible("text=ACCESS KEY"):
                print("Password Gate detected. Authenticating...")
                page.fill("input[type='password']", "PetroV0")
                page.click("button:has-text('AUTHENTICATE')")
                page.wait_for_selector("text=Risk & Regulatory", timeout=10000)
                print("Authenticated.")

            # 1. Dashboard
            print("Verifying Dashboard...")
            page.screenshot(path="dashboard_debug.png")
            page.wait_for_selector("text=Risk & Regulatory")
            page.wait_for_selector("text=Compliance Score")
            page.wait_for_selector("text=Regulatory & Risk Feed")
            print("OK - Dashboard Loaded")

            # 2. Regulations
            print("Verifying Regulations Tab...")
            page.click("text=Regulations")
            page.wait_for_selector("text=Regulations Library")
            # Check rows
            page.wait_for_selector("text=Clean Air Act (CAA)")
            print("OK - Regulations List Loaded")

            # Drawer Interaction
            print("Opening Regulation Drawer...")
            page.click("text=Clean Air Act (CAA)")
            page.wait_for_selector("text=Overview")
            page.wait_for_selector("text=History & Versions")
            # Click History tab in Drawer
            page.click("button:has-text('History & Versions')")
            # Wait for specific text from seeded version
            page.wait_for_selector("text=Initial enactment.")

            print("OK - Regulation Drawer Verified")

            # 3. Assessments
            print("Verifying Assessments Tab...")
            page.click("button:has-text('Assessments')") # Be specific for top tabs
            page.wait_for_selector("text=New Compliance Assessment")
            page.wait_for_selector("text=Asset")
            page.wait_for_selector("text=Jurisdiction")
            print("OK - Assessment Form Loaded")

            # 4. Issues
            print("Verifying Issues Tab...")
            page.click("button:has-text('Issues')")
            page.wait_for_selector("text=Risk Issues & Tasks")
            print("OK - Issue Tracker Loaded")

            # 5. Watchlists
            print("Verifying Watchlists Tab...")
            page.click("button:has-text('Watchlists')")
            page.wait_for_selector("text=Your Watchlists")
            page.wait_for_selector("text=Select a Watchlist")
            print("OK - Watchlist Manager Loaded")

            # Go back to Dashboard for final screenshot
            page.click("text=Dashboard")
            page.wait_for_selector("text=Compliance Score")
            page.screenshot(path="risk_dashboard.png")

            print("\n[SUCCESS] UI Verification Passed!")
        except Exception as e:
            page.screenshot(path="error_ui.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    try:
        verify_risk_ui()
    except Exception as e:
        print(f"\n[FAILURE] {e}")
        exit(1)
