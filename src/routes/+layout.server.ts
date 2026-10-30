import config from "#content/site-config.json";
import { currentVideoId } from "#lib/videos";

export const prerender = true;

export async function load({ fetch }) {
  const videoId = await currentVideoId(fetch, config.video.docs_video, config.video.id);
  return { followedVideos: { [config.video.docs_video]: videoId }, videoId };
}
