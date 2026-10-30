import { describe, expect, it } from "vitest";
import { blockSchema, site, siteSchema } from "#lib/content";

const validBlocks = [
  { type: "hero", title: "Where's My PHP?", body: "Which PHP is inside your image?" },
  { type: "content", body: "Some **markdown** body." },
  { type: "steps", items: [{ label: "Step 01", title: "Pull", text: "Fetch." }] },
  { type: "features", items: [{ title: "Security", text: "Scan." }] },
  { type: "cards", items: [{ title: "Evidence", text: "Layers." }] },
  { type: "quote", body: "Which PHP is inside the image?" },
  { type: "cta-band", title: "Try it", cta: { label: "Go", url: "/#contact" } },
  { type: "resources", items: [{ title: "A walkthrough", type: "Guide", url: "https://example.com" }] }
];

describe("site schema", () => {
  it("parses the shipped site.json", () => {
    expect(site.blocks.length).toBeGreaterThan(0);
    expect(siteSchema.safeParse(JSON.parse(JSON.stringify(site))).success).toBe(true);
  });

  it("accepts every block type", () => {
    for (const block of validBlocks) {
      expect(blockSchema.safeParse(block).success, JSON.stringify(block)).toBe(true);
    }
  });

  it("rejects an unknown type", () => {
    const bad = { type: "mystery", title: "x" };
    expect(blockSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a hero without a title", () => {
    expect(blockSchema.safeParse({ type: "hero", body: "missing title" }).success).toBe(false);
  });

  it("rejects a content block without a body", () => {
    expect(blockSchema.safeParse({ type: "content", title: "no body" }).success).toBe(false);
  });

  it("rejects steps/cards with no items", () => {
    expect(blockSchema.safeParse({ type: "steps", items: [] }).success).toBe(false);
    expect(blockSchema.safeParse({ type: "cards", items: [] }).success).toBe(false);
  });

  it("rejects a site with a malformed block", () => {
    const badSite = { ...site, blocks: [...site.blocks, { type: "hero" }] };
    expect(siteSchema.safeParse(badSite).success).toBe(false);
  });
});
