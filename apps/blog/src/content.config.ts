import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const activities = defineCollection({
  loader: file("src/data/activities.json"),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
  }),
});

const articles = defineCollection({
  loader: file("src/data/articles.json"),
  schema: z.object({
    title: z.string(),
    url: z.url(),
    liked_count: z.number(),
    published_at: z.coerce.date(),
    source: z.enum(["qiita", "zenn"]),
  }),
});

const skills = defineCollection({
  loader: file("src/data/skills.json"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      icon: image(),
    }),
});

const works = defineCollection({
  loader: glob({ base: "./src/data/works", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()),
      thumbnail: image(),
    }),
});

export const collections = { activities, articles, skills, works };
