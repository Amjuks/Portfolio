# Portfolio Website — Developer Implementation Brief v2

## 1. Objective

Build a production-quality, single-page personal portfolio for an engineering student whose strongest profile signals are **internships, serious technical projects, research/experimentation, and breadth of engineering work**.

The existing prototype/design direction is approved: sleek, minimal, premium, modern, dark/light, editorial/technical, restrained use of color, strong typography, and generous spacing.

The next implementation must preserve that visual language but make the page feel **alive and immersive while scrolling**. The current experience feels too static: the visual state does not meaningfully evolve as the visitor progresses through the page. Fix that.

The final result should feel closer to a premium product/engineering website than a typical student portfolio.

This is not a redesign into a flashy WebGL experience. The goal is **controlled motion, scroll choreography, responsiveness, and interaction** without compromising readability, accessibility, performance, or recruiter usability.

---

## 2. First Task: Understand the Existing Codebase

Before making changes:

1. Read the entire existing prototype/codebase.
2. Identify the current design tokens, layout rules, theme implementation, components, and responsive behavior.
3. Preserve visual decisions that already work well.
4. Refactor only where needed to support the complete architecture.
5. Do not rebuild everything from scratch unless the existing structure genuinely prevents clean implementation.

Create a short internal implementation map before coding:

- existing components to keep
- components to refactor
- new components needed
- animation/state architecture
- content/data architecture
- responsive adaptations
- GitHub Pages deployment considerations

Do not stop after producing the implementation map. Proceed with the implementation.

---

# 3. Product Goal

A visitor should understand within roughly 5–10 seconds:

> Engineering student. AI/software focused. Has substantial real-world experience. Builds serious things across multiple technical areas.

The page should then progressively reveal depth.

A recruiter should be able to scan the entire portfolio quickly.

An engineer, founder, researcher, or technical hiring manager should be able to spend several minutes exploring individual projects and understand what was actually built.

The portfolio therefore needs **two simultaneous depths**:

- fast scan
- deep exploration

Do not make every project equally prominent.

---

# 4. Overall Technology Direction

Use the existing Astro architecture unless there is a strong technical reason not to.

Preferred stack:

- Astro
- TypeScript
- static output
- semantic HTML
- CSS custom properties for the design system
- YAML or equivalent structured content files for portfolio data
- minimal client-side JavaScript
- GSAP + ScrollTrigger only where scroll choreography materially benefits from it
- CSS transitions/animations for ordinary hover/focus/micro-interactions

Do **not** convert the entire website into a client-rendered React application.

If a framework island is genuinely useful for a complicated interactive component, keep it isolated.

The final build must remain suitable for GitHub Pages.

---

# 5. Core Design Language

Preserve the prototype's visual direction:

- modern editorial-tech aesthetic
- almost monochrome palette
- one restrained indigo/purple accent
- large confident typography
- thin borders
- subtle surface separation
- soft radial ambient lighting
- clean grid
- generous whitespace
- excellent light and dark themes
- subtle mono typography for metadata
- no visual clutter

The site should feel precise rather than playful.

Avoid:

- neon hacker aesthetics
- giant gradients everywhere
- animated terminal gimmicks
- cursor trails
- floating tech-logo clouds
- skill percentage bars
- huge 3D/WebGL intro scenes
- scroll hijacking
- indiscriminate glassmorphism; use the deliberate material hierarchy defined in the Premium Art-Direction Addendum
- giant headshots
- generic developer template appearance
- arbitrary bento widgets just because bento layouts are trendy

---


# PREMIUM ART-DIRECTION ADDENDUM — REQUIRED, NOT OPTIONAL

This section upgrades the brief from “clean modern portfolio” to a deliberately **premium, tactile, glossy, spatial interface**. The developer must treat this as core product direction, not optional polish.

The visual goal is **controlled liquid-glass / optical-surface design**, combined with editorial restraint. It should feel like a high-end operating-system/product interface translated into a technical portfolio—not like generic glassmorphism.

The site must look exceptional both in screenshots and in motion. Static states need depth; motion needs continuity; hover/focus states need material feedback.

## A. Material hierarchy

Use at least four visual material levels:

1. **Base canvas** — soft neutral background with ambient illumination and faint grain.
2. **Quiet surface** — almost opaque sections/cards used for long-form readability.
3. **Glass surface** — translucent floating surfaces used selectively for navbar, overlays, featured metadata, filter bars, and key controls.
4. **Optical/highlight surface** — special hero/CTA/project-detail accents with layered highlights and slight specular response.

Do not make every section transparent. Glass only feels premium when contrasted against calmer matte areas.

## B. Liquid-glass recipe

For important glass surfaces, layer effects instead of relying on a single `backdrop-filter`:

- semi-transparent base fill
- background blur and mild saturation
- 1px optical border with brighter top/left edge
- weaker darker bottom/right edge
- internal highlight gradient
- very soft outer shadow
- subtle inset shadow
- optional noise/grain mask
- faint color tint derived from the accent

Example direction, tune values by eye rather than copying blindly:

