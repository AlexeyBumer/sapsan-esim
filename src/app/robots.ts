import type { MetadataRoute } from "next";

/**
 * robots.txt — разрешает поисковикам сканировать сайт
 * и указывает путь к карте сайта.

 */
const SITE_URL = "https://sapsansim.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
