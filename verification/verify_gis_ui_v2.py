from playwright.sync_api import sync_playwright

def run(playwright):
    print("Launching browser...")
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to GIS module...")
    page.goto("http://localhost:3000/modules/gis")

    # Check for Password Gate
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

    print("Map Canvas loaded.")

    # We can't easily verify Z-index visually in headless without a complex pixel test
    # But we can verify the map renders without error

    print("Taking screenshot...")
    page.screenshot(path="verification/gis_module_v2.png")

    browser.close()
    print("Done.")

with sync_playwright() as playwright:
    run(playwright)
