from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1280, "height": 720})
    page = context.new_page()

    # Listen for console logs
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))

    try:
        print("Navigating to GIS module...")
        page.goto("http://localhost:3000/modules/gis")

        print("Waiting for assets to load...")
        page.wait_for_selector("text=Assets: 30", timeout=10000)

        print("Clicking map canvas to select an asset...")
        # Click in the middle of the canvas
        page.click("canvas")

        print("Waiting for Asset Details panel...")
        # AssetDetails has a close button "✕" or "View Full Report" button
        page.wait_for_selector("text=View Full Report", timeout=5000)

        # Check for asset type text (WELL or FACILITY)
        content = page.content()
        if "WELL" in content or "FACILITY" in content:
            print("Asset details visible.")

        print("Taking final verification screenshot...")
        page.screenshot(path="gis_module_final.png")
        print("Screenshot saved.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="gis_module_error_final.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
