// Optimize displayed raster images in the published HTML. Originals remain available
// for enlargement/download; source files and portfolio_data.json are never modified.
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import data from "../portfolio_data.json" with { type: "json" };
const dist = path.resolve("dist");
const base = (
  process.env.BASE_PATH ?? new URL(data.contact.portfolio).pathname
).replace(/\/$/, "");
const output = path.join(dist, "_previews");
const replacements = new Map();
let before = 0,
  after = 0;
async function htmlFiles(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) files.push(...(await htmlFiles(file)));
    else if (item.name.endsWith(".html")) files.push(file);
  }
  return files;
}
for (const file of await htmlFiles(dist)) {
  let html = await readFile(file, "utf8");
  const urls = [
    ...new Set(
      [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]),
    ),
  ];
  for (const url of urls) {
    if (
      replacements.has(url) ||
      !url.startsWith(base + "/") ||
      !/\.(png|jpe?g)$/i.test(url)
    )
      continue;
    const relative = decodeURIComponent(url.slice(base.length + 1));
    const source = path.resolve(dist, relative);
    if (!source.startsWith(dist + path.sep))
      throw new Error("Image outside build directory");
    const original = await readFile(source);
    if (original.length < 80000) continue;
    const encoded = await sharp(original)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 90, effort: 4 })
      .toBuffer();
    if (encoded.length >= original.length) continue;
    await mkdir(output, { recursive: true });
    const name =
      createHash("sha256").update(encoded).digest("hex").slice(0, 16) + ".webp";
    await writeFile(path.join(output, name), encoded);
    replacements.set(url, base + "/_previews/" + name);
    before += original.length;
    after += encoded.length;
  }
  html = html.replace(
    /(<img\b[^>]*\bsrc=")([^"]+)(")/g,
    (match, prefix, url, suffix) =>
      prefix + (replacements.get(url) || url) + suffix,
  );
  await writeFile(file, html);
}
console.log(
  `Optimized ${replacements.size} displayed images: ${(before / 1048576).toFixed(2)} MB → ${(after / 1048576).toFixed(2)} MB. Full-size originals retained.`,
);
