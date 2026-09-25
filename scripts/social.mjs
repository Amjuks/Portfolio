import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
const data = JSON.parse(
  await readFile(new URL("../portfolio_data.json", import.meta.url), "utf8"),
);
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.setContent(
  `<html><body style="margin:0;background:#090a0d;color:#f1f2f6;font-family:Arial,sans-serif"><div style="position:absolute;inset:0;background:radial-gradient(ellipse at 85% 20%,#29253f,transparent 65%);padding:80px"><div style="color:#aaa5eb;font-size:16px;letter-spacing:3px;text-transform:uppercase">${esc(data.profile.professional_title)}</div><h1 style="font-size:86px;font-weight:500;letter-spacing:-5px;line-height:1.05;margin:55px 0 30px;max-width:850px">${esc(data.profile.name)}<span style="color:#9996ff">.</span></h1><p style="font-size:25px;color:#a0a4b1;line-height:1.6;max-width:830px">${esc(data.profile.headline)}</p><div style="margin-top:50px;font-size:15px;color:#9996ff">${esc(data.contact.portfolio.replace("https://", ""))} ↗</div></div></body></html>`,
);
await page.screenshot({
  path: new URL("../public/social.png", import.meta.url).pathname.replace(
    /^\/([A-Za-z]:)/,
    "$1",
  ),
});
await browser.close();
