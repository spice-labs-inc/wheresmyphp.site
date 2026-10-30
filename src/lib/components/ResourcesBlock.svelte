<script lang="ts">
  import type { Block } from "#lib/content";

  let { block }: { block: Extract<Block, { type: "resources" }> } = $props();
</script>

<section class="block block-resources">
  <div class="inner">
    <h2>Resources</h2>
    <div class="grid">
      {#each block.items as card (card.title)}
        <a class="card" href={card.url} target="_blank" rel="noreferrer">
          <h3>{card.type}</h3>
          <p>{card.title}</p>
        </a>
      {/each}
    </div>
  </div>
</section>
