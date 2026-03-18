import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { PromotionPageClient } from './PromotionPageClient';


interface Props {
  params: Promise<{ slug: string }>;
}

interface PromotionMeta {
  title: string;
  titleEn?: string | null;
  description: string | null;
  descriptionEn?: string | null;
  bannerImageUrl?: string | null;
  slug: string;
}


export const revalidate = 3600;


const fetchPromotion = cache((slug: string) =>
  api.get<PromotionMeta>(`/promotions/slug/${slug}`),
);


export async function generateStaticParams() {
  try {
    const promotions = await api.get<Array<{ slug: string }>>('/promotions/active');
    return promotions.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const promotion = await fetchPromotion(slug);
    const title = promotion.titleEn ?? promotion.title;
    const description = promotion.descriptionEn ?? promotion.description ?? '';

    return {
      title: `${title} | Store`,
      description: description.slice(0, 160),
      openGraph: {
        title: `${title} | Store`,
        description: description.slice(0, 160),
        ...(promotion.bannerImageUrl ? { images: [{ url: promotion.bannerImageUrl }] } : {}),
      },
    };
  } catch {
    return { title: 'Store' };
  }
}


export default async function PromotionPage({ params }: Props) {
  const { slug } = await params;

  try {
    await fetchPromotion(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <PromotionPageClient slug={slug} />;
}
