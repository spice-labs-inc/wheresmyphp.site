<script lang="ts">
  import type { Block } from "#lib/content";
  import Markdown from "./Markdown.svelte";

  let { block }: { block: Extract<Block, { type: "content" }> } = $props();
  const variant = $derived(block.variant ?? "default");
</script>

<section class="block block-content" class:split={variant === "split" || variant === "reversed"} class:reversed={variant === "reversed"} class:center={variant === "center"} class:grid={variant === "grid"}>
  <div class="inner">
    {#if block.title}<h2>{block.title}</h2>{/if}
    {#if block.body}<Markdown body={block.body} />{/if}
    {#if block.cta}
      <div class="ctas"><a class="button" href={block.cta.url} rel="noreferrer">{block.cta.label}</a></div>
    {/if}
    {#if variant === "split" || variant === "reversed"}
      {#if block.image}
        <div class="media">
          <img src={block.image} alt="" />
        </div>
      {/if}
    {/if}
  </div>
</section>
