<!-- Home page: a reorderable list of blocks, edited via /admin (Sveltia CMS). -->
<script lang="ts">
  import { site } from "#lib/content";
  import Block from "#lib/components/Block.svelte";
</script>

{#each site.blocks as block, i (i)}
  <Block {block} index={i} />
{/each}
