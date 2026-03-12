export const s = {
  page: 'mx-auto max-w-3xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold tracking-tight',
  pageTitle: 'text-2xl font-semibold tracking-tight mt-6 mb-6',

  // Order list
  list: 'space-y-3',
  orderCard: 'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:bg-accent',
  orderInfo: 'flex-1 min-w-0',
  orderNumber: 'text-sm font-medium',
  orderDate: 'text-xs text-muted-foreground mt-0.5',
  orderRight: 'text-right shrink-0',
  orderAmount: 'text-sm font-semibold',
  orderItems: 'text-xs text-muted-foreground mt-0.5',
  orderArrow: 'h-4 w-4 text-muted-foreground shrink-0',

  // Status badges
  statusPending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  statusProcessing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  statusShipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  statusDelivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  statusCancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',

  // Empty
  empty: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  emptyTitle: 'text-lg font-medium',
  emptyText: 'text-sm text-muted-foreground',

  // Loading
  skeleton: 'animate-pulse rounded-md bg-muted',
  skeletonCard: 'rounded-xl border border-border bg-card p-4',
  skeletonRow: 'flex items-center gap-4',
  skeletonLeft: 'flex-1',
  skeletonRight: 'text-right',
  skeletonTitle: 'animate-pulse rounded-md bg-muted h-4 w-32 mb-2',
  skeletonSubtitle: 'animate-pulse rounded-md bg-muted h-3 w-24',
  skeletonAmount: 'animate-pulse rounded-md bg-muted h-4 w-20 mb-2',
  skeletonBadge: 'animate-pulse rounded-md bg-muted h-5 w-24',

  // Icons
  errorIcon: 'h-12 w-12 text-muted-foreground',
  emptyIcon: 'h-12 w-12 text-muted-foreground',

  // Not authenticated
  notAuth: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  notAuthTitle: 'text-lg font-medium',
  notAuthText: 'text-sm text-muted-foreground',
};
