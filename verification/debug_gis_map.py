from playwright.sync_api import sync_playwright

def run(playwright):
    print("Launching browser...")
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"ERROR: {err}"))
    page.on("request", lambda req: print(f"REQ: {req.url}") if "/api/gis/layers" in req.url else None)

    print("Navigating to GIS module...")
    page.goto("http://localhost:3000/modules/gis")

    try:
        if page.wait_for_selector("text=Access Key", timeout=3000):
            print("Password Gate detected. Authenticating...")
            page.fill("input[type=password]", "PetroV0")
            page.click("button[type=submit]")
            page.wait_for_timeout(2000)
    except:
        pass

    print("Waiting for Map Canvas...")
    page.wait_for_selector("canvas", timeout=15000)

    print("Map Canvas loaded. Waiting for network requests...")
    # Wait for map data to load
    page.wait_for_timeout(5000)

    # Check if requests fired
    print("Checking if layer data requests were made...")

    # Take screenshot just in case
    page.screenshot(path="verification/gis_debug.png")

    browser.close()
    print("Done.")

with sync_playwright() as playwright:
    run(playwright)
