import { describe, expect, it } from "vitest";
import { currentVideoId, docsVideoUrl, forwardedVideoId } from "#lib/videos";

const forwarding = (id: string) =>
  `<meta http-equiv="refresh" content="0; url=https://www.youtube.com/watch?v=${id}" />`;

describe("the docs video the page follows", () => {
  it("is read from the docs page that forwards to its current upload", () => {
    expect(docsVideoUrl("wheres-my-php")).toBe(
      "https://docs.spicelabs.io/docs/videos/wheres-my-php/youtube/"
    );
    expect(forwardedVideoId(forwarding("9lTyjasimU8"))).toBe("9lTyjasimU8");
    expect(forwardedVideoId("<p>no video</p>")).toBeUndefined();
  });

  it("uses the current upload when the docs page answers", async () => {
    const fetchFn = (async () => new Response(forwarding("NEWid_12345"))) as typeof fetch;
    expect(await currentVideoId(fetchFn, "wheres-my-php", "eBQLlPeMx6o")).toBe("NEWid_12345");
  });

  it("keeps the written id when the docs list does not have the video or cannot be reached", async () => {
    const missing = (async () => new Response("not found", { status: 404 })) as typeof fetch;
    const down = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    expect(await currentVideoId(missing, "wheres-my-php", "eBQLlPeMx6o")).toBe("eBQLlPeMx6o");
    expect(await currentVideoId(down, "wheres-my-php", "eBQLlPeMx6o")).toBe("eBQLlPeMx6o");
  });
});
