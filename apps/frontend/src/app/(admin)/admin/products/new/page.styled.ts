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
  imageTabs: 'flex gap-1 rounded-lg bg-muted p-1',
  imageTab: 'flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150',
  imageTabActive: 'bg-background text-foreground shadow-sm',

  // Buttons row
  buttonsRow: 'flex gap-3',

  // Error
  error: 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',

  // Preview modal
  previewOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
  previewModal: 'relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-xl',
  previewClose: 'absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150',
  previewBadge: 'inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary',
  previewTitle: 'mt-4 text-xl font-semibold text-foreground',
  previewPrice: 'mt-2 flex items-baseline gap-2',
  previewCurrentPrice: 'text-2xl font-semibold text-foreground',
  previewComparePrice: 'text-base text-muted-foreground line-through',
  previewDescription: 'mt-4 text-sm leading-relaxed text-muted-foreground',
  previewGallery: 'grid grid-cols-4 gap-2',
  previewMainImage: 'col-span-4 aspect-video overflow-hidden rounded-lg border border-border bg-muted',
  previewThumb: 'aspect-square overflow-hidden rounded-lg border border-border bg-muted',
  previewMeta: 'mt-4 flex flex-wrap gap-2',
  previewTag: 'rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground',
  previewEmpty: 'flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground',
};