```css
.glass {
  background:
    linear-gradient(180deg, rgba(255,255,255,.11), rgba(255,255,255,.045)),
    rgba(18,20,26,.42);
  border: 1px solid rgba(255,255,255,.13);
  box-shadow:
    0 18px 55px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.16),
    inset 0 -1px 0 rgba(255,255,255,.035);
  backdrop-filter: blur(24px) saturate(135%);
}
```

Light mode must have its own optical treatment rather than reusing dark-mode alpha values. In light mode, glass should resemble frosted mineral/ceramic glass, not washed-out white rectangles.

## C. Specular / glossy response

Important interactive surfaces should react subtly to pointer position.

Examples:

- featured project cards: a broad, low-opacity highlight moves across the card by a few percent
- navbar: highlight catches near the pointer but is extremely restrained
- primary CTA: tiny sheen sweep or edge-light shift on hover
- project drawer: top edge catches ambient light

Implementation preference:

- update CSS variables such as `--mx` / `--my` from pointer position
- render highlight with pseudo-elements / radial gradients
- do not repaint huge shadows every animation frame
- disable or simplify on touch and reduced-motion devices

Do **not** create a chrome/metallic mirror effect. The material should remain sophisticated and readable.

## D. Optical borders

Borders should not all be flat gray. Use a hierarchy:

- ordinary separator: neutral 1px
- card edge: low-contrast edge
- glass edge: gradient/optical edge
- hover edge: slightly brighter accent-weighted reflection

For premium glass cards, a gradient border can be composed using pseudo-elements/masks. Avoid obvious rainbow outlines.

## E. Ambient lighting system

The global background layer should feel like a living lighting environment.

Use 2–3 very large blurred radial lights and allow section state to modify:

```css
--light-1-x
--light-1-y
--light-1-opacity
--light-2-x
--light-2-y
--light-2-opacity
--ambient-hue
```

Requirements:

- transitions happen over roughly 700–1400ms, slower than component UI motion
- movement distance is moderate; no blobs visibly chasing the scroll
- featured projects may provide a per-project ambient tint
- dark theme can be more luminous
- light theme should use soft reflected color rather than bright glowing blobs

This ambient layer is one of the main ways the page should change while scrolling.

## F. Depth and spatial rhythm

Not every section should sit on the same plane.

Create a repeating depth rhythm across the page:

- open/full-canvas hero
- floating metric/glass strip
- immersive contained featured-work stage
- flatter editorial experience section
- elevated interactive archive
- quiet supporting sections
- visually richer contact finale

The user should subconsciously feel the page move between open space, floating surfaces, and grounded editorial content.

## G. Section transitions

Avoid the impression of stacked rectangles separated only by whitespace. Major transitions should have one or more of:

- background lighting migration
- subtle border/rule reveal
- surface elevation shift
- clipped gradient mask
- sticky handoff
- typography scale transition
- media entering before text

Each section must have a reason for its transition style. Do not repeat the exact same fade-up animation everywhere.

## H. Scroll choreography quality bar

Scrolling must continuously produce small state changes without exhausting the user.

At any typical desktop viewport during the first 60–70% of the page, at least one of the following should usually be happening:

- ambient light state is interpolating
- active featured project is changing
- sticky copy is updating
- media mask/parallax is progressing
- timeline line is drawing
- archive preview is changing
- active navigation is updating
- a section heading/rule is revealing

This does **not** mean constant obvious animation. It means the page should never feel like a sequence of inert screenshots.

## I. Hero premium treatment

The hero needs one signature visual motif. Pick one coherent approach and execute it exceptionally well; do not stack all ideas together. Recommended direction:

- large typographic hero
- behind it, a translucent optical plane / glass lens spanning part of the canvas
- lens subtly refracts/tints the background grid/light
- pointer movement tilts or shifts the optical highlight by only a tiny amount
- as the hero scrolls away, the plane compresses/fades and visually hands off into the metrics strip

The hero must still remain readable and load instantly. No Three.js requirement. Prefer CSS/SVG and composited transforms.

## J. Featured-work “stage”

Treat Featured Work as a designed stage, not just a sticky list.

Required premium details:

- sticky information area sits on a subdued translucent panel or floating rail
- active project media gets stronger light/contrast
- inactive project media remains visible but visually recedes
- the section's ambient accent changes with the active project
- project index should transition with a vertical/clip motion rather than instantly replacing text
- title/summary transitions must crossfade/mask cleanly, avoiding layout jumps
- card surfaces can carry a very faint pointer-responsive specular highlight
- transition between projects should feel continuous, not like DOM content blinking

## K. Archive as a “precision instrument”

The archive should look more like a premium data interface than a plain table.

Include:

- hairline separators
- high-quality hover/focus state
- one shared preview surface
- preview surface may use glass framing and subtle depth
- row text can shift 2–4px horizontally on hover
- relevant category/filter receives a quiet accent glow/underline
- preview crossfades with a tiny scale/depth transition
- no huge hover cards exploding over the list

