<script lang="ts">
  import { getContext } from "svelte";
  import type { Shortcode } from "#lib/markdown/parse";
  import YouTubePlayer from "./YouTubePlayer.svelte";

  let { code }: { code: Shortcode } = $props();
  const attrs = $derived(code.attrs);

  // A docs-video embed plays the docs video's current upload when the build could read it.
  const followed = getContext<(() => Record<string, string>) | undefined>("followed-videos");
  const youtubeId = $derived(
    (attrs["docs-video"] && followed?.()[attrs["docs-video"]]) || attrs.id
  );
</script>

{#if code.name === "cover"}
  <figure class="shortcode-embed cover">
    {#if attrs.src}<img src={attrs.src} alt="" />{/if}
    {#if attrs.caption}<figcaption>{attrs.caption}</figcaption>{/if}
  </figure>
{:else if code.name === "figure"}
  <figure class="shortcode-embed gallery">
    {#each (attrs.images ?? "").split(",").filter(Boolean) as src (src)}
      <img src={src} alt="" loading="lazy" />
    {/each}
    {#if attrs.caption}<figcaption>{attrs.caption}</figcaption>{/if}
  </figure>
{:else if code.name === "youtube"}
  {#if attrs.id}
    <YouTubePlayer id={youtubeId} title={attrs.title || undefined} poster={attrs.poster || undefined} />
  {/if}
{:else if code.name === "embed"}
  <div class="shortcode-embed video">
    {#if attrs.url}
      <iframe src={attrs.url} title={attrs.title ?? "Embedded content"} loading="lazy" referrerpolicy="no-referrer"></iframe>
    {/if}
  </div>
{/if}
