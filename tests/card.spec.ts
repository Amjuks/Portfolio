import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";
import jsQR from "jsqr";
import data from "../portfolio_data.json" with { type: "json" };

test("networking card exports a high-resolution PNG with a working QR and accessible layout", async ({
  page,
  request,
}) => {
  await page.goto("./card/");
  await expect(page).toHaveTitle(
    data.networking_card.name + " — Networking Card",
  );
  await expect(page.locator(".card img")).toHaveAttribute(
    "alt",
    new RegExp(data.networking_card.name),
  );
  await expect(page.locator(".card-contacts a")).toHaveCount(4);
  await expect(page.locator(".card-contacts a").first()).toHaveAttribute(
    "href",
    "mailto:" + data.networking_card.email,
  );
  const download = page.getByRole("link", { name: "Download PNG" });
  const pngUrl = await download.getAttribute("href");
  const response = await request.get(pngUrl!);
  expect(response.ok()).toBeTruthy();
  const png = await response.body();
  const metadata = await sharp(png).metadata();
  expect(metadata).toMatchObject({
    width: 2100,
    height: 1200,
    format: "png",
    density: 300,
  });
  const pixels = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  expect(
    jsQR(
      new Uint8ClampedArray(pixels.data),
      pixels.info.width,
      pixels.info.height,
    )?.data,
  ).toBe(data.networking_card.qr_destination);
  const downloadEvent = page.waitForEvent("download");
  await download.click();
  expect((await downloadEvent).suggestedFilename()).toBe(
    "mohammed-aman-jukaku-card.png",
  );
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/networking-card-${width}.png`,
    });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test("card sharing copies the canonical card URL and offers manual fallback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./card/");
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  await page.getByRole("button", { name: "Copy Link" }).click();
  await expect(page.getByRole("status")).toHaveText("Card link copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    canonical,
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        document.body.dataset.sharedUrl = data.url;
      },
    });
  });
  await page.getByRole("button", { name: "Share Card" }).click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-shared-url",
    canonical!,
  );
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(navigator.clipboard, "writeText", {
      configurable: true,
      value: async () => {
        throw new Error("Clipboard blocked");
      },
    });
  });
  await page.getByRole("button", { name: "Share Card" }).click();
  await expect(page.locator("#card-url")).toBeVisible();
  await expect(page.locator("#card-url")).toHaveValue(canonical!);
  await expect(page.locator("#card-url")).toBeFocused();
});
