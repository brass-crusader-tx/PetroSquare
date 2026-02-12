from playwright.sync_api import sync_playwright

def run(playwright):
    print("Launching Chromium...")
    try:
        browser = playwright.chromium.launch(headless=True)
        print("Browser launched.")
        page = browser.new_page()
        print("Page created.")
        page.goto("http://localhost:3000")
        print("Page loaded.")
        print(page.title())
        browser.close()
    except Exception as e:
        print(f"Error: {e}")

with sync_playwright() as playwright:
    run(playwright)
