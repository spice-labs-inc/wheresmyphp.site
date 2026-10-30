<script lang="ts">
  import type { Block } from "#lib/content";
  import Markdown from "./Markdown.svelte";

  let { block }: { block: Extract<Block, { type: "hero" }> } = $props();
</script>

<section class="block block-hero">
  <div class="inner">
    <div class="bg-diamonds"></div>
    {#if block.image}
      <div class="hero-image">
        <img src={block.image} alt="" />
      </div>
    {/if}
    <div class="hero-content">
      <div class="hero-header">
        <h1>{block.title}</h1>
      </div>
      <div class="hero-text">
        {#if block.body}<Markdown body={block.body} />{/if}
        {#if block.cta}
          <div class="ctas">
            <a class="button" href={block.cta.url} rel="noreferrer">{block.cta.label}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
