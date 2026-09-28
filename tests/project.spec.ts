import { test, expect } from "@playwright/test";
import { normalizeProject, type ProjectInput } from "../src/lib/project";

test("one project schema preserves detailed fields and legacy archive resources", () => {
  const input: ProjectInput = {
    name: "Complete archive entry",
    slug: "stable-url",
    year: 2025,
    status: "completed",
    category: "Research",
    one_line_purpose: "Short purpose",
    description: "Full account",
    personally_built: ["Pipeline"],
    technologies: ["PyTorch"],
    tags: ["Legacy tag"],
    metrics: { accuracy: "92%", failures: 0, missing: null },
    technical_highlight: "Engineering decision",
    recognition: ["Competition result"],
    link: "https://example.com/legacy",
    links: {
      github: ["https://github.com/example/repo"],
      other: [{ label: "Report", url: "https://example.com/report" }],
      video: "https://youtu.be/M7lc1UVf-VE",
    },
    media: [
      {
        src: "projects/example/image.png",
        alt: "Actual result",
        fit: "cover",
        position: "top left",
      },
    ],
  };
  const result = normalizeProject(input);
  expect(result).toMatchObject({
    slug: "stable-url",
    status: "completed",
    category: "Research",
    summary: "Short purpose",
    description: "Full account",
    built: ["Pipeline"],
    technologies: ["PyTorch"],
    metrics: { accuracy: "92%", failures: 0 },
    engineering: "Engineering decision",
    recognition: ["Competition result"],
  });
  expect(result.metrics).not.toHaveProperty("missing");
  expect(result.links.map((link) => link.url)).toContain(
    "https://example.com/legacy",
  );
  expect(result.links.map((link) => link.url)).toContain(
    "https://example.com/report",
  );
  expect(result.media[0]).toMatchObject({ fit: "cover", position: "top left" });
  expect(result.media[1].type).toBe("youtube");
  expect(normalizeProject({ ...input, featured: true })).toEqual(result);
  const legacy = normalizeProject({
    name: "Older project",
    description: "Existing description",
    tags: ["Python"],
    recognition: "Winner",
    link: "https://example.com",
    links: { other: "https://example.com" },
  });
  expect(legacy).toMatchObject({
    slug: "older-project",
    summary: "Existing description",
    technologies: ["Python"],
    recognition: ["Winner"],
    built: [],
    metrics: {},
    media: [],
  });
  expect(legacy.links).toHaveLength(1);
});