## L. Buttons and links

Primary CTA should feel tactile.

Use:

- optical edge
- inner highlight
- mild translucent/solid hybrid fill
- 1–2px press movement
- arrow/chevron movement
- strong focus-visible ring

Secondary links should remain simple text links to preserve hierarchy.

Avoid pill-shaping every control. The rounded language should be selective.

## M. Theme transition as a feature

Dark/light switching should be one of the premium moments.

If supported, use the View Transition API to reveal the new theme from the toggle origin with a radial/soft mask, with robust fallback to a 200–300ms crossfade.

The visual identity should change, not merely invert:

**Dark**
- deeper glass
- stronger reflected highlights
- richer ambient color
- luminous edges used sparingly

**Light**
- milky/translucent surfaces
- more visible soft shadows
- quiet chromatic reflection
- subtle gray-blue canvas rather than pure white

## N. Texture and grain

Use barely visible texture to avoid sterile digital flatness.

Options:

- tiny SVG noise texture
- pseudo-element grain overlay
- CSS mask texture

Rules:

- opacity extremely low
- do not reduce text clarity
- do not use giant raster noise assets
- texture should remain fixed or nearly fixed, not visibly animate

## O. Icons

Use one coherent icon language only.

- thin/medium stroke
- 16–20px for most UI
- no emoji in the interface
- no mixture of filled and outline icon packs
- external-link arrows should be consistent everywhere

## P. Project media presentation

Screenshots should appear intentionally framed. Depending on project type:

- browser-like minimal frame for web products
- edge-to-edge image inside optical glass for visual projects
- diagram canvas for systems/backend work
- clean photography frame for hardware/robotics
- research figure/results frame for ML/research

The framing style should adapt to the work while retaining shared radius/edge/light language.

Do not fake browser chrome on every project.

## Q. Responsive material adaptation

On mobile:

- reduce blur radius and number of ambient layers if necessary
- remove pointer-driven specular effects
- preserve glass hierarchy via border/highlight/shadow
- simplify parallax
- keep sheets and controls tactile
- maintain at least the same perceived visual quality, even with fewer effects

Mobile must not look like the desktop site with all interesting effects disabled.

## R. Premium anti-patterns

Do not interpret “premium” as:

- excessive blur
- every surface translucent
- reflections on every element
- bright gradients behind text
- glossy 3D blobs everywhere
- animated rainbow borders
- oversized rounded rectangles
- dozens of floating cards
- glass surfaces over busy imagery that damage readability
- performance-heavy shader effects with little visual payoff

The target is **controlled richness**.

## S. Quality benchmark

Before calling a section finished, check it in three modes:

1. **Static screenshot test** — does it already look premium without motion?
2. **Slow-scroll test** — do transitions and material states feel continuous and deliberate?
3. **Fast-scan test** — can a recruiter still understand the content without waiting for animation?

All three must pass.

## T. Visual QA / acceptance additions

The final build is not visually complete unless:

- glass surfaces have layered depth, not just blur
- dark and light modes each have intentional material tuning
- hero contains one signature optical treatment
- the page's ambient lighting changes across major sections
- featured work visibly transforms as the active project changes
- archive preview feels integrated with the visual system
- navbar visually transitions from open to floating glass state
- hover/focus states have tactile optical feedback
- at least one meaningful premium interaction is visible above the fold
- the site still looks excellent when all animation is paused
- no premium effect causes readability, accessibility, or performance regressions


# 6. Design Tokens

Keep design tokens centralized.

Baseline palette:

## Light

```css
--bg: #f7f8fa;
--surface: #ffffff;
--surface-soft: #f0f2f5;
--text: #101114;
--text-secondary: #686d76;
--text-tertiary: #969ba5;
--border: #e2e5e9;
--accent: #5b5cf6;
--accent-hover: #4949e8;
--success: #16a36a;
```

## Dark

```css
--bg: #090a0d;
--surface: #0f1115;
--surface-soft: #15181e;
--text: #f5f6f8;
--text-secondary: #969ca7;
--text-tertiary: #696f79;
--border: #242831;
--accent: #7c7dff;
--accent-hover: #9293ff;
--success: #39c88a;
```

Use approximately:

```css
--container: 1240px;
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 20px;
```

Do not scatter hardcoded colors throughout components.

---

# 7. Typography

Preferred:

- Geist Sans or a similarly clean modern sans-serif
- Geist Mono or equivalent for metadata
- use local/system fallbacks correctly

Suggested scale:

| Purpose | Desktop | Mobile |
|---|---:|---:|
| Hero name | 68–78px | 44–56px |
| Section heading | 38–44px | 30–34px |
| Project title | 26–32px | 22–26px |
| Large body | 18–20px | 17–18px |
| Body | 16px | 16px |
| Metadata | 12–13px | 11–12px |

Use tight heading tracking/line-height and comfortable body line-height.

---

# 8. Global Page Structure

Implement the full page in this order:

