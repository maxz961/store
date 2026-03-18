export interface PromoBannerSlideProps {
  title: string;
  description: string | null;
  bannerImageUrl: string;
  bannerBgColor: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  slug?: string;
}
