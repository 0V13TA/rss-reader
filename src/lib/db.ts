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
  id?: string;
  blob: Blob;
}

