export type Media = {
  type?: "image" | "video" | "youtube";
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  fit?: "contain" | "cover";
  position?: string;
  background?: "theme" | "light" | "dark";
  source_url?: string;
  source_label?: string;
  captured_at?: string;
};
export function mediaStyle(media: Media) {
  return {
    objectFit:
      media.fit === "cover" ? ("cover" as const) : ("contain" as const),
    objectPosition: media.position || "center",
    background:
      media.background === "light"
        ? "#ffffff"
        : media.background === "dark"
          ? "#090a0d"
          : "var(--surface-soft)",
  };
}
export function youtubeId(value: string): string | undefined {
  try {
    const url = new URL(value),
      host = url.hostname.replace(/^www\./, "");
    if (
      ![
        "youtube.com",
        "m.youtube.com",
        "youtu.be",
        "youtube-nocookie.com",
      ].includes(host)
    )
      return;
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1).split("/")[0]
        : url.searchParams.get("v") ||
          url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch {
    return;
  }
}
export function projectMedia(
  media: Media[],
  links: Record<string, unknown>,
): Media[] {
  const videos = normalizeLinks({ video: links.video }).filter(
    (l) =>
      youtubeId(l.url) &&
      !media.some((m) => youtubeId(m.src) === youtubeId(l.url)),
  );
  return [
    ...media,
    ...videos.map((v) => ({
      type: "youtube" as const,
      src: v.url,
      alt: "Project video walkthrough",
      caption: "Video walkthrough",
      source_url: v.url,
      source_label: "YouTube",
    })),
  ];
}
export type Evidence = { label: string; url: string };
export const assetUrl = (path: string) =>
  /^https?:\/\//.test(path)
    ? path
    : `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export function evidenceInfo(url: string) {
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, "");
  const platform =
    host === "github.com"
      ? "GitHub"
      : host === "kaggle.com"
        ? "Kaggle"
        : ["youtube.com", "youtu.be", "m.youtube.com"].includes(host)
          ? "YouTube"
          : host;
  return {
    platform,
    path: decodeURIComponent(parsed.pathname).replace(/^\/|\/$/g, ""),
    kind:
      platform === "GitHub"
        ? "Repository"
        : platform === "Kaggle"
          ? "Notebook"
          : platform === "YouTube"
            ? "Video walkthrough"
            : "Project resource",
  };
}
export function normalizeLinks(links: Record<string, unknown>): Evidence[] {
  const labels: Record<string, string> = {
    github: "View source",
    kaggle: "Explore notebook",
    live_demo: "Open live project",
    video: "Watch demo",
    article: "Read article",
    paper: "Read paper",
  };
  return Object.entries(links).flatMap(([key, value]) =>
    (Array.isArray(value) ? value : [value]).flatMap((entry) => {
      const item =
        typeof entry === "string"
          ? { url: entry, label: labels[key] || "Explore resource" }
          : (entry as { url?: string; label?: string } | null);
      if (!item?.url || !/^https?:\/\//.test(item.url)) return [];
      try {
        new URL(item.url);
      } catch {
        return [];
      }
      return [
        {
          url: item.url,
          label: item.label || labels[key] || "Explore resource",
        },
      ];
    }),
  );
}
