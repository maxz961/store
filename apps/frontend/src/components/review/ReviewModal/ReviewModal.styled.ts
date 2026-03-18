export const s = {
  overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2',
  modal: 'relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-border bg-card shadow-xl',

  // Header
  header: 'flex items-center justify-between border-b border-border px-6 py-4',
  title: 'text-lg font-medium',
  closeButton: 'flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',

  // Toolbar
  toolbar: 'flex items-center justify-between border-b border-border px-6 py-3',
  sortGroup: 'flex items-center gap-2',
  sortLabel: 'text-xs text-muted-foreground',
  sortButton: 'rounded-lg px-3 py-1.5 text-xs transition-colors duration-150',
  sortActive: 'bg-primary text-primary-foreground',
  sortInactive: 'text-muted-foreground hover:bg-accent',

  // Content
  content: 'flex-1 overflow-y-auto px-6 py-4 space-y-4',
  empty: 'py-12 text-center text-sm text-muted-foreground',

  // Review card
  card: 'rounded-xl border border-border bg-background p-4 space-y-3',
  cardHeader: 'flex items-center gap-3',
  avatar: 'h-9 w-9 rounded-full object-cover',
  avatarFallback: 'flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary',
  authorInfo: 'flex-1 min-w-0',
  authorName: 'text-sm font-medium truncate',
  date: 'text-xs text-muted-foreground',
  ownActions: 'flex items-center gap-1',

  stars: 'flex items-center gap-1',
  comment: 'text-sm leading-relaxed text-muted-foreground',

  images: 'flex gap-2 overflow-x-auto',
  imageThumb: 'h-16 w-16 shrink-0 cursor-pointer rounded-lg object-cover border border-border transition-opacity duration-150 hover:opacity-80',

  // Admin reply
  adminReply: 'ml-4 rounded-r-lg border-l-4 border-primary/60 bg-white p-3 space-y-1 dark:bg-slate-800/70',
  adminReplyHeader: 'flex items-center justify-between',
  adminReplyLabel: 'text-xs font-medium text-slate-500 dark:text-slate-400',
  adminReplyText: 'text-sm text-foreground/80',
  adminReplyDate: 'text-xs text-muted-foreground',

  // Admin reply form
  replyForm: 'ml-4 space-y-2',
  replyTextarea: 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none',
  replyActions: 'flex items-center gap-2',

  // Button icons
  buttonIcon: 'h-7 w-7',
  buttonIconDestructive: 'h-7 w-7 text-destructive hover:text-destructive',
  buttonIconSmDestructive: 'h-6 w-6 text-destructive hover:text-destructive',

  // Admin actions
  adminActions: 'flex items-center gap-1',

  // Lightbox
  lightbox: 'fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4',
  lightboxClose: 'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-150 hover:bg-black/70',
  lightboxImage: 'max-h-[85vh] max-w-[90vw] rounded-lg object-contain',

  // Pagination
  pagination: 'flex items-center justify-center gap-3 border-t border-border px-6 py-3',
  pageButton: 'flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40',
  pageInfo: 'text-sm text-muted-foreground tabular-nums',

  // Form section
  formSection: 'border-t border-border px-6 py-4',
  formHeader: 'flex items-center justify-between mb-3',
  formTitle: 'text-sm font-medium text-foreground',
  formCloseBtn: 'flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',
  writeReviewBtn: 'w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90',
};
