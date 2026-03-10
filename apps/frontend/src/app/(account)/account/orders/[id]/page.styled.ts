export const s = {
  page: 'mx-auto max-w-3xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold tracking-tight',
  subtitle: 'text-sm text-muted-foreground mt-1',

  // Meta row (status + delivery badge)
  meta: 'mt-4 flex flex-wrap items-center gap-2',

  // Sections
  section: 'mt-8 rounded-xl border border-border bg-card',
  sectionHeader: 'px-5 py-4 border-b border-border',
  sectionTitle: 'text-sm font-medium',
  sectionBody: 'px-5 py-4',

  // Order items
  item: 'flex items-center gap-4 py-3 border-b border-border last:border-0',
  itemImageWrapper: 'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white',
  itemImage: 'object-contain p-1',
  itemInfo: 'flex-1 min-w-0',
  itemName: 'text-sm font-medium truncate hover:text-primary transition-colors duration-150',
  itemQuantity: 'text-xs text-muted-foreground mt-0.5',
  itemPrice: 'text-sm font-medium shrink-0',

  // Address
  addressText: 'text-sm text-muted-foreground leading-relaxed',

  // Total
  totalRow: 'flex justify-between items-center px-5 py-4 border-t border-border',
  totalLabel: 'text-sm font-medium',
  totalAmount: 'text-lg font-semibold',

  // Status badges
  statusPending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  statusProcessing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  statusShipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  statusDelivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  statusCancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',

  // Delivery badge
  deliveryBadge: 'bg-secondary text-secondary-foreground',

  // Image fallback
  imageFallback: 'flex h-full items-center justify-center text-xs text-muted-foreground',

  // Title row with back button
  titleRow: 'mt-6 mb-2 flex items-center gap-3',

  // Loading
  loadingSection: 'mt-6',
  skeleton: 'animate-pulse rounded-md bg-muted',
  skeletonTitle: 'animate-pulse rounded-md bg-muted h-7 w-64 mb-2',
  skeletonDate: 'animate-pulse rounded-md bg-muted h-4 w-40 mb-4',
  skeletonStatus: 'animate-pulse rounded-md bg-muted h-6 w-24 mb-8',
  skeletonCard: 'rounded-xl border border-border bg-card',
  skeletonRow: 'flex items-center gap-4 p-5 border-b border-border last:border-0',
  skeletonImage: 'animate-pulse rounded-lg bg-muted h-14 w-14',
  skeletonInfo: 'flex-1',
  skeletonName: 'animate-pulse rounded-md bg-muted h-4 w-48 mb-2',
  skeletonQty: 'animate-pulse rounded-md bg-muted h-3 w-20',
  skeletonPrice: 'animate-pulse rounded-md bg-muted h-4 w-16',

  // Icons
  emptyIcon: 'h-12 w-12 text-muted-foreground',
  backIcon: 'h-4 w-4 mr-2',

  // Error
  error: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  errorTitle: 'text-lg font-medium',
  errorText: 'text-sm text-muted-foreground',
};
