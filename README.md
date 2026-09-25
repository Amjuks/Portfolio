# Mohammed Aman Jukaku — portfolio

A static Astro + TypeScript portfolio built from `portfolio_data.json`, following the v2 brief. No client framework, animation library, external font requests, or scroll hijacking. Includes all seven selected projects, 18 archive entries, experience, capabilities, recognition, credentials, education, writing, and contact.

## Run locally

```sh
npm install
npm run dev
```

Open **http://localhost:4321/Portfolio/**. The default base and canonical origin come from `contact.portfolio` in the JSON. Use a current Node 22 release (22.19 or newer). A project-local Node 22 dependency is included so npm scripts also work on the older Node installation in this workspace. On a fresh installation with old Node, update Node first to ensure npm installs native optional dependencies correctly.

```sh
npm run build
npm run preview
```

`build` type-checks all Astro and TypeScript files before producing `dist/`.

## Content

**`portfolio_data.json` is the single source of profile content.** `src/lib/data.ts` normalizes it; UI labels and section headings live in components. Empty evidence links, dates, and optional media are handled without fabricated claims. Internship descriptions use the supplied public-safe text; confidential notes and internal data-maintenance fields are not published.

- Edit profile, links, skills, employment, credentials, or education in the corresponding JSON fields.
- Set `profile.short_bio` for a custom About paragraph. Until supplied, About uses existing headline and career interests.
- Counts derive from the data. Unknown project years display an em dash.
- Add a résumé under `public/`, then set `portfolio_assets.resume.path`, e.g. `resume.pdf`. The link stays hidden while the path is empty.
- Contact availability follows `opportunities.preferred_opportunity_description`.

### Add a project

Add a detailed project to `featured_projects`, following an existing entry:

| Field | Meaning |
| --- | --- |
| `name`, `slug` | Display title and unique, stable URL identifier |
| `year` | Number or `null` |
| `status` | `completed`, `deployed`, or `production` |
| `category` | Slash-separated descriptive categories |
| `one_line_purpose`, `description` | Short summary and full build description |
| `personally_built` | Array of actual contributions |
| `technologies` | Array of technology names |
| `metrics` | Key/value object with documented results; can be empty |
| `technical_highlight` | Engineering decisions or significant implementation detail |
| `recognition` | Optional array of recognition strings |
| `links` | `github`, `live_demo`, `video`, `article`, `kaggle`, `paper`, `other`; empty values omitted; GitHub supports multiple URLs |
| `media` | Array of `{ "src": "projects/example/cover.webp", "alt": "Description" }` |
| `featured` | Whether to show in the selected-work stage |

Order selected projects using `portfolio_sections.selected_work.project_order`. Unlisted detailed projects appear after the ordered entries. Add smaller projects to `project_archive` using `name`, `description`, `link`, `year`, `tags`, and optional `recognition`.

### Media

See **[MEDIA_GUIDE.md](MEDIA_GUIDE.md)** for the complete profile-photo, screenshot, video, repository-card, and certificate workflow, including copyable JSON examples.

Place assets under `public/projects/<slug>/`. Provide descriptive alt text. The first image or video poster becomes the cover; the full gallery appears in the drawer with full-size image links and native video playback. Without screenshots, available GitHub/Kaggle links produce repository/notebook covers. Technical illustrations are a final fallback or an explicit choice via `presentation: "diagram"`. All local asset URLs honor the deployment base.

The social image is generated from the JSON using `npm run social`; it is committed as `public/social.png`. Regenerate it after changing the profile name or title.

### Filtering and project URLs

Categories are inferred from project category, technologies, and archive tags in `classify()` in `src/lib/data.ts`. Edit that mapping to extend the filters. Multiple selected categories use **OR** matching. The URL query preserves selected filters (`?categories=AI,Robotics`). Project drawers use `#project-<slug>`, support direct links and browser history, restore focus and scroll position, and use a native modal dialog for focus containment. Without JavaScript, full case studies remain accessible as normal anchor targets.

## Design and behavior

- `src/styles/global.css`: centralized color/material tokens, responsive layouts, typography, and reduced-motion rules.
- `src/components/ProjectVisual.astro`: deterministic, lightweight technical illustrations and real-media support.
- `src/scripts/site.ts`: theme persistence, radial theme transition, native scrolling, active navigation, sticky project state, archive preview, filters, and modal management.
- Motion runs through one requestAnimationFrame scroll handler; offscreen project transforms are skipped. Mobile uses ordinary cards and a fullscreen sheet.
- System theme is respected on first visit; manual selection persists without a theme flash. Keyboard focus is visible, all project content has a click/keyboard route, and reduced motion disables spatial effects.

## GitHub Pages

Push to `main` and set **Settings → Pages → Source → GitHub Actions**. `.github/workflows/deploy.yml` builds and deploys the static site. The Pages action supplies `SITE_URL` and `BASE_PATH`, supporting both a user site and repository site. No deployment has been performed from this workspace.

Override locally in PowerShell if needed:

```powershell
$env:SITE_URL = 'https://example.github.io'
$env:BASE_PATH = '/portfolio'
npm run build
```

For a root/custom-domain deployment, use `BASE_PATH=/` and the appropriate origin. Canonical URLs, favicon, scripts, fonts, social metadata, sitemap, and internal media paths follow this configuration. `robots.txt` is generated in the deployment directory; for repository sites, only a robots file at the domain root controls crawler directives.

## Verification

```sh
npx playwright install chromium
npm test
```

Browser tests cover multiple archive filters, history, deep links, keyboard focus containment, Escape, scroll restoration, mobile layout, theme persistence, selected-project changes, no-JavaScript content, and axe accessibility scans. Screenshots are written to ignored `test-results/`. Tests use the default `/Portfolio/` base.
