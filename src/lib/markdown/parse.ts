/**
 * Shortcode parser for markdown block bodies.
 *
 * Editor parity: Sveltia CMS editor components (static/admin/editor-components.js)
 * insert the exact {{< name key="value" ... >}} strings this parser consumes, so the
 * admin preview and the built site render the same embeds.
 */

const SHORTCODE_RE = /\{\{<\s*([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*>\}\}/g;
const ATTR_RE = /([\w-]+)="([^"]*)"/g;

export interface Shortcode {
  name: string;
  attrs: Record<string, string>;
}

export type BodyPart = { kind: "text"; text: string } | { kind: "shortcode"; code: Shortcode };

/** Split a markdown body into text runs and shortcode embeds. */
export function parseBody(body: string): BodyPart[] {
  const parts: BodyPart[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  SHORTCODE_RE.lastIndex = 0;
  while ((match = SHORTCODE_RE.exec(body)) !== null) {
    if (match.index > last) parts.push({ kind: "text", text: body.slice(last, match.index) });
    parts.push({ kind: "shortcode", code: { name: match[1], attrs: parseAttrs(match[2] ?? "") } });
    last = match.index + match[0].length;
  }
  if (last < body.length) parts.push({ kind: "text", text: body.slice(last) });
  return parts;
}

/** Parse a run of key="value" pairs. */
export function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let match: RegExpExecArray | null;
  ATTR_RE.lastIndex = 0;
  while ((match = ATTR_RE.exec(raw)) !== null) attrs[match[1]] = match[2];
  return attrs;
}

/* toBlock templates — the same strings the admin editor components insert. */
export const toCoverBlock = (v: { src: string | undefined; caption?: string }) =>
  `{{< cover src="${v.src ?? ""}" caption="${v.caption ?? ""}" >}}`;

export const toFigureBlock = (v: { images: string[] | undefined; caption?: string }) =>
  `{{< figure images="${(v.images ?? []).join(",")}" caption="${v.caption ?? ""}" >}}`;

export const toYoutubeBlock = (v: {
  id: string | undefined;
  title?: string;
  poster?: string;
  docsVideo?: string;
}) =>
  `{{< youtube id="${v.id ?? ""}" title="${v.title ?? ""}" poster="${v.poster ?? ""}"${v.docsVideo ? ` docs-video="${v.docsVideo}"` : ""} >}}`;

export const toEmbedBlock = (v: { url: string | undefined; title?: string }) =>
  `{{< embed url="${v.url ?? ""}" title="${v.title ?? ""}" >}}`;
