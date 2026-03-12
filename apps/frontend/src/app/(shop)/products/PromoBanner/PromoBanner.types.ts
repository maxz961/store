export interface PromoBannerSlideProps {
  title: string;
  description: string | null;
  bannerImageUrl: string;
  bannerBgColor: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  link: string | null;
}
