export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  header: 'mt-6 flex items-center justify-between gap-4',

  // Table
  tableWrapper: 'mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm',
  table: 'w-full text-sm',
  thead: 'border-b border-border bg-muted/40',
  th: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thRight: 'px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thCenter: 'px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground',
  tr: 'border-b border-border transition-colors duration-150 hover:bg-muted/30 last:border-0',
  td: 'px-4 py-3.5',
  tdRight: 'px-4 py-3.5 text-right',
  tdCenter: 'px-4 py-3.5 text-center',

  // Product cell
  productCell: 'flex items-center gap-3',
  productImage: 'h-10 w-10 rounded-lg object-cover border border-border bg-muted',
  productImageFallback: 'flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground',
  productName: 'text-sm font-medium text-foreground',

  // Tags
  tagsWrapper: 'flex gap-1 flex-wrap',
  tag: 'rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground',

  // Status
  statusPublished: 'inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  statusDraft: 'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground',

  // Other
  category: 'text-sm text-muted-foreground',
  price: 'text-sm font-medium text-foreground',
  stock: 'text-sm text-foreground',
  stockLow: 'text-sm font-medium text-destructive',
  editLink: 'text-sm text-primary hover:underline',

  // Pagination
  pagination: 'mt-4 flex items-center justify-between',
  pageInfo: 'text-sm text-muted-foreground',
  pageButtons: 'flex gap-2',

  // Empty
  emptyRow: 'px-4 py-12 text-center text-sm text-muted-foreground',
};
