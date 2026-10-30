<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import { setContext } from "svelte";
  import config from "#content/site-config.json";
  import site from "#content/site.json";

  let { data, children }: { data: { followedVideos: Record<string, string>; videoId: string }; children: Snippet } = $props();

  setContext("followed-videos", () => data.followedVideos);

  // VideoObject data so search results can show the embedded video.
  const videoData = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: config.video.name,
    description: config.video.description,
    thumbnailUrl: config.site_url + config.video.thumbnail,
    uploadDate: config.video.upload_date,
    duration: config.video.duration,
    embedUrl: `https://www.youtube-nocookie.com/embed/${data.videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${data.videoId}`
  }).replaceAll("<", "\\u003c"));

  // Google Analytics for this site's own property, the same gtag snippet spicelabs.io uses.
  function analyticsTags(id: string): string {
    const safe = JSON.stringify(id);
    return (
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}"><\/script>` +
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",${safe});<\/script>`
    );
  }
</script>

<svelte:head>
  <title>{config.site_name}</title>
  <meta name="description" content={config.site_description} />
  <meta name="keywords" content={config.keywords} />
  <link rel="canonical" href="{config.site_url}/" />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${videoData}</script>`}
  {#if config.ga_measurement_id}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html analyticsTags(config.ga_measurement_id)}
  {/if}
  <meta property="og:url" content={config.site_url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={config.site_name} />
  <meta property="og:description" content={config.site_description} />
  <meta property="og:image" content="{config.site_url}/images/preview.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content={config.site_domain} />
  <meta property="twitter:url" content={config.site_url} />
  <meta name="twitter:title" content={config.site_name} />
  <meta name="twitter:description" content={config.site_description} />
  <meta name="twitter:image" content="{config.site_url}/images/preview.png" />
</svelte:head>

<div id="container">
  <header id="header">
    <div class="inner">
      <a id="logo" href="/" aria-label={config.brand_name}>
        <img class="logo-mark" src="/logomark.svg" alt="" />
        <span class="wordmark">{config.brand_name}</span>
      </a>
    </div>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
    <div id="footer">
      <div id="logo">
        <img class="logo-mark" src="/logomark.svg" alt="" />
        <span class="wordmark">{config.brand_name}</span>
      </div>
      <nav class="nav">
        <ul>
          {#each site.footer_links as link (link.url)}
            <li><a href={link.url}>{link.label}</a></li>
          {/each}
        </ul>
      </nav>
      <div class="copyright">{site.footer_text}</div>
    </div>
  </footer>
</div>
