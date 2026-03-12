export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  pageTitle: 'text-2xl font-semibold text-foreground mt-6',
  statsGrid: 'mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4',
  statIcon: 'h-4 w-4 text-primary',
  statsSkeleton: 'h-28 animate-pulse rounded-xl border border-border bg-muted/50',
  chartsGrid: 'mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2',
  card: 'rounded-xl border border-border bg-card p-6 shadow-sm',
  cardTitle: 'text-lg font-medium text-foreground',

  // Revenue chart
  revenueCard: 'mt-8 rounded-xl border border-border bg-card p-6 shadow-sm',
  chartBody: 'mt-4',

  // Orders by status
  statusRow: 'flex items-center justify-between py-2.5',
  statusDot: 'h-2 w-2 rounded-full',
  statusInfo: 'flex items-center',
  statusLabel: 'ml-3 text-sm text-foreground',
  statusCount: 'text-sm font-medium text-foreground',
  statusList: 'mt-4 space-y-1',

  // Top products
  cardBody: 'mt-4',
  productRow: 'flex items-center justify-between py-2.5 border-b border-border last:border-0',
  productInfo: 'flex items-center min-w-0',
  productRank: 'flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground',
  productName: 'ml-3 text-sm text-foreground truncate',
  productSold: 'text-sm text-muted-foreground shrink-0',

  // Charts row 2
  chartsRow2: 'mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2',
  miniChartsStack: 'flex flex-col gap-6',
  barChartBody: 'mt-4',

  // AOV chart
  aovCard: 'mt-6 rounded-xl border border-border bg-card p-6 shadow-sm',

  // Low stock
  lowStockCard: 'mt-6 rounded-xl border border-amber-200 bg-card p-6 shadow-sm dark:border-amber-800',
  lowStockTitle: 'text-lg font-medium text-foreground flex items-center gap-2',
  lowStockRow: 'flex items-center justify-between py-3 border-b border-border last:border-0',
  lowStockInfo: 'flex items-center gap-3 min-w-0',
  lowStockImage: 'h-8 w-8 rounded-md object-cover bg-muted shrink-0',
  lowStockName: 'text-sm text-foreground truncate',
  lowStockBadgeCritical: 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400',
  lowStockBadgeWarning: 'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  lowStockEmpty: 'flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground',
  chartSkeleton: 'h-64 animate-pulse rounded-xl border border-border bg-muted/50',

  // Empty
  emptyText: 'text-sm text-muted-foreground py-8 text-center',
  errorText: 'text-sm text-destructive py-8 text-center',
};

export const statusDotColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
};
