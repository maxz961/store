import type { Metadata } from 'next';
import { api } from '@/lib/api';
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
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const promotion = await api.get<PromotionMeta>(`/promotions/slug/${slug}`);
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
  return <PromotionPageClient slug={slug} />;
}
