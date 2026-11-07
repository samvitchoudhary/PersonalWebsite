import { test, expect, type Page } from "@playwright/test";

const RESUME_SNIPPETS = [
  "Samvit Choudhary",
  "University of Maryland",
  "Mondelez International",
];

async function expectResumeText(page: Page) {
  const viewer = page.getByTestId("resume-viewer");
  await expect(viewer).toBeVisible({ timeout: 20000 });
  const text = (await viewer.innerText()).replace(/\s+/g, " ");
  for (const snippet of RESUME_SNIPPETS) {
    expect(text, `resume text should include "${snippet}"`).toContain(snippet);
  }
  await expect(page.getByText("refused to connect")).toHaveCount(0);
  await expect(page.locator("iframe")).toHaveCount(0);

  const ink = await viewer.locator("canvas").first().evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext("2d");
    if (!context) return 0;
    const { width, height } = canvas as HTMLCanvasElement;
    const { data } = context.getImageData(0, 0, width, height);
    let dark = 0;
    for (let i = 0; i < data.length; i += 16) {
      if (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245) dark += 1;
    }
    return dark;
  });
  expect(ink, "resume canvas should contain painted text, not a blank page").toBeGreaterThan(500);
}

async function openResumeFromKitchen(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const chalkboard = page.locator('polygon[aria-label="Chalkboard — Resume"]');
  await expect(chalkboard).toBeVisible();
  await chalkboard.hover();
  await page.waitForTimeout(300);
  await chalkboard.click();
  await page.waitForURL("**/resume");
}

test.describe("In-page resume", () => {
  test("chalkboard click renders the resume text on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openResumeFromKitchen(page);
    await expectResumeText(page);

    await expect(page.getByRole("link", { name: "Open resume" }).first()).toHaveAttribute(
      "href",
      "/SamvitChoudhary_Resume.pdf",
    );
    await expect(page.getByRole("link", { name: "Download resume" }).first()).toHaveAttribute(
      "download",
      "SamvitChoudhary_Resume.pdf",
    );

    await page.screenshot({
      path: "tests/screenshots/resume-desktop.png",
      fullPage: true,
    });
  });

  test("resume text renders on a phone-sized viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resume");
    await expectResumeText(page);
    await page.screenshot({
      path: "tests/screenshots/resume-mobile.png",
      fullPage: true,
    });
  });

  test("a failed embed shows open and download links", async ({ page }) => {
    await page.route("**/SamvitChoudhary_Resume.pdf", (route) => route.abort());
    await page.goto("/resume");
    const fallback = page.getByTestId("resume-fallback");
    await expect(fallback).toBeVisible({ timeout: 15000 });
    await expect(fallback.getByRole("link", { name: "Open resume" })).toHaveAttribute(
      "href",
      "/SamvitChoudhary_Resume.pdf",
    );
    await expect(fallback.getByRole("link", { name: "Download resume" })).toHaveAttribute(
      "href",
      "/SamvitChoudhary_Resume.pdf",
    );
    await expect(page.getByRole("link", { name: "Open resume" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "Download resume" }).last()).toBeVisible();
  });

  test("framing safeguards stay on HTML responses", async ({ page }) => {
    const response = await page.goto("/resume");
    const headers = response?.headers() ?? {};
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(headers["content-security-policy"]).toContain("frame-src 'self'");
    expect(headers["x-frame-options"]?.toUpperCase()).toBe("SAMEORIGIN");
  });
});
