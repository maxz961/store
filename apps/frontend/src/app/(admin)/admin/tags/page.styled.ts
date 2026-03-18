export const s = {
  page: 'mx-auto max-w-4xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',

  // Form card
  formCard: 'mt-6 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4',
  formTitle: 'text-lg font-medium text-foreground',
  formRow: 'grid grid-cols-1 gap-4 sm:grid-cols-3',

  // Lang tabs
  langTabs: 'flex gap-1 rounded-lg border border-border bg-muted/60 p-1 w-fit',
  langTab: 'rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
  langTabActive: 'bg-white text-foreground shadow-sm ring-1 ring-border/50 dark:bg-slate-800',

  // Color picker
  colorLabel: 'text-sm font-medium text-foreground',
  colorSection: 'space-y-2',
  colorWrapper: 'flex items-center gap-3',
  colorInput: 'h-10 w-10 cursor-pointer rounded-lg border border-border p-0.5',
  colorValue: 'text-sm font-mono text-muted-foreground',
  colorHint: 'mt-1.5 text-xs text-muted-foreground',
  swatches: 'mt-1.5 flex flex-wrap gap-2',
  swatch: 'h-6 w-6 rounded-full cursor-pointer border-2 border-transparent transition-all duration-150 hover:scale-110',
  swatchActive: 'ring-2 ring-offset-2 ring-primary',

  // Table
  tableWrapper: 'mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm',
  table: 'w-full text-sm',
  thead: 'border-b border-border bg-muted/40',
  th: 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
  thCenter: 'px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground',
  tr: 'border-b border-border transition-colors duration-150 hover:bg-muted/30 last:border-0',
  td: 'px-4 py-3.5',
  tdCenter: 'px-4 py-3.5 text-center',

  // Cell content
  nameCell: 'flex items-center gap-2.5',
  colorDot: 'h-3.5 w-3.5 rounded-full border border-border shrink-0',
  name: 'text-sm font-medium text-foreground',
  slug: 'text-xs font-mono text-muted-foreground',
  count: 'text-sm text-muted-foreground',

  // Actions
  actions: 'flex items-center justify-center gap-1',
  editBtn: 'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors duration-150',
  deleteBtn: 'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors duration-150',

  // Empty
  emptyRow: 'px-4 py-12 text-center text-sm text-muted-foreground',

  // Error
  error: 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',

  // Edit warning
  editWarning: 'flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400',
  editWarningIcon: 'h-4 w-4 shrink-0',
};
