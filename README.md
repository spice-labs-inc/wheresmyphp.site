# Where's My PHP?: block-based SvelteKit + Sveltia CMS site

A deployable one-page marketing site, built with **SvelteKit** (static output), edited
through **Sveltia CMS**, and organized as a reorderable list of content **blocks** so
layout changes happen in the CMS, not in code.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) 3 + Svelte 5, with
  [adapter-static](https://kit.svelte.dev/docs/adapter-static) — the build emits a
  fully static site into `build/`. No server required.
- [Sveltia CMS](https://sveltiacms.app) — Git-based headless CMS at `/admin`. The
  Home page is an ordered `blocks` list in `src/content/site.json`; custom markdown
  editor components (cover, figure, youtube, embed) are registered in
  `static/admin/editor-components.js`.
- [zod](https://zod.dev) — the block list is a **discriminated union**
  (`src/lib/content.ts`) validated at build time, so a malformed CMS edit fails
  `pnpm build` instead of rendering undefined.
- Design system ported from the Spice Labs site: Epilogue font, tokens, rlh
  baseline rhythm in `src/app.css`.

## Development

```sh
pnpm install
pnpm dev        # http://localhost:5173  (admin at /admin)
pnpm check      # svelte-check type checking
pnpm test       # vitest: content contract + shortcode parser
pnpm build      # static site into ./build/
pnpm preview    # serve the built site locally
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/routes/+layout.svelte` | HTML shell, header, footer, meta tags |
| `src/routes/+page.svelte` | Renders the `blocks` list through `Block.svelte` |
| `src/lib/content.ts` | zod discriminated-union contract for blocks; validates `site.json` at build |
| `src/lib/components/Block.svelte` | Switch that narrows each block to its type renderer |
| `src/lib/components/*Block.svelte` | Per-type renderers (hero, content, steps, features, cards, quote, cta-band, resources) |
| `src/lib/components/Markdown.svelte` | Renders markdown bodies; parses `{{< … >}}` embeds |
| `src/lib/markdown/parse.ts` | Shortcode parser + toBlock templates (parity with `editor-components.js`) |
| `src/content/site.json` | The blocks list + footer (CMS-edited) |
| `src/content/site-config.json` | Site-wide values (name, brand, URLs) — code-managed, not in the CMS |
| `src/app.css` | Design tokens + all styles; blocks use `.block-<type>` classes |
| `static/admin/config.yml` | Sveltia CMS schema (blocks list + footer) |
| `static/admin/editor-components.js` | Custom markdown components (cover, figure, youtube, embed) |
| `static/CNAME` | Custom domain (wheresmyphp.spicelabs.io) for GitHub Pages |
| `static/` | Fonts, logo, images |
| `tests/` | vitest suites for the content contract and shortcode parser |

## Blocks

Block types: `hero`, `content` (variants default/split/reversed/grid/center),
`steps`, `features` (accordion), `cards`, `quote`, `cta-band`,
`resources`. Each block has only the fields its type needs; unknown types or missing
required fields fail the build.

Bodies are markdown and can embed components the CMS inserts from the Insert menu:
`{{< cover src="…" caption="…" >}}`, `{{< figure images="a.png,b.png" … >}}`,
`{{< youtube id="…" … >}}`, `{{< embed url="…" title="…" >}}`. The site parser in
`src/lib/markdown/parse.ts` consumes exactly the strings the editor produces.

### Adding a block type

1. Add the member to the union in `src/lib/content.ts` (schema + inferred type).
2. Write a `src/lib/components/MyTypeBlock.svelte` and register it in `Block.svelte`.
3. Add the type option in `static/admin/config.yml`.
4. Add a case to `tests/content.test.ts`.

## Editing content

Log in at `/admin` → the **Home** singleton: reorder, duplicate, and edit blocks;
markdown bodies support the embed components. `src/content/site.json` is the admin
of record. Site-wide values (site_name, brand_name, site_description, site_url,
site_domain) live in `src/content/site-config.json` and are not exposed in the CMS.

## Placeholders to replace

- Block copy in `src/content/site.json` (or via /admin) — PHP2Shell campaign copy
- `static/logomark.svg`, `static/favicon.svg`
- `static/images/*` (sample SVGs from the Spice Labs site)
- Footer links pointing at `#` (`footer_links` in site.json)

## Deployment

Same GitHub Pages setup as the Spice Labs website, powered by
`.github/workflows/deploy.yml`:

- Push `main` (or run manually): pnpm install → `pnpm build` → deploy `build/`
  to GitHub Pages via `actions/deploy-pages`.
- `static/CNAME` pins `wheresmyphp.spicelabs.io`; DNS:
  `CNAME wheresmyphp.spicelabs.io → spice-labs-inc.github.io`.
- Any static host works: build command `pnpm build`, output `build/`.

## Sveltia CMS setup (first deploy)

1. Push this repo to GitHub.
2. In `static/admin/config.yml` set `backend.repo` (currently
   `spice-labs-inc/wheresmyphp.site`) and `backend.branch`.
3. Point `backend.base_url` at a Sveltia CMS auth service — reuse the Spice Labs
   auth worker or set up your own (https://sveltiacms.app/docs/start).
4. Deploy, then edit at `https://wheresmyphp.spicelabs.io/admin`.

## Credits / provenance

Design, fonts, images and copy structure from the Spice Labs website
(https://github.com/spice-labs-inc/website). Custom editor components follow the
Sveltia CMS API (https://sveltiacms.app/en/docs/api/editor-components).
