export interface Promotion {
  id: string;
  title: string;
  titleEn?: string | null;
  slug: string;
  description: string | null;
  bannerImageUrl: string;
  bannerBgColor: string | null;
  startDate: string;
  endDate: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  isActive: boolean;
  position: number;
  link: string | null;
}

export interface PromotionsTableProps {
  promotions: Promotion[];
}

export interface PromotionRowProps {
  promotion: Promotion;
}
