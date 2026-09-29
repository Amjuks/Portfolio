import data from "../../portfolio_data.json";
import { normalizeProject, type ProjectInput } from "./project";
export { data };
export type { Project } from "./project";
export { slugify } from "./project";
export const archiveCategories = data.portfolio_sections.archive.categories;
export const categories = archiveCategories.map((c) => c.id);
const normalize = (p: ProjectInput) =>
  normalizeProject(
    p,
    archiveCategories
      .filter((c) => c.project_order.includes(p.name))
      .map((c) => c.id),
  );
const detailed = (data.featured_projects as ProjectInput[]).map(normalize);
const rank = (name: string, order: string[]) => {
  const i = order.indexOf(name);
  return i < 0 ? Infinity : i;
};
export const featured = detailed
  .filter(
    (p) => data.featured_projects.find((d) => d.name === p.name)?.featured,
  )
  .sort(
    (a, b) =>
      rank(a.name, data.portfolio_sections.selected_work.project_order) -
      rank(b.name, data.portfolio_sections.selected_work.project_order),
  );
export const projects = [
  ...detailed,
  ...(data.project_archive as ProjectInput[]).map(normalize),
].sort(
  (a, b) =>
    rank(a.name, data.portfolio_sections.archive.project_order) -
    rank(b.name, data.portfolio_sections.archive.project_order),
);
const names = new Set(projects.map((p) => p.name));
if (
  names.size !== projects.length ||
  new Set(projects.map((p) => p.slug)).size !== projects.length
)
  throw Error("Project names and slugs must be unique");
const ids = new Set<string>();
for (const c of archiveCategories) {
  if (!c.id || c.id === "All" || c.id.includes(",") || ids.has(c.id))
    throw Error("Invalid archive category ID: " + c.id);
  ids.add(c.id);
}
for (const order of [
  data.portfolio_sections.archive.project_order,
  ...archiveCategories.map((c) => c.project_order),
]) {
  if (new Set(order).size !== order.length)
    throw Error("Duplicate archive project reference");
  for (const name of order)
    if (!names.has(name)) throw Error("Unknown archive project: " + name);
}
export const archiveOrder = Object.fromEntries(
  archiveCategories.map((c) => [
    c.id,
    c.project_order.map((name) => projects.find((p) => p.name === name)!.slug),
  ]),
);
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