1. Header / navigation
2. Hero
3. Credibility metrics
4. Selected / featured work
5. Experience
6. Project archive
7. Engineering areas
8. Recognition / awards
9. Credentials
10. About
11. Contact / footer
12. Global project-detail drawer/sheet

The page must feel like one continuous story rather than disconnected sections.

---

# 9. The Major Upgrade: Scroll Choreography

This is the most important requirement.

The page should visibly evolve as the user scrolls.

Do not simply apply the same `fade-up` animation to every section.

Use several different but consistent forms of motion so each major section has a role in the narrative.

Motion should remain restrained and premium.

## Global motion principles

Use roughly these timings:

```text
FAST     120ms
NORMAL   220ms
SMOOTH   320ms
DRAWER   420ms
```

Suggested primary easing:

```css
cubic-bezier(.22, 1, .36, 1)
```

Use native browser scrolling.

Do **not** install a smooth-scroll library that takes over the scroll position.

---

# 10. Global Scroll Progress

Add a very thin page-progress indicator.

Preferred implementation:

- 1–2px line at the top edge of the viewport
- uses accent color
- width reflects overall page progress
- almost invisible until scrolling begins
- no percentage text

It should feel like a product detail, not a progress widget.

---

# 11. Header / Navigation

Desktop navigation:

```text
AMAN.          Work   Experience   Archive   About      Resume ↗    theme
```

Behavior:

### At top

- visually open
- transparent background
- full width inside the main container

### After scrolling

- navbar subtly contracts
- becomes a floating translucent surface
- thin border appears
- backdrop blur appears
- vertical height reduces slightly

### Active section

As the visitor scrolls, the currently relevant navigation item should update.

Do this using IntersectionObserver or equivalent.

The active state must be subtle:

- stronger text
- tiny underline/dot
- no large pill buttons

### Theme toggle

- respect `prefers-color-scheme` on first visit
- persist manual selection
- theme transition should be smooth
- use View Transition API for a tasteful reveal from the toggle if supported, with a simple crossfade fallback
- theme switch must not flash the wrong theme on page load

---

# 12. Hero — Dynamic, Not Static

The hero should establish identity with typography, not a giant illustration.

Example content structure:

```text
ENGINEERING · AI · SOFTWARE

Mohammed Aman Jukaku

Engineering student building intelligent systems,
software and experimental technology.

[ Explore Work ]   GitHub ↗   LinkedIn ↗

Bengaluru, India   ·   Available for opportunities
```

## Hero entrance

On first load:

1. eyebrow appears
2. name reveals using a subtle clipped/masked vertical reveal
3. supporting text appears afterward
4. CTA/navigation metadata follows

Keep the entire sequence under roughly one second.

Do not add a loading screen.

## Hero background

Build a faint ambient technical background using CSS/SVG rather than heavy WebGL.

Possible visual language:

- extremely faint grid
- sparse nodes/lines
- radial lighting
- subtle noise texture

The background should respond gently to pointer position on desktop and scroll position.

Example:

- pointer moves ambient radial highlight by a limited amount
- hero grid drifts by only several pixels while leaving the section
- opacity decreases as the next section enters

The interaction should almost be subconscious.

## Hero scroll exit

As the visitor leaves the hero:

- hero copy moves upward slightly slower/faster than normal content to create depth
- ambient background fades
- metrics become the visual handoff into the page

Do not make the hero permanently sticky.

---

# 13. Credibility Metrics

Use 3 concise metrics maximum, derived from data where possible.

Examples:

```text
03+ internships
20+ projects
06+ years building
```

Do not hardcode counts that can be calculated from content.

As the metrics enter the viewport:

- numeric portion can count/reveal once
- labels fade in immediately
- animation should complete quickly
- do not repeatedly animate when scrolling back and forth

If counting is visually distracting, use a masked numeric reveal instead.

---

# 14. Selected Work — Make This the Main Immersive Section

This is the visual centerpiece of the website.

Use approximately 4–6 selected projects.

Do not simply show a static card grid and move on.

## Desktop interaction model: sticky project showcase

Create a scroll-driven showcase.

Suggested architecture:

```text
┌─────────────────────────────┬────────────────────────────────────┐
│ sticky project information  │ scrolling project media/cards      │
│                             │                                    │
│ 01 / 05                     │      Project 01 visual             │
│ Global Compass              │                                    │
│ AI · Product                │                                    │
│ short summary               │      Project 02 visual             │
│                             │                                    │
│ View project ↗              │      Project 03 visual             │
└─────────────────────────────┴────────────────────────────────────┘
```

As each project media block crosses the active threshold:

- project number updates
- title changes
- category changes
- summary changes
- optional small technology line changes
- active media card becomes fully opaque/sharp
- neighboring media is slightly reduced in opacity/scale
- section ambient accent can shift subtly based on the project's optional accent metadata

The left column should remain sticky only for the duration of the featured-work section.

Do not trap scrolling.

## Media behavior

Each media visual should use a subtle masked reveal on entry.

Image movement can include a small parallax offset, for example roughly ±20px over the card's visible scroll range.

Do not excessively zoom images.

