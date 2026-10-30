/** The public docs page that forwards to a demo video's current YouTube upload. */
export function docsVideoUrl(slug: string): string {
  return `https://docs.spicelabs.io/docs/videos/${encodeURIComponent(slug)}/youtube/`;
}

const WATCH_ID = /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/;

/** The YouTube id a docs forwarding page points at, or undefined when it names none. */
export function forwardedVideoId(html: string): string | undefined {
  return WATCH_ID.exec(html)?.[1];
}

/**
 * The current upload of a docs demo video, read when the site is built. The
 * docs list only has the video once it has been recorded, so
 * any failure keeps the id the site was written with.
 */
export async function currentVideoId(
  fetchFn: typeof fetch,
  slug: string,
  fallback: string
): Promise<string> {
  try {
    const res = await fetchFn(docsVideoUrl(slug));
    if (!res.ok) return fallback;
    return forwardedVideoId(await res.text()) ?? fallback;
  } catch {
    return fallback;
  }
}
