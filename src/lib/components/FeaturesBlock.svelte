<script lang="ts">
  import type { Block } from "#lib/content";

  let { block }: { block: Extract<Block, { type: "features" }> } = $props();
</script>

<section class="block block-features">
  <div class="inner">
    <div class="audience-grid">
      <div class="left">
        {#if block.title}<h2 class="section-title">{block.title}</h2>{/if}
      </div>
      <div class="right">
        {#each block.items as item, i (item.title)}
          <details class="item" name="features" open={i === 0}>
            <summary class="label">{item.title}</summary>
            <p>{item.text}</p>
          </details>
        {/each}
      </div>
    </div>
  </div>
</section>
