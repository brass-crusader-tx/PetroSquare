try:
    from playwright.sync_api import sync_playwright
    print("Playwright imported successfully")
except Exception as e:
    print(f"Error: {e}")
