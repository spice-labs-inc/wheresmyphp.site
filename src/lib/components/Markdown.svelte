<!-- eslint-disable svelte/no-at-html-tags -->
<script lang="ts">
  import { marked } from "marked";
  import { parseBody } from "#lib/markdown/parse";
  import Shortcode from "./Shortcode.svelte";

  let { body }: { body: string } = $props();

  function render(text: string): string {
    const html = marked.parse(text);
    return typeof html === "string" ? html : "";
  }
</script>

{#each parseBody(body) as part, i (i)}
  {#if part.kind === "text"}
    {@html render(part.text)}
  {:else}
    <Shortcode code={part.code} />
  {/if}
{/each}
