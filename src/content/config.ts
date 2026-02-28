import { defineCollection, z } from "astro:content";

const work = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
    readTime: z.string(),
    coverImage: z.string(),
    coverImagePosition: z.enum(["left", "right"]).optional(),
    status: z.enum(["active", "paused", "archived"]).optional(),
    startDate: z.string().optional(),
    url: z.string().url().optional(),
    featuredIndex: z.number().optional(),
    featuredLayout: z.enum(["card", "horizontal"]).optional(),
  }),
});

export const collections = { work };
