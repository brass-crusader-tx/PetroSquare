from playwright.sync_api import sync_playwright
import time

def verify_modules():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        modules = [
            ("markets", "http://localhost:3000/modules/markets"),
            ("gis", "http://localhost:3000/modules/gis"),
            ("economics", "http://localhost:3000/modules/economics"),
            ("production", "http://localhost:3000/modules/production"),
            ("risk", "http://localhost:3000/modules/risk"),
            ("intel", "http://localhost:3000/modules/intel"),
        ]

        print("Waiting for server...")
        # Simple wait loop
        for i in range(30):
            try:
                page.goto("http://localhost:3000", timeout=5000)
                break
            except:
                time.sleep(2)
                print(f"Retrying... {i}")

        for name, url in modules:
            print(f"Verifying {name}...")
            try:
                page.goto(url, timeout=60000)
                # Wait for main content
                page.wait_for_selector("main", timeout=30000)
                # Wait a bit for charts/data
                time.sleep(5)
                page.screenshot(path=f"verification_{name}.png", full_page=True)
                print(f"Captured verification_{name}.png")
            except Exception as e:
                print(f"Error capturing {name}: {e}")

        browser.close()

if __name__ == "__main__":
    verify_modules()
