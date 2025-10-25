import { db } from '$lib/db';

export async function saveArticle(link: string, title: string) {
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
      if (attr && !attr.startsWith('data:')) {
        assets.add(new URL(attr, link).href);
      }
    });
  }

  // Download all assets in parallel and replace their URLs
  await Promise.allSettled(
    Array.from(assets).map(async (url) => {
      try {
        const fileRes = await fetch(url);
        if (!fileRes.ok) throw new Error(`Failed to fetch ${url}`);
        const blob = await fileRes.blob();

        // Convert blob to a local object URL
        const localUrl = URL.createObjectURL(blob);
        html = html.replaceAll(url, localUrl);
      } catch (err) {
        console.warn('⚠️ Asset failed:', url, err);
      }
    })
  );

  // Store the HTML as a Blob in cachedArticles
  const htmlBlob = new Blob([html], { type: 'text/html' });
  await db.cachedArticles.put({
    id: link, // link is the primary key in cachedArticles
    blob: htmlBlob,
  });

  // Update article metadata to mark it as downloaded
  const article = await db.articles.where('link').equals(link).first();
  if (article) {
    await db.articles.update(article.id!, { downloaded: true });
  } else {
    // if article metadata wasn’t added before
    await db.articles.put({
      feedUrl: '', // you can fill this if you have feed context
      link,
      title,
      downloaded: true,
    });
  }

  console.log(`✅ Saved "${title}" with ${assets.size} assets.`);
}

