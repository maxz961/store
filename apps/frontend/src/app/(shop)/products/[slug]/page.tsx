import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { ProductPageClient } from './ProductPageClient';
import type { Props } from './page.types';


export const revalidate = 3600;


interface ProductMeta {
  name: string;
  nameEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  images: string[];
}


const fetchProduct = cache((slug: string) =>
  api.get<ProductMeta>(`/products/${slug}`),
);


export async function generateStaticParams() {
  try {
    const data = await api.get<{ items: Array<{ slug: string }> }>('/products?limit=1000');
    return data.items.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await fetchProduct(slug);
    const title = product.nameEn ?? product.name;
    const description = product.descriptionEn ?? product.description;
    const image = product.images[0];

    return {
      title: `${title} | Store`,
      description: description.slice(0, 160),
      openGraph: {
        title: `${title} | Store`,
        description: description.slice(0, 160),
        ...(image ? { images: [{ url: image }] } : {}),
      },
    };
  } catch {
    return { title: 'Store' };
  }
}


export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  try {
    await fetchProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <ProductPageClient slug={slug} />;
}
