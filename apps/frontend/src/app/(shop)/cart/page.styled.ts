export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold tracking-tight',
  header: 'mb-6',
  layout: 'grid grid-cols-1 gap-8 lg:grid-cols-3',
  itemsList: 'lg:col-span-2 space-y-3',

  // Cart item
  item: 'flex gap-4 rounded-xl border border-border bg-card p-4',
  itemImageLink: 'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white',
  itemImage: 'object-contain p-1',
  itemImageFallback: 'flex h-full items-center justify-center text-xs text-muted-foreground',
  itemInfo: 'flex flex-1 flex-col gap-1',
  itemName: 'text-sm font-medium transition-colors duration-150 hover:text-primary',
  itemPrice: 'text-sm text-muted-foreground',
  itemActions: 'mt-auto flex items-center gap-2',
  quantityGroup: 'flex items-center gap-0 rounded-lg border border-border overflow-hidden',
  quantityButton: 'flex h-7 w-7 items-center justify-center text-sm transition-colors duration-150 hover:bg-accent',
  quantity: 'w-8 text-center text-sm',
  itemRight: 'flex shrink-0 flex-col items-end justify-between',
  itemTotal: 'text-sm font-semibold',
  removeIconButton: 'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40 transition-colors duration-150 hover:text-destructive hover:bg-destructive/10',
  removeIcon: 'h-4 w-4',

  // Summary
  summary: 'h-fit rounded-xl border border-border bg-card p-6',
  summaryTitle: 'text-lg font-medium',
  summaryRow: 'mt-4 flex justify-between text-sm',
  summaryDivider: 'my-4 border-t border-border',
  summaryTotal: 'flex justify-between text-lg font-semibold',
  checkoutButton: 'mt-4 w-full',
  clearButton: 'mt-3 w-full text-center text-sm text-muted-foreground transition-colors duration-150 hover:text-destructive',

  // Empty
  emptyIcon: 'h-12 w-12 text-muted-foreground',
  empty: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  emptyTitle: 'text-lg font-medium',
  emptyText: 'text-sm text-muted-foreground',
};
