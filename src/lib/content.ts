import { z } from "zod";
import siteJson from "#content/site.json";

/**
 * Discriminated-union contract for the block-based home page.
 * The CMS edits src/content/site.json; parse() runs at build/prerender time so a
 * malformed CMS edit fails the build instead of rendering undefined.
 */

export const ctaSchema = z.object({
  label: z.string().min(1),
  url: z.string()
});
export type Cta = z.infer<typeof ctaSchema>;

export const layoutVariantSchema = z.enum(["default", "split", "reversed", "grid", "center"]);
export type LayoutVariant = z.infer<typeof layoutVariantSchema>;

export const itemLabelTitleTextSchema = z.object({
  label: z.string(),
  title: z.string(),
  text: z.string(),
  image: z.string().optional()
});
export type StepItem = z.infer<typeof itemLabelTitleTextSchema>;

export const itemTitleTextSchema = z.object({
  title: z.string(),
  text: z.string()
});
export type TitleTextItem = z.infer<typeof itemTitleTextSchema>;

const blockSchemas = {
  hero: z.object({
    type: z.literal("hero"),
    title: z.string().min(1),
    body: z.string().optional(),
    image: z.string().optional(),
    cta: ctaSchema.optional()
  }),
  content: z.object({
    type: z.literal("content"),
    variant: layoutVariantSchema.optional(),
    title: z.string().optional(),
    body: z.string().min(1),
    image: z.string().optional(),
    cta: ctaSchema.optional()
  }),
  steps: z.object({
    type: z.literal("steps"),
    title: z.string().optional(),
    items: z.array(itemLabelTitleTextSchema).min(1)
  }),
  features: z.object({
    type: z.literal("features"),
    title: z.string().optional(),
    items: z.array(itemTitleTextSchema).min(1)
  }),
  cards: z.object({
    type: z.literal("cards"),
    title: z.string().optional(),
    items: z.array(itemTitleTextSchema).min(1)
  }),
  quote: z.object({
    type: z.literal("quote"),
    body: z.string().min(1),
    attribution: z.string().optional()
  }),
  "cta-band": z.object({
    type: z.literal("cta-band"),
    title: z.string().min(1),
    body: z.string().optional(),
    cta: ctaSchema.optional()
  }),
  resources: z.object({
    type: z.literal("resources"),
    items: z
      .array(
        z.object({
          title: z.string(),
          type: z.string(),
          url: z.string()
        })
      )
      .min(1)
  })
} as const;

export const blockSchema = z.discriminatedUnion("type", [
  blockSchemas.hero,
  blockSchemas.content,
  blockSchemas.steps,
  blockSchemas.features,
  blockSchemas.cards,
  blockSchemas.quote,
  blockSchemas["cta-band"],
  blockSchemas.resources
]);
export type Block = z.infer<typeof blockSchema>;

export const siteSchema = z.object({
  blocks: z.array(blockSchema),
  footer_links: z.array(
    z.object({
      label: z.string(),
      url: z.string()
    })
  ),
  footer_text: z.string()
});
export type Site = z.infer<typeof siteSchema>;

/** Validated home-page model; throws at build time on a bad CMS edit. */
export const site: Site = siteSchema.parse(siteJson);
