# Managing portfolio content

Edit `portfolio_data.json`. Copy files into `public/` and reference paths without the `public/` prefix. There is no upload dashboard.

## Project details

Both `featured_projects` and `project_archive` accept the same fields: `name`, `slug`, `year`, `status`, `category`, `one_line_purpose`, `description`, `personally_built`, `technologies`, `metrics`, `technical_highlight`, `recognition`, `links`, and `media`.

Older archive entries continue to work: `tags` supplies missing technologies/category, `link` joins the resource links, and a slug is derived when absent. Recognition can be a string or an array. Add genuine details to the JSON; omitted details are not invented.

## Archive order and categories

`portfolio_sections.archive.project_order` controls All. Each entry in `archive.categories` has `id`, `label`, and `project_order`. Category array order controls tabs; each category's project list controls membership and display order. Use exact project names. Multiple selections combine categories in tab order without duplicates.

Featured ordering remains under `portfolio_sections.selected_work.project_order`. Unlisted projects follow in source order. Invalid category IDs, unknown project names, and duplicate references fail the build.

## Project media

The first image or video poster in `media` becomes the cover. Images open in an on-page viewer. Entries look like:

```json
{
  "type": "image",
  "src": "projects/example/screenshot.png",
  "alt": "Description of the real screenshot",
  "caption": "Optional caption",
  "fit": "contain",
  "position": "top left",
  "background": "theme"
}
```

- `fit`: `contain` (default, entire image) or `cover` (fills frame, may crop).
- `position`: center, top, bottom, left, right, any corner such as top left, or percentages such as 50% 20%.
- `background`: theme, light, or dark.
- Enlarged images always show the whole image.

Use `links.github`, `links.kaggle`, `links.live_demo`, `links.video`, `links.paper`, or `links.article`. Named extra resources belong in `links.other`. GitHub supports an array of URLs.

YouTube URLs in `links.video` become click-to-play embedded players. Uploaded videos use `type: "video"`, `src`, `alt`, and optional `poster`. Real images are shown when available; otherwise projects use text summaries. The legacy `presentation` field does not enable invented illustrations.

Builds generate smaller WebP previews for larger PNG/JPEG images while preserving originals for enlargement. Animated GIFs remain unchanged. Source images and JSON are not modified.

## Certificates and profile photo

Upload certificate images to `public/certificates/` and set each `certifications[].file`, for example `certificates/cs50x.png`. Array order controls the list. The viewer shows one full image at a time with selection, previous/next, and enlargement. Issuer verification links remain secondary.

For a PDF, keep `file` pointing to the PDF and add `preview` pointing to a PNG/WebP image. Use `verification_url` for the issuer page.

Profile photos use `portfolio_assets.profile_photo`: set `available: true`, `path_or_url`, `alt`, and `position` such as 50% 35%.

## Recognition

All recognition content is defined directly in the top-level `recognition` object in `portfolio_data.json`. Its `career` and `personal` arrays control the two sections and their card order. Neither section looks up achievements, publications, or interests.

```json
{
  "recognition": {
    "career": [
      {
        "title": "Recognition title",
        "label": "2025 · Competition",
        "description": "Describe the achievement.",
        "link": "",
        "link_label": ""
      }
    ],
    "personal": [
      {
        "title": "Personal highlight",
        "label": "Personal interest",
        "description": "",
        "link": "",
        "link_label": ""
      }
    ]
  }
}
```

Only `title` is required. Blank labels, descriptions, and links are hidden. When a link is supplied without `link_label`, its text defaults to “View details”. Both groups support the same fields. Optional `event`, `result`, `organization`, `project`, `year`, `type`, `platform`, and `date` fields are integrated into the card: dates/type in the eyebrow, event/organization/platform as context, result in the heading or a short emphasis line, and project as a quiet closing line. Values already present in the title or eyebrow are not repeated. Blank or null values are omitted. All values come directly from the recognition entry. If `project` exactly matches a portfolio project name, it opens that project’s detail panel. Unmatched names remain plain text.

The separate research/writing section still uses `research_and_publications`, and the About interest list still uses `personal_interests`. Changing those does not change recognition cards.

## Preview and publish

Run `npm run dev` for live editing. Run `npm run build` then `npm run preview` for production output. Both use http://localhost:4321/Portfolio/. Stop an existing server before launching another.

Publishing instructions: [DEPLOYMENT.md](DEPLOYMENT.md). Local edits must be committed and pushed to master; a successful GitHub Actions deployment updates the public page.

## Networking card

The dedicated page is **/Portfolio/card/** (the /card route under the GitHub Pages base). A link is available in the portfolio's contact area.

Edit only `networking_card` in `portfolio_data.json` to change its name, title, tagline, email, LinkedIn, GitHub, portfolio link, and `qr_destination`. Links use complete HTTPS URLs; displayed addresses automatically omit the protocol and trailing slash.

The visible card contains only name, role, contact links, and QR code. The tagline is retained only for page/search/share metadata, not displayed on the card.

The page preview and downloadable **2100 × 1200 PNG** come from the same renderer and embedded Geist fonts. The PNG contains only the card and includes 300 DPI metadata. Both assets are generated locally during `npm run build`; no external screenshot service or browser is needed. The actual QR encodes `qr_destination`, which can differ from the shareable card URL.

Download PNG saves the image. Share Card shares the canonical /card/ page URL through the device share sheet when supported, or copies it otherwise. Copy Link copies that same URL. If clipboard access is blocked, the page provides a selectable link.

Rebuild and deploy after changing the configuration. Generated files live under `dist/card/` and should not be committed. The download is suitable for digital sharing and print artwork; print shops may request their own bleed or trim margins.
