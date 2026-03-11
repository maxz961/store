export const s = {
  page: 'mx-auto max-w-2xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',
  pageTitle: 'text-2xl font-semibold text-foreground mt-6',

  // Form
  form: 'mt-6 space-y-6',
  card: 'rounded-xl border border-border bg-card p-6 shadow-sm space-y-4',
  cardTitle: 'text-lg font-medium text-foreground',

  // Slug input override
  slugInput: 'bg-muted/50 font-mono text-muted-foreground',

  // Grid
  grid2: 'grid grid-cols-2 gap-4',

  // Tags
  tagsTitle: 'text-sm font-medium text-foreground',
  tagsWrapper: 'mt-2 flex flex-wrap gap-2',
  tagBtn: 'rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-150',
  tagBtnActive: 'bg-primary text-primary-foreground border-primary',
  tagBtnInactive: 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',

  // Image tabs
  imageTabs: 'flex gap-1 rounded-lg border border-border bg-muted/60 p-1',
  imageTab: 'flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
  imageTabActive: 'bg-white text-foreground shadow-sm ring-1 ring-border/50 dark:bg-slate-800',

  // Buttons row
  buttonsRow: 'flex gap-3',
  previewBtn: 'border-border bg-card hover:bg-accent',

  // Error
  error: 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',

  // Preview modal
  previewOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
  previewModal: 'relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-border bg-background px-6 py-8 shadow-xl sm:px-8',
  previewClose: 'absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150',
  previewLayout: 'grid grid-cols-1 gap-8 lg:grid-cols-2',
};
