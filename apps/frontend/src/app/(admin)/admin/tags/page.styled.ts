export const s = {
  page: 'mx-auto max-w-4xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',

  // Form card
  formCard: 'mt-6 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4',
  formTitle: 'text-lg font-medium text-foreground',
  formRow: 'grid grid-cols-1 gap-4 sm:grid-cols-3',

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
};
