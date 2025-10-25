import Dexie, { type EntityTable } from 'dexie';

export interface Feed {
  id?: number;
  url: string;
  title?: string;
  description?: string;
  siteLink?: string;
  lastFetched: number;
}

export interface ArticleMeta {
  id?: number;
  feedUrl: string;
  link: string;
  title: string;
  summary?: string;
  thumbnail?: string;
  pubDate?: string;
  author?: string,
  downloaded?: boolean;
}

export interface CachedArticle {
  id: string;
  blob: Blob;
}

interface schemas {
  feeds: EntityTable<Feed, "id">;
  articles: EntityTable<ArticleMeta, "id">;
  cachedArticles: EntityTable<CachedArticle, "id">;
}

export const db = new Dexie('RSS_Reader') as Dexie & schemas;

db.version(1).stores({
  feeds: "++id, url, title, description, siteLink, lastFetched",
  articles: "++id, feedUrl, link, title, summary, thumbnail, pubDate, author, downloaded",
  cachesArticles: "id, blob",
});

