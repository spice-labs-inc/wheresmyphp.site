<script lang="ts">
  import type { Block } from "#lib/content";
  import HeroBlock from "./HeroBlock.svelte";
  import ContentBlock from "./ContentBlock.svelte";
  import StepsBlock from "./StepsBlock.svelte";
  import FeaturesBlock from "./FeaturesBlock.svelte";
  import CardsBlock from "./CardsBlock.svelte";
  import QuoteBlock from "./QuoteBlock.svelte";
  import CtaBandBlock from "./CtaBandBlock.svelte";
  import ResourcesBlock from "./ResourcesBlock.svelte";

  let { block, index }: { block: Block; index: number } = $props();
</script>

<!-- The switch narrows to the exact union member, so required fields are typed. -->
{#if block.type === "hero"}
  <HeroBlock block={block} />
{:else if block.type === "content"}
  <ContentBlock block={block} />
{:else if block.type === "steps"}
  <StepsBlock block={block} />
{:else if block.type === "features"}
  <FeaturesBlock block={block} />
{:else if block.type === "cards"}
  <CardsBlock block={block} />
{:else if block.type === "quote"}
  <QuoteBlock block={block} />
{:else if block.type === "cta-band"}
  <CtaBandBlock block={block} />
{:else if block.type === "resources"}
  <ResourcesBlock block={block} />
{/if}
