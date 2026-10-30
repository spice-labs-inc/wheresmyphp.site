<script lang="ts">
  import type { Block } from "#lib/content";
  import Markdown from "./Markdown.svelte";

  let { block }: { block: Extract<Block, { type: "cta-band" }> } = $props();
</script>

<section class="block block-cta-band">
  <div class="inner">
    <h2>{block.title}</h2>
    {#if block.body}<Markdown body={block.body} />{/if}
    {#if block.cta}
      <div class="ctas"><a class="button" href={block.cta.url} rel="noreferrer">{block.cta.label}</a></div>
    {/if}
  </div>
</section>
