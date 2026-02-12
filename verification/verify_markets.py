from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Wait for server to be up
        for i in range(30):
            try:
                page.goto("http://localhost:3000", timeout=3000)
                break
            except:
                time.sleep(1)

        print("Navigating to Markets...")
        page.goto("http://localhost:3000/modules/markets")

        # Wait for data to load (since we have client-side fetching)
        # We look for "Global Benchmarks" text
        page.wait_for_selector("text=Global Benchmarks", timeout=10000)

        # Wait a bit more for other panels
        time.sleep(2)

        print("Taking screenshot...")
        page.screenshot(path="verification/markets.png", full_page=True)

        # Also open the Inspector
        print("Opening Inspector...")
        page.locator("button[title='Open System Inspector']").click()
        time.sleep(1)
        page.screenshot(path="verification/inspector.png")

        browser.close()

if __name__ == "__main__":
    run()