## Mobile behavior

Do not reproduce a sticky two-column layout.

Use normal full-width cards, but add:

- image reveal
- active progress/index marker
- subtle scroll entrance
- tap opens project sheet

---

# 15. Featured Project Card

Each featured project needs:

- cover media
- categories
- year
- title
- concise outcome-oriented summary
- optional status such as `Live`
- `View project` as primary interaction

Do not place five external-link icons on every card.

External evidence belongs inside the project detail view.

Hover behavior on pointer devices:

```text
translateY: about -3px
media scale: 1 -> ~1.018
border emphasis: slight increase
arrow: moves ~3px diagonally
```

Hover should not cause layout shift.

---

# 16. Project Detail Drawer / Mobile Sheet

Projects need deeper exploration without leaving the single-page experience.

## Desktop

Open a right-side drawer approximately:

```css
width: min(720px, 52vw);
```

Background page:

- remains visible
- gets subtle dim/blur treatment
- becomes non-interactive while drawer is open

Drawer contains:

1. project title
2. categories/year/status
3. large media
4. Problem / Idea
5. What I Built
6. Engineering
7. Result / Outcome
8. technologies
9. available evidence links
10. optional small media gallery

Evidence links may include:

- Live Demo
- GitHub / Source
- Paper
- Notebook
- Demo Video
- Article

Only render links that exist.

## Opening motion

- drawer slides in
- backdrop fades
- content enters with slight stagger

Where feasible, create a subtle continuity between the clicked project image and drawer media, but do not spend excessive complexity on shared-element animation if it becomes fragile.

## Accessibility

- focus trap
- Escape closes
- close button
- restore focus to originating card/row
- prevent body scroll while open
- correct ARIA semantics

## Mobile

Use a full-screen or near-full-screen sheet instead of a narrow drawer.

Preserve the exact previous page scroll position when closed.

---

# 17. Experience — Scroll-Drawn Timeline

Experience should visually outrank certificates.

Use a restrained vertical timeline.

As the section enters:

- main timeline line draws progressively with scroll
- each experience marker activates as its item becomes relevant
- item content reveals with slight horizontal/vertical movement
- active year/title receives slightly stronger contrast

Do not animate every bullet separately.

Each experience entry should contain:

- organization
- role
- start/end
- one concise description
- 2–4 impact-oriented highlights
- technologies as metadata
- optional organization/project link

The structure should support entries such as internships involving LLM datasets, data pipelines, synthetic data generation, software systems, research work, etc.

---

# 18. Project Archive — Signature Interaction

The archive is where the breadth of the profile becomes visible.

Use a clean table/list rather than dozens of cards.

Desktop columns can resemble:

```text
YEAR | PROJECT | CATEGORY | TECHNOLOGIES | LINK
```

The archive must support multi-category filtering.

Example filters:

```text
All   AI   Data   Systems   Web   Bots   Robotics   Research   Early
```

Each project may belong to multiple categories.

## Archive filtering

Filtering must:

- happen instantly client-side
- animate rows out/in without excessive motion
- preserve keyboard usability
- update result count
- optionally update URL hash/query so a filtered view can be shared

## Desktop hover/focus preview

This is one of the site's signature interactions.

When a project row is hovered or keyboard-focused:

- a floating/sticky media preview appears on the right side
- the visual crossfades/slides when moving to another row
- preview stays within viewport boundaries
- use one preview container, not a new DOM overlay per row
- image loading must be optimized

If a project has no screenshot:

- display a tasteful generated visual from project metadata, architecture diagram, hardware photo, research output, or simple branded placeholder
- never show a broken/empty image

## Mobile archive

Remove hover-preview behavior.

Each row becomes a compact stacked item:

```text
2026                                    ↗
Global Compass
AI · Product
WebGL · Gemini
```

Tap opens the project detail sheet.

---

# 19. Engineering Areas — Interactive Capability Map

Do not use proficiency percentages.

Use 4 groups such as:

- AI & Machine Learning
- Software Engineering
- Data & Infrastructure
- Applied Engineering

On desktop, each group can receive subtle interactive emphasis on hover/focus.

When a group becomes active:

- nearby project references or a tiny count can appear
- relevant technologies gain contrast
- optional line/connection treatment may connect the area to example projects

Keep this section understated. It supports the projects; it should not compete with them.

---

# 20. Recognition / Awards

Use large faint ordinal numbers such as `01`, `02` behind or beside the award content.

As the section enters:

- number reveals using clipping
- title/content enters with slight delay

Awards should have more visual weight than certificates because they represent external validation.

---

# 21. Credentials

Credentials should remain quiet.

Use simple rows:

```text
Harvard University      CS50x                  YEAR ↗
Harvard University      CS50 AI                YEAR ↗
Harvard University      CS50 Web               YEAR ↗
Google Cloud            Cloud credential       YEAR ↗
```

No giant institution logos.

No certificate-card carousel.

Credential URL is optional and only rendered when available.

---

# 22. About — Human but Concise

The About section should feel different from a résumé summary.

