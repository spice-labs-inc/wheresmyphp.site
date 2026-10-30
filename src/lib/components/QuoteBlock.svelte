<script lang="ts">
  import type { Block } from "#lib/content";
  import Markdown from "./Markdown.svelte";

  let { block }: { block: Extract<Block, { type: "quote" }> } = $props();
</script>

<section class="block block-quote">
  <div class="inner">
    <blockquote>
      <Markdown body={block.body} />
    </blockquote>
    {#if block.attribution}
      <footer>{block.attribution}</footer>
    {/if}
  </div>
</section>
