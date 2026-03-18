import type { AnalyticsSummary } from '@/lib/hooks/useAdmin';


export interface StatsSectionProps {
  summary: AnalyticsSummary;
}

export interface OrdersByStatusCardProps {
  ordersByStatus: { status: string; count: number }[];
  pieData: { name: string; value: number; color: string }[];
}

export interface TopProductsCardProps {
  topProducts: { product: { name: string; price: number } | undefined; soldCount: number }[];
}

export interface RevenueChartProps {
  chartData: { date: string; revenue: number }[];
}

export interface StatusRowProps {
  status: string;
  count: number;
}

export interface TopProductRowProps {
  rank: number;
  productName: string;
  soldCount: number;
}

export interface RevenueByCategoryCardProps {
  revenueByCategory: { categoryName: string; revenue: number }[];
}

export interface AovTrendChartProps {
  chartData: { date: string; aov: number }[];
}

export interface DeliveryMethodCardProps {
  data: { method: string; label: string; count: number }[];
}

export interface RatingDistributionCardProps {
  data: { rating: number; count: number }[];
}

export interface LowStockCardProps {
  products: { id: string; name: string; slug: string; stock: number; image: string | null }[];
}

export interface LowStockRowProps {
  id: string;
  name: string;
  slug: string;
  stock: number;
  image: string | null;
}
