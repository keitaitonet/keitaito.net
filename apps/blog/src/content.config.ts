import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
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
  schema: z.object({
    name: z.string(),
    icon_url: z.url(),
  }),
});

export const collections = { activities, articles, skills };
