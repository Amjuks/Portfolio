import portfolio from "../portfolio_data.json" with { type: "json" };
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mediaStyle, youtubeId } from "../src/lib/media";

test("real images enlarge in-page, keep focus, and support image navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./#project-transformer-language-model-from-scratch");
  const images = page.locator(".project-dialog .media-open");
  expect(await images.count()).toBeGreaterThan(1);
  await expect(images.first().locator("img")).toHaveCSS(
    "object-fit",
    portfolio.featured_projects[0].media[0].fit || "contain",
  );
  await expect(page.locator(".diagram,.resource-cover")).toHaveCount(0);
  const url = page.url();
  await images.first().click();
  await expect(page.locator(".media-dialog")).toBeVisible();
  await expect(page.locator(".media-close")).toBeFocused();
  await expect
    .poll(() =>
      page
        .locator(".media-viewer-image img")
        .evaluate((el: HTMLImageElement) => el.naturalWidth),
    )
    .toBeGreaterThan(0);
  const firstSrc = await page
    .locator(".media-viewer-image img")
    .getAttribute("src");
  await page.keyboard.press("ArrowRight");
  expect(
    await page.locator(".media-viewer-image img").getAttribute("src"),
  ).not.toBe(firstSrc);
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".media-viewer-image img")).toHaveAttribute(
    "src",
    firstSrc!,
  );
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document
          .querySelector(".media-dialog")!
          .contains(document.activeElement),
      ),
    ).toBeTruthy();
  }
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.locator(".media-dialog")).not.toBeVisible();
  await expect(page.locator(".project-dialog")).toBeVisible();
  await expect(images.first()).toBeFocused();
  await expect(page).toHaveURL(url);
  await page.setViewportSize({ width: 390, height: 844 });
  await images.first().click();
  await page.screenshot({ path: "test-results/mobile-media-preview.png" });
  expect(
    await page.locator(".media-viewer-image img").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
    }),
  ).toBeTruthy();
});

test("image layout options and supported YouTube URLs", () => {
  const image = { src: "projects/example/image.png", alt: "Example" };
  expect(mediaStyle(image).objectFit).toBe("contain");
  expect(
    mediaStyle({ ...image, fit: "cover", position: "top left" }),
  ).toMatchObject({ objectFit: "cover", objectPosition: "top left" });
  expect(mediaStyle({ ...image, position: "50% 20%" }).objectPosition).toBe(
    "50% 20%",
  );
  expect(youtubeId("https://www.youtube.com/watch?v=M7lc1UVf-VE")).toBe(
    "M7lc1UVf-VE",
  );
  expect(youtubeId("https://youtu.be/M7lc1UVf-VE?t=20")).toBe("M7lc1UVf-VE");
  expect(youtubeId("https://example.com/watch?v=M7lc1UVf-VE")).toBeUndefined();
});

test("project filtering, shareable state, drawer keyboard and history", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(page.locator("html")).toHaveClass("js");
  await expect(page.locator(".archive-row")).toHaveCount(
    portfolio.featured_projects.length + portfolio.project_archive.length,
  );
  await page.locator('[data-filter="Robotics"]').click();
  await expect(page.locator(".archive-row:visible")).toHaveCount(2);
  await expect(page).toHaveURL(/categories=Robotics/);
  await page.locator('[data-filter="Bots"]').click();
  await expect(page.locator(".archive-row:visible")).toHaveCount(4);
  await page.reload();
  await expect(page.locator('[data-filter="Robotics"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator('[data-filter="All"]').click();
  const row = page.locator(".archive-row").first();
  await row.click();
  await expect(page.locator(".project-dialog")).toBeVisible();
  await expect(page.locator("#dialog-title")).toHaveText(
    "Transformer Language Model From Scratch",
  );
  await expect(page.locator(".project-dialog")).toContainText("7.7M");
  await expect(page.locator(".project-dialog .evidence-link")).toHaveAttribute(
    "href",
    "https://github.com/Amjuks/LLM-Experimental",
  );
  await expect(page.locator(".featured-card .evidence-link")).toHaveCount(0);
  await expect(page.locator(".drawer-close")).toBeFocused();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document
          .querySelector(".project-dialog")!
          .contains(document.activeElement),
      ),
    ).toBeTruthy();
  }
  await page.keyboard.press("Escape");
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  await expect(row).toBeFocused();
  await page.goForward();
  await expect(page.locator(".project-dialog")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  expect(errors).toEqual([]);
});

