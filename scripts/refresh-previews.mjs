// Read-only capture of public project sources. Never runs during a production build.
import { chromium } from "@playwright/test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataPath = path.join(root, "portfolio_data.json");
const data = JSON.parse(await readFile(dataPath, "utf8"));
const browser = await chromium.launch();
const captures = [];
const onlyMissing = process.argv.includes("--missing");
async function fetchSource(url) {
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok || response.status === 404) return response;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return response;
}
try {
  for (const project of [...data.featured_projects, ...data.project_archive]) {
    if (!project.preview_sources?.length) continue;
    const slug =
      project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const dir = path.join(root, "public", "projects", slug);
    await mkdir(dir, { recursive: true });
    for (const [index, source] of project.preview_sources.entries()) {
      if (onlyMissing && project.media.some((m) => m.source_url === source.url))
        continue;
      let page;
      try {
        let filename;
        if (source.kind === "github") {
          const response = await fetchSource(source.url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const html = await response.text();
          const image = html.match(
            /<meta property="og:image" content="([^"]+)"/,
          )?.[1];
          if (!image?.startsWith("https://opengraph.githubassets.com/"))
            throw new Error("No repository preview supplied by GitHub");
          let result = await fetchSource(image);
          if(!result.ok || !result.headers.get('content-type')?.startsWith('image/')) result=await fetchSource(`https://opengraph.githubassets.com/portfolio${new URL(source.url).pathname}`);
          if (
            !result.ok ||
            !result.headers.get("content-type")?.startsWith("image/")
          )
            throw new Error("Preview image unavailable");
          filename = `github-${index + 1}.png`;
          await writeFile(
            path.join(dir, filename),
            Buffer.from(await result.arrayBuffer()),
          );
        } else if (source.kind === "image") {
          const result = await fetchSource(source.url);
          if (
            !result.ok ||
            !result.headers.get("content-type")?.startsWith("image/")
          )
            throw new Error("Source image unavailable");
          filename = `source-${index + 1}${new URL(source.url).pathname.match(/\.[a-z]+$/i)?.[0] || ".png"}`;
          await writeFile(
            path.join(dir, filename),
            Buffer.from(await result.arrayBuffer()),
          );
        } else {
          page = await browser.newPage({
            viewport: { width: 1440, height: 1000 },
            deviceScaleFactor: 1,
            colorScheme: "light",
          });
          const response = await page.goto(source.url, {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          });
          if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
          if (source.kind === "kaggle") {
            await page
              .getByRole("heading", { name: "Skin Cancer 10k v2", exact: true })
              .waitFor({ timeout: 30000 });
            const accept = page.getByRole("button", { name: "OK, Got it." });
            if (await accept.count()) await accept.click();
            await page.waitForFunction(() =>
              Array.from(document.querySelectorAll("iframe")).some((f) =>
                f.src.includes("kaggleusercontent.com"),
              ),
            );
            await page.waitForTimeout(3000);
          } else {
            const skip = page.getByRole("button", {
              name: "Skip briefing",
              exact: true,
            });
            if (await skip.count()) await skip.click();
            await page.waitForTimeout(5000);
          }
          if(source.dismiss_text){
            const dismiss=page.getByText(source.dismiss_text,{exact:true});
            try {await dismiss.waitFor({state:'visible',timeout:8000});await dismiss.click();await page.waitForTimeout(800);}catch { /* Some sites remember a previously dismissed introduction. */ }
          }
          const title = await page.title();
          if (/not found|access denied|just a moment|captcha/i.test(title))
            throw new Error(`Not a project preview: ${title}`);
          filename = `${source.kind}-${index + 1}.jpg`;
          await page.screenshot({
            path: path.join(dir, filename),
            type: "jpeg",
            quality: 88,
          });
        }
        const entry = {
          type: "image",
          src: `projects/${slug}/${filename}`,
          alt: source.alt,
          caption: source.caption,
          source_url: source.url,
          source_label: source.label,
          captured_at: new Date().toISOString().slice(0, 10),
          origin: "source-preview",
          fit: "contain",
          position: "center",
          background: ["github", "kaggle"].includes(source.kind)
            ? "light"
            : "theme",
        };
        captures.push({ slug, entry });
        console.log(`Saved ${slug}: ${source.label}`);
      } catch (error) {
        console.warn(`Skipped ${slug}: ${error.message}`);
      } finally {
        await page?.close();
      }
    }
  }
} finally {
  await browser.close();
}
// Re-read before saving so edits made while captures ran are preserved.
const latest = JSON.parse(await readFile(dataPath, "utf8"));
for (const project of [
  ...latest.featured_projects,
  ...latest.project_archive,
]) {
  const slug =
    project.slug || project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const entries = captures.filter((c) => c.slug === slug).map((c) => c.entry);
  const replacements = new Map(entries.map((e) => [e.source_url, e]));
  project.media = (project.media || []).map((m) => {
    const entry =
      m.origin === "source-preview" && replacements.get(m.source_url);
    if (!entry) return m;
    replacements.delete(m.source_url);
    return {
      ...m,
      ...entry,
      fit: m.fit || entry.fit,
      position: m.position || entry.position,
      background: m.background || entry.background,
    };
  });
  project.media.push(...replacements.values());
}
await writeFile(dataPath, JSON.stringify(latest, null, 2) + "\n");
console.log(
  `${captures.length} real previews saved. Review them before publishing.`,
);
