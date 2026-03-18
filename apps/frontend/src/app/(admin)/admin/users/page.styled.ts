export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  header: 'mt-6 flex items-center justify-between gap-4',
  searchWrapper: 'relative',
  searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50',
  searchInput: 'h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20',

  // Table
  tableWrapper: 'mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm',
  table: 'w-full text-sm',
  thead: 'border-b border-border bg-muted/40',
  th: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thCenter: 'px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground',
  tr: 'border-b border-border transition-colors duration-150 hover:bg-accent/40 last:border-0',
  td: 'px-4 py-3.5',
  tdCenter: 'px-4 py-3.5 text-center',

  // User cell
  userCell: 'flex items-center gap-3',
  avatar: 'h-8 w-8 rounded-full object-cover border border-border bg-muted',
  avatarFallback: 'flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-medium text-muted-foreground',
  userName: 'text-sm font-medium text-foreground',
  userEmail: 'text-xs text-muted-foreground',

  // Role
  roleAdmin: 'inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
  roleManager: 'inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  roleCustomer: 'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
  roleSelect: 'w-36 [&>label]:hidden [&>div]:mt-0',

  // Ban
  bannedBadge: 'inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  activeBadge: 'inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',

  // Actions
  actionBtn: 'rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-accent',
  banBtn: 'rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors duration-150 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/40',
  unbanBtn: 'rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors duration-150 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/40',
  actions: 'flex items-center gap-2',

  // Date
  date: 'text-sm text-muted-foreground',

  // Empty
  emptyRow: 'px-4 py-12 text-center text-sm text-muted-foreground',

  // Load More
  loadMoreWrapper: 'mt-4 flex justify-center',
  loadMoreBtn: 'rounded-lg border border-border bg-background px-6 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50',
};
