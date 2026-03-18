import type { MetadataRoute } from 'next';


const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/promotions'],
        disallow: ['/admin/', '/account/', '/checkout', '/cart', '/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
