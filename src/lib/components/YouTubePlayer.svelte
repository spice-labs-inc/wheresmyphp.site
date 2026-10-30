<script lang="ts">
  let {
    id,
    title = "YouTube video",
    poster
  }: { id: string; title?: string; poster?: string } = $props();

  // With a poster, nothing loads from YouTube until the viewer presses play.
  let playing = $state(false);
  let frame: HTMLIFrameElement | undefined = $state();

  const src = $derived.by(() => {
    const params = new URLSearchParams({
      rel: "0",
      iv_load_policy: "3",
      playsinline: "1",
      color: "white"
    });
    if (poster) {
      params.set("autoplay", "1");
      params.set("enablejsapi", "1");
      if (typeof location !== "undefined") params.set("origin", location.origin);
    }
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
  });

  function isEnded(data: unknown): boolean {
    if (typeof data !== "string") return false;
    try {
      const message: unknown = JSON.parse(data);
      if (!message || typeof message !== "object") return false;
      const info = "info" in message ? message.info : undefined;
      return (
        !!info && typeof info === "object" && "playerState" in info && info.playerState === 0
      );
    } catch {
      return false;
    }
  }

  // When the video ends, go back to the poster instead of YouTube's suggestions.
  $effect(() => {
    if (!poster || !playing || !frame) return;
    const target = frame;
    const listen = () =>
      target.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        "https://www.youtube-nocookie.com"
      );
    const onMessage = (e: MessageEvent) => {
      if (e.source === target.contentWindow && isEnded(e.data)) playing = false;
    };
    target.addEventListener("load", listen);
    window.addEventListener("message", onMessage);
    return () => {
      target.removeEventListener("load", listen);
      window.removeEventListener("message", onMessage);
    };
  });
</script>

<div class="shortcode-embed video">
  {#if poster && !playing}
    <button type="button" class="video-poster" onclick={() => (playing = true)}>
      <img src={poster} alt="" loading="lazy" />
      <span class="video-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="32" height="32">
          <path d="M8 5.5v13l10.5-6.5z" fill="currentColor"></path>
        </svg>
      </span>
      <span class="visually-hidden">Play video: {title}</span>
    </button>
  {:else}
    <iframe
      bind:this={frame}
      {src}
      {title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      loading="lazy"
    ></iframe>
  {/if}
</div>
