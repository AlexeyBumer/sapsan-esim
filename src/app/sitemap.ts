import type { MetadataRoute } from "next";

/**
 * sitemap.xml — карта сайта для поисковиков.
 * Пока одна страница (лендинг). Когда добавите новые страницы —
 * допишите их сюда.

 */
const SITE_URL = "https://sapsansim.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
