export const s = {
  list: 'space-y-4',

  // Review card
  card: 'rounded-xl border border-border bg-card p-4',
  header: 'flex items-center gap-3',
  avatar: 'h-8 w-8 shrink-0 rounded-full object-cover',
  avatarFallback: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary',
  authorInfo: 'flex-1 min-w-0',
  authorName: 'text-sm font-medium truncate',
  date: 'text-xs text-muted-foreground',
  ownActions: 'flex items-center gap-1 shrink-0',
  buttonIcon: 'h-7 w-7',
  buttonIconDestructive: 'h-7 w-7 text-destructive hover:text-destructive',

  // Stars
  stars: 'mt-2',

  // Comment
  comment: 'mt-2 text-sm text-muted-foreground leading-relaxed',

  // Review images
  images: 'mt-3 flex flex-wrap gap-2',
  imageThumb: 'h-20 w-20 cursor-pointer overflow-hidden rounded-lg border border-border object-cover transition-opacity duration-150 hover:opacity-80',

  // Lightbox
  lightbox: 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4',
  lightboxImage: 'max-h-[90vh] max-w-[90vw] rounded-lg object-contain',
  lightboxClose: 'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 hover:bg-white/20',

  // Empty
  empty: 'text-sm text-muted-foreground',
};
