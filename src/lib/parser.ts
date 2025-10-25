async function saveArticle(link: string, title: string) {
  const res = await fetch(link);
  if (!res.ok) throw new Error(`Failed to fetch article: ${link}`);

  let html = await res.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const assetSelectors = ['img[src]', 'script[src]', 'link[href]', 'audio[src]', 'video[src]'];
  const assets = new Set<string>();

  for (const sel of assetSelectors) {
    doc.querySelectorAll(sel).forEach((el) => {
      const attr = el.getAttribute('src') || el.getAttribute('href');
      if (attr && !attr.startsWith('data:')) assets.add(new URL(attr, link).href);
    });
  }

  // Download all assets in parallel
  await Promise.allSettled(
    Array.from(assets).map(async (url) => {
      try {
        const fileRes = await fetch(url);
        if (!fileRes.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await fileRes.blob();
        await db.assets.put({ url, blob });
        html = html.replaceAll(url, `local:${url}`);
      } catch (err) {
        console.warn('Asset failed:', url, err);
      }
    })
  );

  await db.articles.put({
    title,
    link,
    html,
    savedAt: Date.now(),
  });

  console.log(`✅ Saved ${title} with ${assets.size} assets.`);
}

