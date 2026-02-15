import os
from playwright.sync_api import sync_playwright, expect

def verify_brand_assets():
    os.makedirs("/home/jules/verification", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. PasswordGate
        print("Navigating to / ...")
        page.goto("http://localhost:3000")

        # Wait for either PasswordGate or main layout
        try:
            # Look for the specific text in PasswordGate
            expect(page.locator("text=This is a restricted access environment")).to_be_visible(timeout=5000)
            print("PasswordGate visible.")
            page.screenshot(path="/home/jules/verification/password_gate.png")

            # Fill password
            print("Logging in...")
            page.fill("input[type=password]", "PetroV0")
            page.click("button:has-text('Authenticate')")
        except Exception as e:
            print(f"PasswordGate not found or error: {e}")

        # 2. Verify LeftNav (Sidebar)
        print("Waiting for LeftNav...")
        try:
            expect(page.locator("aside")).to_be_visible(timeout=10000)

            # Screenshot Collapsed LeftNav
            page.wait_for_timeout(1000)
            logo = page.locator("aside img[alt='PetroSquare']")
            expect(logo).to_be_visible()

            box = logo.bounding_box()
            if box:
                print(f"Collapsed Logo size: {box['width']}x{box['height']}")

            page.screenshot(path="/home/jules/verification/left_nav_collapsed.png")

            # Expand LeftNav
            print("Expanding LeftNav...")
            toggle_btn = page.locator("button[title='Expand']")
            if toggle_btn.is_visible():
                 toggle_btn.click()
                 page.wait_for_timeout(1000) # Wait for transition
                 page.screenshot(path="/home/jules/verification/left_nav_expanded.png")
            else:
                 print("Expand button not found")
        except Exception as e:
            print(f"LeftNav verification failed: {e}")

        # 3. Verify Footer
        print("Scrolling to footer...")
        try:
            # Ensure we are on a page with footer (main layout)
            # We are likely on / (Control Center or similar default redirect)
            # Let's ensure we are at a place where footer exists.
            # AppLayout has Footer.
            footer = page.locator("footer")
            footer.scroll_into_view_if_needed()
            page.wait_for_timeout(500)
            page.screenshot(path="/home/jules/verification/footer.png")

            footer_logo = footer.locator("img[alt='PetroSquare']")
            if footer_logo.is_visible():
                fbox = footer_logo.bounding_box()
                if fbox:
                    print(f"Footer Logo size: {fbox['width']}x{fbox['height']}")
        except Exception as e:
            print(f"Footer verification failed: {e}")

        # 4. Verify Capabilities Page
        print("Navigating to /capabilities ...")
        try:
            page.goto("http://localhost:3000/capabilities")
            expect(page.locator("text=Platform Capabilities")).to_be_visible(timeout=10000)

            cap_logo = page.locator("nav img[alt='PetroSquare']")
            expect(cap_logo).to_be_visible()
            cap_box = cap_logo.bounding_box()
            if cap_box:
                print(f"Capabilities Logo size: {cap_box['width']}x{cap_box['height']}")

            page.screenshot(path="/home/jules/verification/capabilities.png")
        except Exception as e:
            print(f"Capabilities verification failed: {e}")

        browser.close()

if __name__ == "__main__":
    verify_brand_assets()