Target roughly 100–160 words.

It should explain the person's pattern of curiosity/building and how their work evolved from early experiments into modern AI/software/data engineering.

Use one subtle motion idea here, for example:

- keywords or disciplines gain contrast as they enter
- an understated timeline of `web -> electronics -> ML -> systems -> LLM/data` becomes visible

Do not turn About into another long skills list.

---

# 23. Contact / Final Section

The page should end decisively.

Suggested structure:

```text
Have something ambitious in mind?
Let's talk.

email@example.com ↗

GitHub     LinkedIn                       © YEAR
```

The final CTA can have slightly stronger use of the accent color than the rest of the site.

Use a subtle background transition as the visitor enters the final section so the ending feels intentional.

---

# 24. Ambient Background State

To make the entire page feel connected, maintain a small global ambient background layer.

It can be composed of:

- radial gradient
- faint grid/noise
- one or two blurred accent shapes

Major sections may update CSS variables such as:

```css
--ambient-x
--ambient-y
--ambient-opacity
--ambient-accent
```

As the active section changes, transition those variables smoothly.

Examples:

- Hero: ambient glow near top center
- Featured work: glow moves toward active media
- Experience: ambient effect becomes quieter
- Archive: faint side glow near project preview
- Contact: slightly stronger centered glow

This should be subtle. The user should feel the page changing more than consciously notice why.

---

# 25. Data-Driven Content Architecture

The UI must not contain portfolio-specific content hardcoded across components.

Use structured data/content files.

Recommended:

```text
src/content/
  profile.yaml
  experience.yaml
  projects.yaml
  recognition.yaml
  credentials.yaml
```

The developer must be able to add a new project primarily by editing one data entry and adding media.

---

# 26. Suggested `profile.yaml`

```yaml
name: Mohammed Aman Jukaku
short_name: Aman
location: Bengaluru, India

eyebrow: Engineering · AI · Software

headline: >
  Engineering student building intelligent systems,
  software and experimental technology.

summary: >
  Short supporting introduction.

availability: Available for opportunities

links:
  email: ""
  github: ""
  linkedin: ""
  resume: ""

about: >
  Long-form About copy goes here.
```

---

# 27. Required Project Schema

Design the project schema for the full variety of work: deployed software, AI projects, research, bots, robotics, hardware, old web experiments, notebooks, and projects with little/no public source code.

Suggested:

```yaml
- id: global-compass
  title: Global Compass
  year: 2026

  featured: true
  featured_order: 1
  visual_weight: large

  status: live

  categories:
    - ai
    - web
    - product

  technologies:
    - WebGL
    - Gemini
    - Genkit

  summary: >
    One concise outcome-oriented description.

  case_study:
    problem: >
      Why this project exists.

    build: >
      What was actually built.

    engineering: >
      Important technical decisions/challenges.

    result: >
      Outcome, impact, result, or what was demonstrated.

  media:
    cover: /projects/global-compass/cover.webp
    preview: /projects/global-compass/preview.webp
    gallery:
      - /projects/global-compass/01.webp
      - /projects/global-compass/02.webp

  links:
    live: ""
    github: ""
    paper: null
    notebook: null
    video: null
    article: null

  accent: null
  recognition: null
```

Do not require every field to be present.

Components should degrade gracefully based on available data.

---

# 28. Supported Project Types

Make sure the design works for all of these:

### Live product

Has screenshots + live URL + GitHub.

### Open-source/code project

Has GitHub but no live deployment.

### Research project

May have notebook, report, paper, model result, or competition recognition.

### Robotics/hardware project

May have photographs and demo video, with limited source code.

### Infrastructure/backend project

May have no attractive UI. Use architecture diagrams, pipeline illustrations, logs/output screenshots, or tasteful generated technical media.

### Early project

May have only screenshots, description, or an archived URL.

The UI must never imply that missing GitHub/live links mean the project is incomplete or low quality.

---

# 29. Automatic Metrics

Where sensible, derive homepage metrics from data.

Possible calculated values:

- number of projects
- number of internships/experience entries
- number of live projects
- number of awards
- earliest project year / years building

Do not expose every calculated number. Use only the strongest 3 metrics.

---

# 30. Media Pipeline

Project media must not destroy performance.

Requirements:

- use AVIF/WebP where practical
- generate responsive sizes
- set explicit width/height or aspect ratio to avoid layout shift
- lazy-load below-the-fold images
- eagerly/preload only true above-the-fold assets
- use `object-fit` intentionally
- use consistent `16:10` visual ratio for most project media
- handle hardware portrait/landscape images gracefully

Do not autoplay large videos in project cards.

For demo videos inside a project drawer, use click-to-play or lightweight poster behavior.

---

# 31. Responsive Requirements

## Desktop

- max content width ~1240px
- 12-column grid
- sticky featured-work storytelling
- hover project previews
- restrained pointer interactions

## Tablet

- simplify sticky layouts where needed
- preserve information hierarchy
- avoid cramped two-column content

## Mobile

