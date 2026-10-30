<script lang="ts">
  import type { Block } from "#lib/content";

  let { block }: { block: Extract<Block, { type: "steps" }> } = $props();
</script>

<section class="block block-steps">
  <div class="inner">
    {#if block.title}<h2 class="section-title">{block.title}</h2>{/if}
    {#each block.items as item, i (item.title)}
      <div class="step" class:flip={i % 2 === 1}>
        <div class="media">
          {#if item.image}
            <img src={item.image} alt={item.title} />
          {/if}
        </div>
        <div class="content">
          <h3>
            {#if item.label}<small>{item.label}</small>{/if}
            {item.title}
          </h3>
          <p>{item.text}</p>
        </div>
      </div>
    {/each}
  </div>
</section>
