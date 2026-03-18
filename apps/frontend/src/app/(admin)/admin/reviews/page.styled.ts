export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  header: 'mt-6 flex items-center justify-between gap-4',

  // Sort toolbar
  toolbar: 'mt-6 flex items-center gap-2 flex-wrap',
  sortLabel: 'text-sm text-muted-foreground',
  sortButton: 'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150',
  sortActive: 'bg-primary text-primary-foreground',
  sortInactive: 'border border-border text-muted-foreground hover:bg-accent hover:text-foreground',

  // Table
  tableWrapper: 'mt-4 overflow-x-auto rounded-xl border border-border bg-card shadow-sm',
  table: 'w-full text-sm',
  thead: 'border-b border-border bg-muted/40',
  th: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
  tr: 'border-b border-border transition-colors duration-150 hover:bg-accent/40 last:border-0',
  td: 'px-4 py-3.5 align-top',
  tdCenter: 'px-4 py-3.5 text-center align-middle',

  // User cell
  userCell: 'flex items-center gap-2',
  avatar: 'h-7 w-7 rounded-full object-cover border border-border bg-muted shrink-0',
  avatarFallback: 'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground',
  userName: 'text-sm font-medium text-foreground truncate max-w-[120px]',

  // Product link
  productLink: 'text-sm text-primary hover:underline truncate max-w-[140px] block',

  // Rating
  stars: 'flex items-center gap-0.5',

  // Comment
  comment: 'text-sm text-muted-foreground line-clamp-2 max-w-[220px]',
  noComment: 'text-xs text-muted-foreground/60 italic',

  // Reply badge
  replyBadge: 'inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary',

  // Date
  date: 'text-sm text-muted-foreground whitespace-nowrap',

  // Actions
  deleteBtn: 'rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-150 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40',

  // Pagination
  pagination: 'mt-4 flex items-center justify-between',
  pageInfo: 'text-sm text-muted-foreground',
  pageButtons: 'flex gap-2',

  // Empty
  emptyRow: 'px-4 py-12 text-center text-sm text-muted-foreground',
};