- 20–24px side padding
- full-width featured projects
- no hover-only functionality
- project drawer becomes sheet/full-screen view
- archive rows become stacked
- filter bar horizontally scrolls if needed
- navbar collapses cleanly
- all interactive targets at least touch-friendly size

Never hide important content on mobile merely because an interaction was designed around hover.

---

# 32. Accessibility

This is non-negotiable.

Implement:

- correct semantic landmarks
- keyboard navigation
- visible focus treatment
- sufficient color contrast in both themes
- meaningful alt text where appropriate
- decorative media hidden from assistive tech where appropriate
- accessible drawer/dialog semantics
- focus management
- Escape behavior
- no hover-only access to information
- skip-to-content link

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Under reduced motion:

- remove parallax
- remove scroll-linked transforms
- disable count animations
- remove complex drawer staging
- preserve simple opacity/state changes only where necessary

The website must still look intentional with all motion disabled.

---

# 33. Performance Targets

Treat performance as part of the design.

Aim for:

- static HTML for most content
- minimal hydration
- no unnecessary React runtime
- no giant animation bundle for basic transitions
- no layout shifts
- optimized fonts
- responsive images
- lazy loading
- no loading screen
- quick interactive readiness

Target excellent Lighthouse results rather than chasing animation at any cost.

The portfolio should remain smooth on ordinary laptops and modern midrange phones, not just high-end hardware.

---

# 34. SEO / Metadata

Implement:

- correct title/description
- canonical URL
- Open Graph metadata
- social preview image
- favicon
- structured metadata where appropriate
- `robots.txt`
- sitemap if supported cleanly

Project data should remain crawlable in rendered HTML; do not hide primary content behind client-only JavaScript.

---

# 35. GitHub Pages

The final site must deploy cleanly as a static GitHub Pages site.

Support both:

```text
username.github.io
```

and project-base deployments such as:

```text
username.github.io/portfolio
```

Avoid hardcoded root asset paths that break under a base path.

Add or finalize GitHub Actions deployment if it does not already exist.

Document configuration in the README.

---

# 36. Suggested Component Architecture

Use clean component boundaries similar to:

```text
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── SectionHeader.astro
│   │
│   ├── hero/
│   │   ├── Hero.astro
│   │   ├── HeroAmbient.astro
│   │   └── Metrics.astro
│   │
│   ├── projects/
│   │   ├── FeaturedWork.astro
│   │   ├── FeaturedProjectMedia.astro
│   │   ├── ProjectArchive.astro
│   │   ├── ProjectRow.astro
│   │   ├── ProjectPreview.astro
│   │   └── ProjectDrawer.astro
│   │
│   ├── experience/
│   │   ├── ExperienceTimeline.astro
│   │   └── ExperienceItem.astro
│   │
│   ├── sections/
│   │   ├── EngineeringAreas.astro
│   │   ├── Recognition.astro
│   │   ├── Credentials.astro
│   │   ├── About.astro
│   │   └── Contact.astro
│   │
│   └── ui/
│       ├── ThemeToggle.astro
│       ├── ExternalLink.astro
│       ├── Tag.astro
│       └── Icon.astro
│
├── content/
│   ├── profile.yaml
│   ├── projects.yaml
│   ├── experience.yaml
│   ├── recognition.yaml
│   └── credentials.yaml
│
├── scripts/
│   ├── theme.ts
│   ├── navigation.ts
│   ├── ambient.ts
│   ├── featured-work.ts
│   ├── archive.ts
│   └── project-drawer.ts
│
├── styles/
│   ├── tokens.css
│   ├── global.css
│   ├── typography.css
│   └── motion.css
│
└── pages/
    └── index.astro
```

This is a guideline, not a requirement to create unnecessary files. Keep responsibilities clear.

---

# 37. Animation Architecture

Avoid scattered component-level animation code with duplicated magic numbers.

Create a small animation system.

Examples:

- reusable reveal helper
- centralized timing/easing constants
- centralized reduced-motion check
- one ScrollTrigger setup per major interactive section
- cleanup handlers where required

Prefer CSS for:

- buttons
- links
- cards
- borders
- theme colors
- tiny hover transforms

Use GSAP/ScrollTrigger for:

- sticky featured project state
- scroll-linked timeline progression
- controlled parallax
- complex reveal sequences

Do not use GSAP merely to fade an element from opacity 0 to 1.

---

# 38. Content Priority

The website's visual hierarchy must be:

1. identity / engineering direction
2. strongest featured projects
3. professional experience
4. project breadth/archive
5. engineering areas
6. awards/recognition
7. credentials
8. about/personality
9. contact

Certificates must never visually outrank internships or substantive projects.

---

# 39. Representative Portfolio Variety

Design/test components against genuinely different kinds of projects, for example:

- Global Compass — deployed AI/web product
- DID++ — decentralized biometric identity/security project
- LLM/synthetic-data systems — backend/data/AI work
- skin lesion CNN — research/ML project
- Particle Life — simulation/visual project
- Discord/bot/infrastructure work
- robotics/hardware projects
- early websites/experiments

