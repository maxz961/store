export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  statsGrid: 'mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4',
  chartsGrid: 'mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2',
  card: 'rounded-xl border border-border bg-card p-6 shadow-sm',
  cardTitle: 'text-lg font-medium text-foreground',

  // Revenue chart
  revenueCard: 'mt-8 rounded-xl border border-border bg-card p-6 shadow-sm',

  // Orders by status
  statusRow: 'flex items-center justify-between py-2.5',
  statusDot: 'h-2 w-2 rounded-full',
  statusLabel: 'ml-3 text-sm text-foreground',
  statusCount: 'text-sm font-medium text-foreground',

  // Top products
  productRow: 'flex items-center justify-between py-2.5 border-b border-border last:border-0',
  productRank: 'flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground',
  productName: 'ml-3 text-sm text-foreground truncate',
  productSold: 'text-sm text-muted-foreground shrink-0',

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
