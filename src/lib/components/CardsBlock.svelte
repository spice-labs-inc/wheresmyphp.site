<script lang="ts">
  import type { Block } from "#lib/content";

  let { block }: { block: Extract<Block, { type: "cards" }> } = $props();
</script>

<section class="block block-cards">
  <div class="inner">
    {#if block.title}<h2>{block.title}</h2>{/if}
    <div class="card-flow">
      {#each block.items as item, i (item.title)}
        <article class="card">
          <span class="num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{item.title}</h3>
          <div class="card-bottom">
            <p>{item.text}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
