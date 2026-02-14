from playwright.sync_api import sync_playwright
import time

def run(playwright):
    print("Launching Chromium for Economics Verification...")
    try:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Visit Module
        print("Navigating to /modules/economics...")
        page.goto("http://localhost:3000/modules/economics")

        # Handle PasswordGate
        # Check if we are on the gate by looking for the logo or "Restricted Access" text
        try:
            # Wait a moment to see if redirect happens or content loads
            page.wait_for_timeout(2000)

            if page.get_by_text("restricted access environment").count() > 0:
                print("Password Gate detected. Entering credentials...")
                page.fill("input", "PetroV0")
                page.click("button:has-text('AUTHENTICATE')")
                # Wait for navigation or success
                page.wait_for_url("**/modules/economics", timeout=10000)
                print("Login successful.")
        except Exception as e:
            print(f"Login check skipped or failed: {e}")

        # 2. Check for New Scenario Button
        print("Checking for 'New Scenario' button...")
        page.wait_for_selector("button:has-text('New Scenario')")

        # 3. Create Scenario (Manual Trigger via API mock or UI interaction?)
        # UI uses prompt(), which Playwright can handle
        def handle_dialog(dialog):
            print(f"Dialog message: {dialog.message}")
            dialog.accept("Automated Test Scenario")

        page.on("dialog", handle_dialog)
        page.click("button:has-text('New Scenario')")

        # 4. Wait for Navigation
        print("Waiting for detail page...")
        page.wait_for_url("**/modules/economics/*")
        scenario_id = page.url.split("/")[-1]
        print(f"Created Scenario ID: {scenario_id}")

        # 5. Verify Inputs Tab
        print("Verifying Inputs Tab...")
        page.wait_for_selector("text=General Assumptions")
        page.wait_for_selector("input[value='1000']") # Initial Rate default

        # 6. Run Model
        print("Running Model...")
        page.click("button:has-text('Run Model')")

        # 7. Wait for Results
        print("Waiting for Results...")
        # Poll for specific result element
        page.wait_for_selector("text=NPV (10%)", timeout=10000)

        # Check if NPV value appears (not loading)
        npv = page.locator("text=NPV (10%)").locator("..").locator(".text-2xl").inner_text()
        print(f"Got NPV: {npv}")

        # 8. Check Cashflow Table
        print("Checking Cashflow Table...")
        page.click("button:has-text('Cashflows')")
        page.wait_for_selector("table")
        row_count = page.locator("tbody tr").count()
        print(f"Cashflow Rows: {row_count}")

        browser.close()
        print("SUCCESS: Economics UI Verified")

    except Exception as e:
        print(f"Error: {e}")
        # Take screenshot on failure
        try:
            page.screenshot(path="economics_failure.png")
            print("Saved screenshot to economics_failure.png")
        except:
            pass
        exit(1)

with sync_playwright() as playwright:
    run(playwright)
