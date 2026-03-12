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

  // Sidebar (order summary)
  sidebar: 'space-y-6 lg:sticky lg:top-20',
  summaryCard: 'rounded-xl border border-border bg-card p-6',
  summaryTitle: 'text-lg font-medium mb-4',
  summaryItems: 'space-y-3',
  summaryItem: 'flex items-center gap-3',
  summaryItemImage: 'relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-white',
  summaryItemImageEl: 'object-contain p-1',
  summaryItemImageFallback: 'm-auto h-5 w-5 text-muted-foreground/30',
  summaryItemInfo: 'flex-1 min-w-0',
  summaryItemName: 'text-sm font-medium truncate',
  summaryItemQty: 'text-xs text-muted-foreground',
  summaryDivider: 'border-t border-border my-4',
  summaryRow: 'flex items-center justify-between text-sm',
  summaryRowLabel: 'text-muted-foreground',
  summaryTotal: 'flex items-center justify-between mb-4',
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

  // Step indicator
  stepBar: 'flex items-center gap-2 mb-8',
  stepItem: 'flex items-center gap-2 text-sm',
  stepDot: 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
  stepDotActive: 'bg-primary text-primary-foreground',
  stepDotDone: 'bg-primary/20 text-primary',
  stepDotInactive: 'bg-muted text-muted-foreground',
  stepLabelActive: 'font-medium text-foreground',
  stepLabelInactive: 'text-muted-foreground',
  stepLine: 'h-px flex-1 bg-border',

  // Payment section
  paymentSection: 'rounded-xl border border-border bg-card p-6',
  paymentTitle: 'text-lg font-medium mb-4',
  paymentError: 'mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive',
  payButton: 'w-full mt-4',
  backLink: 'mt-3 block w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50',
};
