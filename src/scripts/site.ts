export {};
const root = document.documentElement;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const $$ = <T extends Element = HTMLElement>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));
const header = $("#header");
const themeButton = $<HTMLButtonElement>(".theme-toggle");
function updateThemeLabel() {
  const dark = root.dataset.theme === "dark";
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  $('meta[name="theme-color"]').setAttribute(
    "content",
    dark ? "#090a0d" : "#f7f8fa",
  );
}
updateThemeLabel();
themeButton.addEventListener("click", async () => {
  const change = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {
      /* Private browsing can disable storage. */
    }
    updateThemeLabel();
  };
  if (!document.startViewTransition || reducedMotion.matches) {
    change();
    return;
  }
  const bounds = themeButton.getBoundingClientRect();
  const x = bounds.x + bounds.width / 2,
    y = bounds.y + bounds.height / 2;
  const transition = document.startViewTransition(change);
  await transition.ready;
  root.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: 550,
      easing: "cubic-bezier(.22,1,.36,1)",
      pseudoElement: "::view-transition-new(root)",
    },
  );
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  try {
    if (localStorage.getItem("theme")) return;
  } catch {
    /* Use system preference. */
  }
  root.dataset.theme = e.matches ? "dark" : "light";
  updateThemeLabel();
});
const menuButton = $<HTMLButtonElement>(".menu-toggle");
const closeMenu = () => {
  header.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
};
menuButton.addEventListener("click", () => {
  const opened = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(opened));
  menuButton.setAttribute(
    "aria-label",
    `${opened ? "Close" : "Open"} navigation`,
  );
});
$$("#navigation a").forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && header.classList.contains("menu-open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (e) => {
  if (!header.contains(e.target as Node)) closeMenu();
});

