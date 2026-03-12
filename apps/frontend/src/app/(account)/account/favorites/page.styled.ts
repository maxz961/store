export const s = {
  page: 'mx-auto max-w-4xl px-4 py-8 sm:px-6',
  pageTitle: 'text-2xl font-semibold mb-6',

  grid: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',

  // Favorite card
  card: 'group flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md',
  imageLink: 'relative block aspect-square overflow-hidden bg-muted/30',
  image: 'object-cover transition-transform duration-300 group-hover:scale-105',
  placeholder: 'flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30',
  placeholderIcon: 'h-10 w-10',
  content: 'flex flex-col gap-2 p-4 border-t border-border',
  name: 'text-sm font-medium leading-snug text-card-foreground line-clamp-2 group-hover:text-primary transition-colors duration-150',
  category: 'text-xs text-muted-foreground',
  footer: 'flex items-center justify-between mt-auto pt-2',
  price: 'text-base font-bold text-foreground',
  removeButton: 'flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20',
  removeIcon: 'h-4 w-4',

  // Empty state
  empty: 'flex min-h-[400px] flex-col items-center justify-center gap-3 text-center',
  emptyIcon: 'h-16 w-16 text-muted-foreground/30',
  emptyTitle: 'text-lg font-medium',
  emptyText: 'text-sm text-muted-foreground max-w-xs',

  // Loading
  skeleton: 'animate-pulse rounded-xl border border-border bg-card overflow-hidden',
  skeletonImage: 'aspect-square bg-muted',
  skeletonContent: 'flex flex-col gap-2 p-4',
  skeletonTitle: 'h-4 w-3/4 rounded bg-muted',
  skeletonPrice: 'h-5 w-1/3 rounded bg-muted',

  // Not auth
  notAuth: 'flex min-h-[400px] flex-col items-center justify-center gap-3',
  notAuthTitle: 'text-base font-medium',
  notAuthText: 'text-sm text-muted-foreground',
};
