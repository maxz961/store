export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  layout: 'grid grid-cols-1 gap-8 lg:grid-cols-2',

  // Gallery
  gallery: 'space-y-3',
  mainImage: 'relative aspect-square overflow-hidden rounded-xl border border-border bg-white',
  image: 'object-contain p-4',
  skeleton: 'absolute inset-0 animate-pulse bg-muted rounded-xl',
  placeholder: 'flex h-full items-center justify-center text-muted-foreground',
  placeholderIcon: 'h-16 w-16',
  thumbnails: 'flex gap-2 overflow-x-auto',
  thumb: 'relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 bg-white transition-colors duration-150',
  thumbActive: 'border-primary',
  thumbInactive: 'border-border hover:border-primary/50',
  thumbImage: 'object-contain p-1',

  // Info
  info: 'flex flex-col gap-4',
  category: 'text-sm text-muted-foreground',
  title: 'text-2xl font-semibold tracking-tight',
  priceGroup: 'flex items-baseline gap-3',
  price: 'text-3xl font-bold text-primary',
  oldPrice: 'text-lg text-muted-foreground line-through',
  discount: 'rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-medium text-destructive',
  stock: 'text-sm text-muted-foreground',
  stockInStock: 'text-green-600 dark:text-green-400',
  stockOut: 'text-destructive',
  divider: 'border-t border-border',
  description: 'text-sm leading-relaxed text-muted-foreground',
  tags: 'flex flex-wrap gap-2',
  tag: 'border-primary/20 bg-primary/10 text-primary',

  // Actions
  actions: 'flex items-center gap-3',
  favoriteButton: 'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border transition-all duration-150 hover:border-muted-foreground/30 hover:bg-muted',
  favoriteButtonActive: 'border-red-300 bg-red-50 dark:bg-red-950/20',
  favoriteIcon: 'h-5 w-5 transition-colors duration-150',
  favoriteIconActive: 'fill-red-500 text-red-500',
  favoriteIconInactive: 'text-muted-foreground',
  quantityGroup: 'flex items-center gap-0 rounded-lg border border-border',
  quantityButton: 'flex h-10 w-10 items-center justify-center text-lg transition-colors duration-150 hover:bg-accent',
  quantity: 'flex h-10 w-10 items-center justify-center text-sm font-medium',
  buttonIcon: 'mr-2 h-4 w-4',
  addToCartButton: 'flex-1',

  // Rating row (in product info)
  ratingRow: 'flex items-center gap-2',
  ratingText: 'text-sm text-muted-foreground',

  // Reviews section
  reviewsSection: 'mt-12',
  reviewsSummary: 'flex items-center justify-between rounded-xl border border-border bg-card p-5',
  reviewsSummaryLeft: 'flex flex-col gap-1.5',
  reviewsTitle: 'text-lg font-medium',
  reviewsSummaryRating: 'flex items-center gap-2',
  reviewsSummaryText: 'text-sm text-muted-foreground',

  // Error
  error: 'flex min-h-[400px] flex-col items-center justify-center gap-2',
  errorTitle: 'text-base font-medium text-destructive',
  errorText: 'text-sm text-muted-foreground',
};
