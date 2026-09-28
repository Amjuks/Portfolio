import { normalizeLinks, projectMedia, type Media } from "./media";
export type Project = {
  name: string;
  slug: string;
  year: number | null;
  status: string;
  category: string;
  summary: string;
  description: string;
  built: string[];
  technologies: string[];
  metrics: Record<string, string | number>;
  engineering: string;
  recognition: string[];
  links: { label: string; url: string }[];
  categories: string[];
  media: Media[];
  presentation: string;
};

export interface ProjectInput {
  name: string;
  slug?: string;
  year?: number | null;
  status?: string;
  category?: string;
  one_line_purpose?: string;
  description?: string;
  personally_built?: string[];
  technologies?: string[];
  tags?: string[];
  metrics?: Record<string, string | number | null | undefined>;
  technical_highlight?: string;
  recognition?: string | string[];
  links?: Record<string, unknown>;
  link?: string;
  media?: Media[];
  presentation?: string;
  featured?: boolean;
}
export const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export function normalizeProject(
  p: ProjectInput,
  categories: string[] = [],
): Project {
  const links = p.links ?? {};
  const resources = normalizeLinks(links);
  const legacy = normalizeLinks({ other: p.link });
  const combined = [...resources, ...legacy].filter(
    (link, index, all) =>
      all.findIndex((item) => item.url === link.url) === index,
  );
  return {
    name: p.name,
    slug: p.slug || slugify(p.name),
    year: p.year ?? null,
    status: p.status ?? "",
    category: p.category ?? (p.tags ?? []).join(" / "),
    summary: p.one_line_purpose || p.description || "",
    description: p.description ?? "",
    built: p.personally_built ?? [],
    technologies: p.technologies ?? p.tags ?? [],
    metrics: Object.fromEntries(
      Object.entries(p.metrics ?? {}).filter(
        ([, value]) => value !== null && value !== undefined && value !== "",
      ),
    ) as Record<string, string | number>,
    engineering: p.technical_highlight ?? "",
    recognition:
      typeof p.recognition === "string"
        ? p.recognition
          ? [p.recognition]
          : []
        : (p.recognition ?? []),
    links: combined,
    categories,
    media: projectMedia(p.media ?? [], links),
    presentation: p.presentation ?? "auto",
  };
}
