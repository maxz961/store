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
