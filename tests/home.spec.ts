import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("Cameron Tacklind - Complete Stack Roboticist");
  });

  test("displays name heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Cameron Tacklind");
  });

  test("displays tagline", async ({ page }) => {
    await expect(page.locator(".tagline")).toContainText("Complete");
    await expect(page.locator(".tagline")).toContainText("Stack");
    await expect(page.locator(".tagline")).toContainText("Roboticist");
  });

  test("has social links with correct attributes", async ({ page }) => {
    const githubLink = page.getByLabel("GitHub Profile");
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("target", "_blank");
    await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const linkedinLink = page.getByLabel("LinkedIn Profile");
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute("target", "_blank");

    const emailLink = page.getByLabel("Email me");
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute("href", "mailto:cameron@tacklind.com");
  });

  test("has proper meta description", async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      "content",
      "Cameron Tacklind is a complete stack roboticist — from BLDC to React and everything in between."
    );
  });

  test("has Open Graph tags", async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Cameron Tacklind - Complete Stack Roboticist"
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website"
    );
  });
});

test.describe("Accessibility", () => {
  test("social links navigation has proper aria-label", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Social links" });
    await expect(nav).toBeVisible();
  });
});