const cards = $$("[data-featured]");
const panels = $$("[data-rail]");
let activeProject = -1;
function selectProject(index: number) {
  if (index === activeProject) return;
  activeProject = index;
  cards.forEach((card, i) => card.classList.toggle("active", i === index));
  panels.forEach((panel, i) => {
    const active = i === index;
    panel.classList.toggle("active", active);
    panel.inert = !active;
    panel.setAttribute("aria-hidden", String(!active));
    panel.querySelector("a")?.setAttribute("tabindex", active ? "0" : "-1");
  });
  $$("[data-step]").forEach((step, i) =>
    step.classList.toggle("active", i === index),
  );
  root.style.setProperty("--ambient-hue", `${index * 5 - 10}deg`);
}
const hero = $("#hero");
const heroCopy = $(".hero-copy");
const heroGrid = $(".hero-grid");
const timeline = $(".timeline");
const progress = $(".scroll-progress");
const trackedSections = $$("section[data-ambient]");
const navLinks = $$<HTMLAnchorElement>("#navigation a");
const work = $("#work");
let currentSection = "";
let queued = false;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function scrollFrame() {
  queued = false;
  const y = window.scrollY;
  const height = innerHeight;
  progress.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - height))})`;
  header.classList.toggle("scrolled", y > 35);
  if (!reducedMotion.matches) {
    const heroProgress = clamp(y / hero.offsetHeight);
    heroCopy.style.transform = `translateY(${-heroProgress * 25}px)`;
    heroGrid.style.opacity = `${1 - heroProgress}`;
  } else {
    heroCopy.style.transform = "";
    heroGrid.style.opacity = "";
  }
  const workRect = work.getBoundingClientRect();
  if (workRect.top < height && workRect.bottom > 0) {
    let closest = 0,
      distance = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const d = Math.abs(
        rect.top + Math.min(rect.height, height) * 0.45 - height * 0.5,
      );
      if (d < distance) {
        distance = d;
        closest = i;
      }
      if (
        !reducedMotion.matches &&
        innerWidth > 800 &&
        rect.bottom > 0 &&
        rect.top < height
      )
        card.style.setProperty(
          "--parallax",
          `${(clamp((height - rect.top) / (height + rect.height)) - 0.5) * 24}px`,
        );
    });
    selectProject(closest);
  }
  const timelineRect = timeline.getBoundingClientRect();
  timeline.style.setProperty(
    "--timeline-progress",
    String(clamp((height * 0.65 - timelineRect.top) / timelineRect.height)),
  );
  let activeSection = trackedSections[0];
  for (const section of trackedSections)
    if (section.getBoundingClientRect().top < height * 0.45)
      activeSection = section;
  if (currentSection !== activeSection.id) {
    currentSection = activeSection.id;
    const lighting: Record<string, [string, string, string]> = {
      hero: ["76%", "12%", "1"],
      work: ["85%", "45%", "1"],
      experience: ["15%", "65%", ".45"],
      archive: ["85%", "45%", ".85"],
      engineering: ["30%", "60%", ".4"],
      recognition: ["60%", "30%", ".5"],
      about: ["25%", "50%", ".6"],
      contact: ["50%", "90%", "1"],
    };
    const values = lighting[currentSection] || lighting.hero;
    ["--ambient-x", "--ambient-y", "--ambient-opacity"].forEach((key, i) =>
      root.style.setProperty(key, values[i]),
    );
  }
  let navSection = "";
  for (const link of navLinks) {
    const section = $(link.hash);
    if (section.getBoundingClientRect().top < height * 0.45)
      navSection = link.hash;
  }
  navLinks.forEach((link) =>
    link.hash === navSection
      ? link.setAttribute("aria-current", "location")
      : link.removeAttribute("aria-current"),
  );
}
const queueScroll = () => {
  if (!queued) {
    queued = true;
    requestAnimationFrame(scrollFrame);
  }
};
window.addEventListener("scroll", queueScroll, { passive: true });
window.addEventListener("resize", queueScroll, { passive: true });
reducedMotion.addEventListener("change", queueScroll);
const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("seen");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.15 },
);
$$(".metrics, .experience-item, .award").forEach((el) => observer.observe(el));
$$(".media-link").forEach((surface) =>
  surface.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || reducedMotion.matches) return;
    const e = event as PointerEvent,
      rect = surface.getBoundingClientRect();
    surface.style.setProperty(
      "--mx",
      `${((e.clientX - rect.left) / rect.width) * 100}%`,
    );
    surface.style.setProperty(
      "--my",
      `${((e.clientY - rect.top) / rect.height) * 100}%`,
    );
  }),
);
const caseStudies = new Map(
  $$<HTMLElement>("[data-case]").map((el) => [el.dataset.case!, el]),
);
const dialog = $<HTMLDialogElement>(".project-dialog");
const drawerContent = $(".drawer-content");
let opener: HTMLElement | null = null;
let savedScroll = 0;
let pushedProject = false;
function renderProject(slug: string) {
  const source = caseStudies.get(slug);
  if (!source) return false;
  const content = source.cloneNode(true) as HTMLElement;
  content.removeAttribute("id");
  content.querySelector("h2")!.id = "dialog-title";
  drawerContent.replaceChildren(content);
  if (!dialog.open) {
    opener = document.activeElement as HTMLElement;
    savedScroll = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScroll}px`;
    document.body.style.width = "100%";
    dialog.showModal();
  }
  dialog.scrollTop = 0;
  $<HTMLButtonElement>(".drawer-close").focus();
  return true;
}
function closeDrawer() {
  if (!dialog.open) return;
  closeMedia();
  dialog.querySelectorAll("video").forEach((video) => video.pause());
  dialog
    .querySelectorAll(".youtube-preview iframe")
    .forEach((frame) => frame.remove());
  dialog.close();
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo({ top: savedScroll, behavior: "instant" });
  opener?.focus({ preventScroll: true });
  queueScroll();
}
function requestClose() {
  if (pushedProject) {
    pushedProject = false;
    history.back();
  } else {
    const url = new URL(location.href);
    url.hash = "work";
    history.replaceState(null, "", url);
    closeDrawer();
  }
}
$$<HTMLAnchorElement>(".project-open").forEach((link) =>
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const slug = link.dataset.project!;
    if (!caseStudies.has(slug)) return;
    e.preventDefault();
    const url = new URL(location.href);
    url.hash = `project-${slug}`;
    history.pushState({ project: slug }, "", url);
    pushedProject = true;
    renderProject(slug);
  }),
);
$(".drawer-close").addEventListener("click", requestClose);
dialog.addEventListener("cancel", (e) => {
  e.preventDefault();
  requestClose();
});
dialog.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>('a[href],button,[tabindex="0"]'),
  ).filter((el) => el.getClientRects().length > 0);
  const first = focusable[0],
    last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right) requestClose();
  }
});
// Native modality makes the background inert; explicit wrapping keeps Tab inside the sheet.

