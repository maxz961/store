export const s = {
  page: 'mx-auto max-w-6xl px-4 py-8 sm:px-6',
  buttonIcon: 'mr-2 h-4 w-4',
  viewRow: 'mt-10 flex items-center gap-4',

  // Search
  searchForm: 'flex-1 relative',
  searchWrapper: 'relative flex items-center',
  searchIcon: 'absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none',
  searchInput: 'w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150',

  // Search dropdown
  suggestionsDropdown: 'absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-card shadow-lg',
  suggestionItem: 'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-accent',
  suggestionItemActive: 'bg-accent',
  suggestionImage: 'h-8 w-8 flex-shrink-0 rounded-md object-cover border border-border bg-muted',
  suggestionImageFallback: 'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-border bg-muted text-xs text-muted-foreground',
  suggestionName: 'flex-1 truncate font-medium text-foreground',
  suggestionMeta: 'flex items-center gap-2 flex-shrink-0',
  suggestionCategory: 'text-xs text-muted-foreground',
  suggestionDraftBadge: 'rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground',

  // View switch
  viewSwitch: 'flex gap-1 rounded-lg border border-border bg-muted/30 p-1 w-fit',
  viewTab: 'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 text-muted-foreground hover:text-foreground',
  viewTabActive: 'bg-card shadow-sm text-foreground',
  viewTabBadge: 'flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white',

  // Table
  tableWrapper: 'mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm',
  table: 'w-full text-sm',
  thead: 'border-b border-border bg-muted/40',
  th: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thRight: 'px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thCenter: 'px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground',
  tr: 'border-b border-border transition-colors duration-150 hover:bg-accent/40 last:border-0 cursor-pointer',
  td: 'px-4 py-3.5',
  tdRight: 'px-4 py-3.5 text-right',
  tdCenter: 'px-4 py-3.5 text-center',

  // Product cell
  productCell: 'flex items-center gap-3',
  productImage: 'h-10 w-10 shrink-0 rounded-lg object-cover border border-border bg-muted',
  productImageFallback: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-xs text-muted-foreground',
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

  // Sort header
  sortLink: 'inline-flex items-center gap-1 hover:text-foreground transition-colors duration-150',
  sortIcon: 'h-3 w-3 text-muted-foreground/40',
  sortIconActive: 'h-3 w-3 text-primary',

  // Pagination
  pagination: 'mt-6 flex items-center justify-between gap-4',
  paginationArrow: 'flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-150 hover:bg-accent',
  paginationArrowDisabled: 'flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm opacity-40 pointer-events-none',
  paginationNumbers: 'flex items-center gap-1',
  paginationNumber: 'flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground shadow-sm transition-colors duration-150 hover:bg-accent',
  paginationNumberActive: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90 pointer-events-none',
  paginationDots: 'flex h-9 w-9 items-center justify-center text-sm text-muted-foreground',

  // Empty
  emptyRow: 'px-4 py-12 text-center text-sm text-muted-foreground',
};