test("themes, active showcase, and desktop accessibility", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: "test-results/desktop-dark.png" });
  await page.locator('[data-featured="2"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-rail="2"]')).toHaveClass(/active/);
  await expect(page.locator("#header")).toHaveClass(/scrolled/);
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.locator(".theme-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.screenshot({ path: "test-results/desktop-light.png" });
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.locator(".archive-row").first().click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("mobile layout, navigation, sheet and scroll restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("./");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: "test-results/mobile-dark.png" });
  await page.locator(".menu-toggle").click();
  await expect(page.locator("#navigation")).toBeVisible();
  await page.locator('#navigation a[href="#archive"]').click();
  await expect(page.locator("#navigation")).not.toBeVisible();
  const row = page.locator(".archive-row").first();
  await row.scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => scrollY);
  await row.click();
  await expect(page.locator(".project-dialog")).toBeVisible();
  expect((await page.locator(".project-dialog").boundingBox())!.width).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  await page.screenshot({ path: "test-results/mobile-drawer.png" });
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  await page.locator(".drawer-close").click();
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  expect(Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThan(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("direct project links and no-JavaScript content", async ({
  browser,
  page,
}) => {
  await page.goto("./#project-global-compass");
  await expect(page.locator(".project-dialog")).toBeVisible();
  await expect(page.locator("#dialog-title")).toContainText("Global Compass");
  await page.keyboard.press("Escape");
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("http://localhost:4321/Portfolio/");
  await expect(staticPage.locator("#project-global-compass")).toBeVisible();
  await expect(staticPage.locator(".case-study")).toHaveCount(
    portfolio.featured_projects.length + portfolio.project_archive.length,
  );
  await context.close();
});

test("responsive widths and normal-motion scroll states", async ({ page }) => {
  await page.goto("./");
  for (const width of [320, 560, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('[data-featured="3"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-rail="3"]')).toHaveClass(/active/);
  await page.screenshot({ path: "test-results/selected-work.png" });
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(
    page.locator('#navigation a[href="#experience"]'),
  ).toHaveAttribute("aria-current", "location");
  expect(
    await page
      .locator(".timeline")
      .evaluate((el) =>
        Number(
          (el as HTMLElement).style.getPropertyValue("--timeline-progress"),
        ),
      ),
  ).toBeGreaterThan(0);
  await page.locator(".archive-row").nth(2).focus();
  await expect(page.locator("#preview-title")).toContainText(
    "AI Smart Surveillance Robot",
  );
});

test("restored archive ordering, certificate previews and recognition sections", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator('[data-filter]:not([data-filter="All"])')).toHaveText(
    portfolio.portfolio_sections.archive.categories.map((category) => category.label),
  );
  await expect(page.locator("#recognition .award")).toHaveCount(3);
  await expect(page.locator("#recognition .awards")).not.toContainText("Chess");
  await expect(page.locator("#personal .award")).toHaveCount(3);
  await page.locator('[data-certificate-index="2"]').click();
  await expect(page.locator(".certificate-panel:visible")).toContainText(
    portfolio.certifications[2].credential,
  );
  await page.locator(".certificate-next").click();
  await expect(page.locator(".certificate-panel:visible")).toContainText(
    portfolio.certifications[3].credential,
  );
  await page.locator(".certificate-panel:visible .media-open").click();
  await expect(page.locator(".media-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  for (const category of portfolio.portfolio_sections.archive.categories) {
    await page.locator('[data-filter="All"]').click();
    await page.locator(`[data-filter="${category.id}"]`).click();
    expect(
      await page.locator(".archive-row:visible h3").allTextContents(),
    ).toEqual(category.project_order);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
