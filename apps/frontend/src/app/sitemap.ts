import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';


const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

interface ProductEntry {
  slug: string;
}

interface PromotionEntry {
  slug: string;
}


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsResult, promotionsResult] = await Promise.allSettled([
    api.get<{ items: ProductEntry[] }>('/products?limit=1000'),
    api.get<PromotionEntry[]>('/promotions/active'),
  ]);

  const productEntries: MetadataRoute.Sitemap =
    productsResult.status === 'fulfilled'
      ? productsResult.value.items.map((p) => ({
          url: `${baseUrl}/products/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
      : [];

  const promotionEntries: MetadataRoute.Sitemap =
    promotionsResult.status === 'fulfilled'
      ? promotionsResult.value.map((p) => ({
          url: `${baseUrl}/promotions/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        }))
      : [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...productEntries,
    ...promotionEntries,
  ];
}
