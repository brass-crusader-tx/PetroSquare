import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture console messages
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        # 1. Navigate to Home
        print("Navigating to Home...")
        try:
            await page.goto("http://localhost:3000", timeout=60000)
            print("Loaded Home.")
        except Exception as e:
            print(f"Failed to load home: {e}")
            await browser.close()
            return

        # Check for Password Gate
        password_input = page.locator("input[type='password']")
        if await password_input.count() > 0:
            print("Password Gate detected. Entering password...")
            await password_input.fill("PetroV0")
            await page.keyboard.press("Enter")
            await page.wait_for_timeout(2000) # Wait for unlock animation/transition
            print("Password submitted.")
        else:
            print("No Password Gate detected (already unlocked?).")

        # 2. Check TopHeader Badge
        print("Checking for Cmd+K badge...")
        badge = page.locator("kbd:has-text('K')")
        if await badge.count() > 0:
            if await badge.is_visible():
                print("SUCCESS: Cmd+K badge is visible.")
            else:
                print("WARN: Cmd+K badge found but hidden (maybe small screen?).")
        else:
            print("ERROR: Cmd+K badge NOT found.")

        # Test Cmd+K Functionality
        search_input = page.locator("input[placeholder='Search or type command...']")
        if await search_input.count() > 0:
            await page.keyboard.press("Meta+K")
            is_focused = await search_input.evaluate("el => el === document.activeElement")
            if is_focused:
                print("SUCCESS: Cmd+K focused the search input.")
            else:
                print("WARN: Cmd+K failed to focus.")
        else:
            print("ERROR: Search input not found.")


        # 3. Test InsightPanel (Visuals)
        print("Navigating to Asset Detail (well-01)...")
        await page.goto("http://localhost:3000/modules/production/asset/well-01", timeout=60000)
        await page.wait_for_timeout(2000)

        # Switch to Insights Tab
        print("Switching to Insights tab...")
        tabs = page.locator("button", has_text="Insights")
        if await tabs.count() > 0:
            await tabs.click()
            print("Clicked Insights tab.")
            await page.wait_for_timeout(1000)

            insight_input = page.locator("input[placeholder='Ask about production...']")
            if await insight_input.count() > 0:
                print("Found Insight Panel input.")
                await insight_input.fill("Test Prompt")
                await page.keyboard.press("Enter")
                print("Sent prompt.")
                await page.wait_for_timeout(2000)

                # Check for Transparency Block (Data Sources)
                sources_label = page.locator("span:has-text('Data Sources:')")
                if await sources_label.count() > 0:
                    print("SUCCESS: Transparency Block (Data Sources) visible.")
                else:
                    print("ERROR: Transparency Block not found.")

                refine_btn = page.locator("button:has-text('Refine Prompt')")
                if await refine_btn.count() > 0:
                    print("SUCCESS: Refine Prompt button found.")
                    await page.screenshot(path="ui_enhancements_success.png")
                else:
                    print("ERROR: Refine Prompt button not found.")
                    await page.screenshot(path="ui_enhancements_fail.png")
            else:
                print("ERROR: Insight Panel input not found after switching tab.")
        else:
            print("ERROR: Insights tab not found.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
