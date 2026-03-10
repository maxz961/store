export const s = {
  page: 'mx-auto max-w-5xl px-4 py-8 sm:px-6',
  layout: 'grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]',

  // Form column
  formColumn: 'space-y-8',

  // Section
  section: 'rounded-xl border border-border bg-card p-6',
  sectionTitle: 'text-lg font-medium mb-4',

  // Delivery method
  deliveryGrid: 'grid grid-cols-1 gap-3 sm:grid-cols-3',
  deliveryOption: 'flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors duration-150 cursor-pointer',
  deliveryOptionActive: 'border-primary bg-primary/5',
  deliveryOptionInactive: 'border-border hover:border-primary/40',
  deliveryIcon: 'h-6 w-6 text-muted-foreground',
  deliveryIconActive: 'h-6 w-6 text-primary',
  deliveryLabel: 'text-sm font-medium',
  deliveryDescription: 'text-xs text-muted-foreground',

  // Form fields
  fieldGroup: 'space-y-4',
  fieldRow: 'grid grid-cols-1 gap-4 sm:grid-cols-2',
  label: 'block text-sm font-medium text-foreground mb-1.5',
  input: 'w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50',
  fieldError: 'mt-1 text-xs text-destructive',

  // Sidebar (order summary)
  sidebar: 'space-y-6 lg:sticky lg:top-20',
  summaryCard: 'rounded-xl border border-border bg-card p-6',
  summaryTitle: 'text-lg font-medium mb-4',
  summaryItems: 'space-y-3',
  summaryItem: 'flex items-center gap-3',
  summaryItemImage: 'relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white',
  summaryItemImageEl: 'object-contain p-1',
  summaryItemInfo: 'flex-1 min-w-0',
  summaryItemName: 'text-sm font-medium truncate',
  summaryItemQty: 'text-xs text-muted-foreground',
  summaryDivider: 'border-t border-border',
  summaryRow: 'flex items-center justify-between text-sm',
  summaryRowLabel: 'text-muted-foreground',
  summaryTotal: 'flex items-center justify-between',
  summaryTotalLabel: 'text-base font-medium',
  summaryTotalPrice: 'text-xl font-bold text-primary',

  // Submit
  submitButton: 'w-full',
  error: 'text-sm text-destructive text-center',

  // Auth required
  authCard: 'flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center',
  authIcon: 'h-12 w-12 text-muted-foreground/40',
  authTitle: 'text-lg font-medium',
  authText: 'text-sm text-muted-foreground',

  // Loading
  loading: 'flex min-h-[400px] items-center justify-center',
  spinner: 'h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary',
};
