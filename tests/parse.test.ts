import { describe, expect, it } from "vitest";
import {
  parseAttrs,
  parseBody,
  toCoverBlock,
  toFigureBlock,
  toYoutubeBlock
} from "#lib/markdown/parse";

describe("parseAttrs", () => {
  it('parses key="value" pairs', () => {
    expect(parseAttrs(' src="/img/a.png" caption="A cat" ')).toEqual({
      src: "/img/a.png",
      caption: "A cat"
    });
  });

  it("handles empty input", () => {
    expect(parseAttrs("")).toEqual({});
  });
});

describe("parseBody", () => {
  it("splits text and shortcodes", () => {
    const parts = parseBody(
      'before\n\n{{< cover src="/img/a.png" caption="Title" >}}\n\nafter'
    );
    expect(parts).toHaveLength(3);
    expect(parts[0]).toEqual({ kind: "text", text: "before\n\n" });
    expect(parts[1]).toEqual({
      kind: "shortcode",
      code: { name: "cover", attrs: { src: "/img/a.png", caption: "Title" } }
    });
    expect(parts[2]).toEqual({ kind: "text", text: "\n\nafter" });
  });

  it("handles multiple shortcodes", () => {
    const parts = parseBody(
      '{{< youtube id="abc123" >}} plus {{< youtube id="def456" >}}'
    );
    expect(parts.filter((p) => p.kind === "shortcode")).toHaveLength(2);
  });

  it("round-trips toBlock output", () => {
    const body = toCoverBlock({ src: "/img/x.png", caption: "X" }) + "\n\n" + toYoutubeBlock({ id: "y" });
    const embedded = parseBody(body).filter((p) => p.kind === "shortcode");
    expect(embedded[0]).toMatchObject({
      kind: "shortcode",
      code: { name: "cover", attrs: { src: "/img/x.png", caption: "X" } }
    });
    expect(embedded[1]).toMatchObject({
      kind: "shortcode",
      code: { name: "youtube", attrs: { id: "y" } }
    });
  });

  it("round-trips a youtube embed with a title and poster", () => {
    const body = toYoutubeBlock({ id: "y", title: "A demo", poster: "/images/p.jpg" });
    expect(parseBody(body)).toEqual([
      {
        kind: "shortcode",
        code: { name: "youtube", attrs: { id: "y", title: "A demo", poster: "/images/p.jpg" } }
      }
    ]);
  });

  it("round-trips a youtube embed that follows a docs video", () => {
    const body = toYoutubeBlock({ id: "y", title: "A", poster: "/p.jpg", docsVideo: "wheres-my-php" });
    expect(parseBody(body)).toEqual([
      {
        kind: "shortcode",
        code: {
          name: "youtube",
          attrs: { id: "y", title: "A", poster: "/p.jpg", "docs-video": "wheres-my-php" }
        }
      }
    ]);
  });

  it("leaves arbitrary braces as text", () => {
    const parts = parseBody("{{ not a shortcode }}");
    expect(parts).toEqual([{ kind: "text", text: "{{ not a shortcode }}" }]);
  });

  it("handles the figure list form", () => {
    const body = toFigureBlock({ images: ["/a.png", "/b.png"], caption: "Two" });
    const [part] = parseBody(body);
    expect(part).toMatchObject({
      kind: "shortcode",
      code: { name: "figure", attrs: { images: "/a.png,/b.png", caption: "Two" } }
    });
  });
});