Do not build a UI that looks good only when every project is a SaaS dashboard screenshot.

---

# 40. Important Copy Rules

Avoid cliché copy such as:

- passionate developer
- turning coffee into code
- code is my superpower
- full-stack ninja
- AI enthusiast
- welcome to my portfolio

Project summaries should be concise and outcome-oriented.

Experience descriptions should focus on what was built, automated, improved, or solved.

Technology names support the story; they are not the story.

---

# 41. Quality Details

Implement the small things that distinguish a polished site:

- no flash of incorrect theme
- active nav tracking
- graceful anchor scrolling
- browser back/forward should not leave drawer/filter state broken
- preserve focus
- no image layout shift
- no jump when scrollbar is removed for the drawer
- correct pointer cursor only where interactive
- links have useful hover/focus feedback
- external links communicate external behavior
- project status indicators only when meaningful
- zero broken empty states
- metadata remains readable in both themes
- selection color should use the accent palette
- scrollbar can be subtly themed but must remain usable

---

# 42. Implementation Phases

Implement in this order.

## Phase 1 — Foundation

- audit/refactor existing prototype
- complete tokens
- global typography/layout
- theme system
- header/navigation
- responsive shell
- ambient lighting system
- premium material primitives (`glass`, optical borders, highlight layers)
- hero signature optical treatment foundation
- reduced-motion architecture

## Phase 2 — Hero + Story Entry

- hero content
- load reveal
- ambient/pointer behavior
- scroll exit behavior
- credibility metrics

## Phase 3 — Featured Work

- data-driven featured projects
- sticky desktop storytelling
- active project state
- media reveals/parallax
- mobile cards
- project drawer/sheet

## Phase 4 — Experience

- data-driven experience entries
- scroll-drawn timeline
- responsive layout

## Phase 5 — Archive

- full project archive
- filters
- result count
- shareable filter state if practical
- desktop floating preview
- keyboard/focus parity
- mobile version

## Phase 6 — Supporting Sections

- engineering areas
- recognition
- credentials
- about
- contact/footer
- section-driven ambient changes

## Phase 7 — Production Polish

- real content/data validation
- image optimization
- accessibility pass
- responsive QA
- material/lighting QA in both themes
- screenshot / slow-scroll / fast-scan visual QA
- performance pass
- SEO/social metadata
- GitHub Pages deployment
- README documentation

Do not leave major components as placeholders after beginning the next phase.

---

# 43. Acceptance Criteria

The implementation is complete only when all of the following are true:

### Visual

- both themes look intentionally designed
- spacing/typography remain consistent
- desktop and mobile feel designed independently rather than merely collapsed
- no generic template-looking sections

### Dynamic experience

- hero has meaningful entrance/exit motion
- navbar changes state while scrolling
- active nav section updates
- featured projects use a genuine scroll-driven state change on desktop
- project media reveals/parallax subtly
- experience timeline responds to scroll
- archive has a polished hover/focus preview on desktop
- project drawer/sheet feels integrated
- ambient background changes subtly through the page
- motion is varied but coherent

### Usability

- scanning the page is fast
- no interaction prevents normal scrolling
- project evidence is easy to access
- every project still works if it has only one evidence link or no public source link
- no hover-only functionality on touch devices

### Engineering

- content is data-driven
- no giant client runtime
- clean component architecture
- works as static GitHub Pages output
- responsive media
- reduced motion supported
- keyboard accessible
- no console errors
- no obvious layout shifts

### Performance

- no unnecessary video/autoplay
- images optimized/lazy-loaded
- animation remains smooth
- page loads quickly
- no expensive effect constantly running when offscreen

---

# 44. Final Deliverables

Provide:

1. complete working portfolio implementation
2. all source code
3. populated/example content files ready for the real profile data
4. documented project schema
5. responsive dark/light design
6. all animations/interactions implemented
7. GitHub Pages deployment workflow/configuration
8. README containing:
   - local setup
   - build
   - deployment
   - how to edit profile data
   - how to add a project
   - how project media should be supplied
   - how featured-project ordering works
   - how categories/filters work
9. no unfinished TODO placeholders for core functionality

---

# 45. Final Direction

The finished experience should communicate:

> I build a lot, I have been doing it for years, the work spans multiple engineering disciplines, and here is enough evidence for you to inspect it properly.

The visual balance should roughly feel like:

```text
65% premium software/product website
20% engineering résumé
10% design portfolio
 5% personality
```

The page should feel sophisticated because of **hierarchy, typography, motion, responsiveness, and engineering quality**, not because it contains flashy effects.

The benchmark is not “good student portfolio.”

The benchmark is a **premium product-grade personal site** that would still look credible if the owner were already a professional engineer at a strong technology company. It should be recognizable from a screenshot, memorable after a short scroll, and still highly legible to a recruiter skimming quickly.

The words **premium, liquid glass, glossy, immersive, and dynamic** must be interpreted through the material and interaction rules in this brief—not as permission to add visual noise.