const mediaDialog = $<HTMLDialogElement>(".media-dialog");
let mediaLinks: HTMLAnchorElement[] = [];
let mediaIndex = 0;
let mediaOpener: HTMLElement | null = null;
function showImage(index: number) {
  mediaIndex = (index + mediaLinks.length) % mediaLinks.length;
  const link = mediaLinks[mediaIndex],
    img = $<HTMLImageElement>(".media-viewer-image img");
  img.src = link.href;
  img.alt = link.querySelector("img")?.alt || "Project image";
  $(".media-caption").textContent = link.dataset.caption || img.alt;
  $("#media-title").textContent =
    `IMAGE ${mediaIndex + 1} / ${mediaLinks.length}`;
  $<HTMLButtonElement>(".media-previous").disabled = mediaLinks.length < 2;
  $<HTMLButtonElement>(".media-next").disabled = mediaLinks.length < 2;
}
function closeMedia() {
  if (!mediaDialog.open) return;
  mediaDialog.close();
  $<HTMLImageElement>(".media-viewer-image img").removeAttribute("src");
  mediaOpener?.focus({ preventScroll: true });
}
document.addEventListener("click", (event) => {
  const target = event.target as Element;
  const link = target.closest<HTMLAnchorElement>(".media-open");
  if (
    link &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey
  ) {
    event.preventDefault();
    mediaLinks = Array.from(
      link
        .closest(".media-gallery")!
        .querySelectorAll<HTMLAnchorElement>(".media-open"),
    );
    mediaOpener = link;
    showImage(mediaLinks.indexOf(link));
    mediaDialog.showModal();
    $(".media-close").focus();
  }
  const play = target.closest<HTMLAnchorElement>("[data-youtube]");
  if (
    play &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey
  ) {
    event.preventDefault();
    const id = play.dataset.youtube;
    if (!id || !/^[\w-]{11}$/.test(id)) return;
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`;
    frame.title = play.dataset.videoTitle || "Project video";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    play.replaceWith(frame);
    frame.focus();
  }
});
$(".media-close").addEventListener("click", closeMedia);
$(".media-previous").addEventListener("click", () => showImage(mediaIndex - 1));
$(".media-next").addEventListener("click", () => showImage(mediaIndex + 1));
mediaDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeMedia();
});
mediaDialog.addEventListener("click", (event) => {
  if (event.target === mediaDialog) closeMedia();
});
mediaDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(mediaIndex - 1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showImage(mediaIndex + 1);
  }
  if (event.key === "Tab") {
    const buttons = Array.from(
      mediaDialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
    );
    const first = buttons[0],
      last = buttons.at(-1)!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const filterButtons = $$<HTMLButtonElement>("[data-filter]");
const archiveRows = $$<HTMLAnchorElement>(".archive-row");
const availableFilters = filterButtons
  .map((b) => b.dataset.filter!)
  .filter((f) => f !== "All");
let selected = new Set<string>();
function setPreview(slug: string) {
  if ($("#preview-visual").dataset.project === slug) return;
  const source = caseStudies.get(slug);
  if (!source) return;
  const visual = source
    .querySelector(".project-visual")!
    .cloneNode(true) as HTMLElement;
  visual.classList.add("compact");
  const holder = $("#preview-visual");
  holder.replaceChildren(visual);
  holder.dataset.project = slug;
  $("#preview-title").textContent = source.querySelector("h2")!.textContent;
  $("#preview-summary").textContent =
    source.querySelector(".case-intro")!.textContent;
  const preview = $(".archive-preview");
  preview.classList.remove("preview-changing");
  requestAnimationFrame(() => preview.classList.add("preview-changing"));
}
archiveRows.forEach((row) => {
  row.addEventListener("pointerenter", () => {
    if (finePointer.matches) setPreview(row.dataset.project!);
  });
  row.addEventListener("focus", () => setPreview(row.dataset.project!));
});
function applyFilters(updateUrl = false) {
  let count = 0;
  let first = "";
  archiveRows.forEach((row) => {
    const matches =
      !selected.size ||
      [...selected].some((c) => row.dataset.categories!.split(",").includes(c));
    row.hidden = !matches;
    if (matches) {
      count++;
      first ||= row.dataset.project!;
    }
  });
  filterButtons.forEach((button) =>
    button.setAttribute(
      "aria-pressed",
      String(
        button.dataset.filter === "All"
          ? !selected.size
          : selected.has(button.dataset.filter!),
      ),
    ),
  );
  $("#result-count").textContent = `${count} project${count === 1 ? "" : "s"}`;
  $(".empty-results").hidden = count !== 0;
  if (first) setPreview(first);
  if (updateUrl) {
    const url = new URL(location.href);
    if (selected.size)
      url.searchParams.set("categories", [...selected].join(","));
    else url.searchParams.delete("categories");
    history.pushState(null, "", url);
  }
  queueScroll();
}
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const filter = button.dataset.filter!;
    if (filter === "All") selected.clear();
    else if (selected.has(filter)) selected.delete(filter);
    else selected.add(filter);
    applyFilters(true);
  }),
);
$$<HTMLAnchorElement>("[data-area-filter]").forEach((link) =>
  link.addEventListener("click", (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    selected = new Set([link.dataset.areaFilter!]);
    applyFilters(false);
    const url = new URL(location.href);
    url.searchParams.set("categories", link.dataset.areaFilter!);
    url.hash = "archive";
    history.pushState(null, "", url);
    $("#archive").scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
    });
    filterButtons
      .find((b) => b.dataset.filter === link.dataset.areaFilter)
      ?.focus({ preventScroll: true });
  }),
);
function syncUrl() {
  selected = new Set(
    (new URL(location.href).searchParams.get("categories") || "")
      .split(",")
      .filter((c) => availableFilters.includes(c)),
  );
  applyFilters();
  const slug = location.hash.startsWith("#project-")
    ? location.hash.slice(9)
    : "";
  if (!slug || !renderProject(slug)) closeDrawer();
}
window.addEventListener("popstate", syncUrl);
window.addEventListener("hashchange", syncUrl);
// Add enhancement flag only once every interaction has been installed.
root.classList.add("js");
syncUrl();
scrollFrame();
