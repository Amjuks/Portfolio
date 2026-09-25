import data from "../../portfolio_data.json";
export { data };
import { normalizeLinks, projectMedia, type Media } from "./media";
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const categories = [
  "AI",
  "Data",
  "Systems",
  "Web",
  "Bots",
  "Robotics",
  "Research",
  "Early",
];
export function classify(text: string) {
  const rules = [
    /ai|llm|learning|cnn|gan|nlp|transformer|vision/i,
    /data|pipeline/i,
    /system|simulation|blockchain|backend/i,
    /web|frontend|html|javascript|full-stack/i,
    /bot|automation/i,
    /robot|embedded|esp32/i,
    /research|medical|simulation|classification/i,
    /freelance|landing|sentiment|pokémon|novel|social media|portfolio website/i,
  ];
  return categories.filter((_, i) => rules[i].test(text));
}
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
const detailed: Project[] = data.featured_projects.map((p) => ({
  name: p.name,
  slug: p.slug,
  year: p.year,
  status: p.status,
  category: p.category,
  summary: p.one_line_purpose,
  description: p.description,
  built: p.personally_built,
  technologies: p.technologies,
  metrics: Object.fromEntries(
    Object.entries(p.metrics).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number>,
  engineering: p.technical_highlight,
  recognition: "recognition" in p ? (p.recognition ?? []) : [],
  links: normalizeLinks(p.links),
  categories: classify(`${p.category} ${p.technologies.join(" ")}`),
  media: projectMedia(p.media as Media[], p.links),
  presentation: p.presentation,
}));
const order = (name: string) => {
  const i = data.portfolio_sections.selected_work.project_order.indexOf(name);
  return i < 0 ? Infinity : i;
};
export const featured = detailed
  .filter(
    (p) => data.featured_projects.find((d) => d.slug === p.slug)?.featured,
  )
  .sort((a, b) => order(a.name) - order(b.name));
export const projects: Project[] = [
  ...detailed,
  ...data.project_archive.map((p) => ({
    name: p.name,
    slug: slugify(p.name),
    year: p.year,
    status: "",
    category: p.tags.join(" / "),
    summary: p.description,
    description: p.description,
    built: [],
    technologies: p.tags,
    metrics: {},
    engineering: "",
    recognition: "recognition" in p && p.recognition ? [p.recognition] : [],
    links: normalizeLinks({ other: p.link, ...p.links }),
    categories: classify(`${p.name} ${p.tags.join(" ")}`),
    media: projectMedia(p.media as Media[], p.links),
    presentation: p.presentation,
  })),
];
export const date = (value: string | null) =>
  value
    ? new Date(`${value}-01`).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Present";
export const areas = [
  { name: "AI & Machine Learning", skills: data.skills.ai_ml, filter: "AI" },
  {
    name: "Software Engineering",
    skills: [...data.skills.programming_languages, ...data.skills.backend_web],
    filter: "Web",
  },
  {
    name: "Data & Infrastructure",
    skills: [...data.skills.data, ...data.skills.infrastructure],
    filter: "Data",
  },
  {
    name: "Applied Engineering",
    skills: data.skills.robotics_embedded,
    filter: "Robotics",
  },
];
