# Adding your photos, project evidence, and certificates

This is a static site: **copy files into `public/` and reference them in `portfolio_data.json`**. There is no upload dashboard. Commit the files and JSON together when publishing. Paths in the JSON omit `public/` and the `/Portfolio/` prefix; deployment paths are handled automatically.

## 1. Profile picture

Place your photo at **`public/profile/aman.webp`** (JPG or PNG works too). A clear portrait around 800×1000 pixels is suitable. It appears beside your introduction on desktop and below the introduction on mobile, without replacing the typography.

Update the existing `portfolio_assets.profile_photo` object:

```json
{
  "available": true,
  "path_or_url": "profile/aman.webp",
  "alt": "Portrait of Mohammed Aman Jukaku",
  "position": "50% 35%",
  "notes": ""
}
```

`position` controls the crop: increase the second percentage to move the crop lower. Keep `available: false` until the actual file exists. The layout remains intentional without a photo; no empty frame is shown.

## 2. Project screenshots and uploaded videos

Create a folder per project, for example:

```text
public/projects/global-compass/
  cover.webp
  regional-summary.webp
  walkthrough.mp4
  video-poster.webp
```

Set that project's `media` array:

```json
[
  {
    "type": "image",
    "src": "projects/global-compass/cover.webp",
    "alt": "Global Compass globe showing regional news",
    "caption": "The main news exploration interface."
  },
  {
    "type": "image",
    "src": "projects/global-compass/regional-summary.webp",
    "alt": "An AI-generated regional news summary",
    "caption": "Regional summaries alongside source articles."
  },
  {
    "type": "video",
    "src": "projects/global-compass/walkthrough.mp4",
    "poster": "projects/global-compass/video-poster.webp",
    "alt": "Global Compass product walkthrough",
    "caption": "A short walkthrough of the core interaction."
  }
]
```

These are format examples; use descriptions that match your actual files. The first image (or video with a poster) becomes the project cover. All media appears in the project drawer. Images open at full size in another tab; uploaded videos use native playback controls and never autoplay. `type` can be omitted for images. `caption` and `poster` are optional.

For screenshots, export WebP around 1200–1600 pixels wide. The showcase crops to 16:10, while the detail gallery preserves the full image. This lets tall screenshots and hardware photos remain readable. Keep longer videos on YouTube to avoid putting large video files in the repository.

## 3. Live websites, GitHub, Kaggle, YouTube, and other resources

Use the existing `links` object on the project. No screenshots are required:

```json
{
  "github": "https://github.com/Amjuks/LLM-Experimental",
  "live_demo": "",
  "kaggle": "",
  "video": "",
  "paper": "",
  "article": "",
  "other": []
}
```

Paste the full live-site address into `live_demo`, Kaggle address into `kaggle`, and a YouTube watch/share URL into `video`. YouTube appears as a **Watch demo** resource card and opens on YouTube; it does not preload an embedded player. GitHub and Kaggle receive platform-labelled source/notebook cards. Resources appear immediately beneath the project cover in the detail view.

Multiple repositories are supported: set `github` to an array of URLs. For a slide deck, report, dataset, or another resource, use a named entry in `other`:

```json
{ "label": "View presentation", "url": "https://example.com/your-presentation" }
```

The same `media`, `links`, and `presentation` fields work on `project_archive` entries. Their existing single `link` field still works.

### Choose the presentation

Each project has a `presentation` field:

| Value | Result |
| --- | --- |
| `auto` | Use real media first; otherwise show a GitHub/Kaggle or other resource card; use an illustration only when no evidence link exists. |
| `links` | Lead with the repository/notebook/resource card even if screenshots exist. Screenshots remain available in the drawer. |
| `diagram` | Use the technical illustration when there is no uploaded cover. Evidence links still appear in the drawer. |

Leave it as `auto` for most projects. Nothing invents repository stars, notebook scores, or results, and no remote metadata fetch is required.

## 4. Certificate images or PDFs

Place files in **`public/certificates/`**, for example `cs50x.pdf` or `cs50x.webp`. Find the corresponding object under `certifications` and set:

```json
"file": "certificates/cs50x.pdf"
```

That row gains a **View certificate** link, opening the original document in a new tab. Use `verification_url` for the issuer's verification page; this produces a separate **Verify credential** link. Either can exist independently. Certificate rows stay compact, so credentials support rather than dominate your work.

## Preview

Run `npm run dev` and open `http://localhost:4321/Portfolio/`. Changes to the data and assets update the preview. Run `npm run build` before publishing.
