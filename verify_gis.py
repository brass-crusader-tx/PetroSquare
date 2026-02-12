from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()

    # Listen for console logs
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))
    page.on("requestfailed", lambda request: print(f"Request failed: {request.url} {request.failure}"))

    try:
        print("Navigating to GIS module...")
        response = page.goto("http://localhost:3000/modules/gis")
        print(f"Page load status: {response.status}")

        # Wait for the map or key elements to load
        print("Waiting for page load...")
        page.wait_for_selector("text=GIS & Asset Intelligence", timeout=10000)

        # Check for key components
        print("Checking for Filter Panel...")
        page.wait_for_selector("text=Navigation")

        # Wait a bit longer for data
        page.wait_for_timeout(5000)

        # Check for Assets count (mock data loaded)
        print("Checking for Assets count...")
        # Check if assets count is visible
        assets_text = page.locator("text=Assets:").text_content()
        print(f"Assets text found: {assets_text}")

        if "Assets: 0" in assets_text:
             print("Assets are 0. Fetch might have failed.")

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="gis_module_debug.png")
        print("Screenshot saved to gis_module_debug.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="gis_module_error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
