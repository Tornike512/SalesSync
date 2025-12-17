import { expect, test } from "@playwright/test";

test("should load the home page with filter bar", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("/");
  // The new page should contain the filter bar with "Filter by Store" heading
  await expect(page.locator("h2")).toContainText("Filter by Store");
});
