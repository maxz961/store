import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { ProductPageClient } from './ProductPageClient';
import type { Props } from './page.types';


interface ProductMeta {
  name: string;
  nameEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  images: string[];
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await api.get<ProductMeta>(`/products/${slug}`);
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
  return <ProductPageClient slug={slug} />;
}
