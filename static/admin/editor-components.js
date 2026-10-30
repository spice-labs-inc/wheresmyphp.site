/* Custom markdown editor components for Sveltia CMS.
 * These insert {{< name key="value" ... >}} shortcodes that the site renders
 * through src/lib/markdown/parse.ts + src/lib/components/Shortcode.svelte —
 * keep the patterns and toBlock templates in sync with that parser.
 */
(function () {
  function registerAll() {
    if (!window.CMS) {
      // Sveltia bundle is a module; retry until the global is present.
      setTimeout(registerAll, 200);
      return;
    }

    const CMS = window.CMS;

    CMS.registerEditorComponent({
      id: "cover",
      label: "Cover",
      icon: "wallpaper",
      fields: [
        { name: "src", label: "Image", widget: "image" },
        { name: "caption", label: "Caption", widget: "string" }
      ],
      pattern: /{{< cover src="(?<src>.*?)" caption="(?<caption>.*?)" >}}/,
      toBlock: ({ src = "", caption = "" }) =>
        `{{< cover src="${src}" caption="${caption}" >}}`,
      toPreview: ({ src = "", caption = "" }) =>
        src
          ? `<figure style="margin:1em 0;"><img src="${src}" alt="" style="width:100%;display:block;"/><figcaption style="opacity:.7;text-align:center;">${caption}</figcaption></figure>`
          : ""
    });

    CMS.registerEditorComponent({
      id: "figure",
      label: "Figure",
      icon: "photo_library",
      fields: [
        { name: "images", label: "Images", widget: "list" },
        { name: "caption", label: "Caption", widget: "string" }
      ],
      pattern: /{{< figure images="(?<images>.*?)" caption="(?<caption>.*?)" >}}/,
      toBlock: ({ images = [], caption = "" }) =>
        `{{< figure images="${images.join(",")}" caption="${caption}" >}}`,
      toPreview: ({ images = [], caption = "" }) =>
        `<figure style="margin:1em 0;display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));"><figcaption style="opacity:.7;text-align:center;grid-column:1/-1;">${caption}</figcaption></figure>`
    });

    CMS.registerEditorComponent({
      id: "youtube",
      label: "YouTube",
      icon: "smart_display",
      fields: [
        { name: "id", label: "Video ID", widget: "string" },
        { name: "title", label: "Title", widget: "string", required: false },
        {
          name: "poster",
          label: "Poster image (nothing loads from YouTube until play)",
          widget: "image",
          required: false
        },
        {
          name: "docsVideo",
          label: "Docs video name (plays its newest upload; leave empty to keep this ID)",
          widget: "string",
          required: false
        }
      ],
      pattern:
        /{{< youtube id="(?<id>.*?)"(?: title="(?<title>.*?)" poster="(?<poster>.*?)"(?: docs-video="(?<docsVideo>.*?)")?| width="(?<width>.*?)" height="(?<height>.*?)")? >}}/m,
      fromBlock: ({ id = "", title = "", poster = "", docsVideo = "" }) => ({ id, title, poster, docsVideo }),
      toBlock: ({ id = "", title = "", poster = "", docsVideo = "" }) =>
        `{{< youtube id="${id}" title="${title}" poster="${poster}"${docsVideo ? ` docs-video="${docsVideo}"` : ""} >}}`,
      toPreview: ({ id = "", title = "", poster = "" }) =>
        poster
          ? `<img src="${poster}" alt="${title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;"/>`
          : id
            ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture" style="width:100%;aspect-ratio:16/9;border:0;"></iframe>`
            : ""
    });

    CMS.registerEditorComponent({
      id: "embed",
      label: "Embed",
      icon: "web",
      fields: [
        { name: "url", label: "URL", widget: "string" },
        { name: "title", label: "Title", widget: "string" }
      ],
      pattern: /{{< embed url="(?<url>.*?)" title="(?<title>.*?)" >}}/,
      toBlock: ({ url = "", title = "" }) =>
        `{{< embed url="${url}" title="${title}" >}}`,
      toPreview: ({ url = "", title = "" }) =>
        url
          ? `<div style="margin:1em 0;"><iframe src="${url}" title="${title || "Embedded content"}" style="width:100%;aspect-ratio:16/9;border:0;" loading="lazy"></iframe></div>`
          : ""
    });
  }

  if (document.readyState === "complete") {
    registerAll();
  } else {
    window.addEventListener("load", registerAll);
  }
})();
