export const s = {
  page: 'mx-auto max-w-2xl px-4 py-8 sm:px-6',
  pageTitle: 'text-2xl font-semibold text-foreground mt-6',

  // Form
  form: 'mt-6 space-y-6',
  card: 'rounded-xl border border-border bg-card p-6 shadow-sm space-y-4',
  cardTitle: 'text-lg font-medium text-foreground',

  // Slug input override
  slugInput: 'bg-muted/50 font-mono text-muted-foreground',

  // Grid
  grid2: 'grid grid-cols-2 gap-4',

  // Lang tabs
  langTabs: 'flex gap-1 rounded-lg border border-border bg-muted/60 p-1 w-fit',
  langTab: 'rounded-md px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
  langTabActive: 'bg-white text-foreground shadow-sm ring-1 ring-border/50 dark:bg-slate-800',

  // Image tabs
  imageTabs: 'flex gap-1 rounded-lg border border-border bg-muted/60 p-1',
  imageTab: 'flex-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground',
  imageTabActive: 'bg-white text-foreground shadow-sm ring-1 ring-border/50 dark:bg-slate-800',
  imageUploadPending: 'flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground',

  // Color picker
  colorSection: 'space-y-2',
  colorLabel: 'text-sm font-medium text-foreground',
  colorHint: 'text-xs text-muted-foreground',
  swatches: 'flex flex-wrap gap-2',
  swatch: 'h-7 w-7 rounded-lg cursor-pointer border-2 border-border transition-all duration-150 hover:scale-110',
  swatchActive: 'border-primary ring-2 ring-primary ring-offset-2',
  colorPreview: 'h-7 w-7 rounded-lg border border-border shrink-0',
  colorRow: 'flex items-end gap-3',

  // Products
  productsWrapper: 'mt-2 flex flex-wrap gap-2',
  productBtn: 'rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-150',
  productBtnActive: 'bg-primary text-primary-foreground border-primary',
  productBtnInactive: 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',

  // Banner current image thumbnail (edit page)
  bannerThumbWrapper: 'relative h-32 w-full overflow-hidden rounded-xl border border-border',
  bannerThumbRemove: 'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive',

  // Error
  error: 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',

  // Danger zone
  dangerZone: 'rounded-xl border border-destructive/30 dark:border-red-800/70 bg-destructive/5 dark:bg-red-900/20 p-6 space-y-4',
  dangerTitle: 'text-lg font-medium text-destructive dark:text-red-400',
  dangerText: 'text-sm text-muted-foreground',
  dangerActions: 'flex gap-3',

  // Preview button (in BannerSection card header)
  previewBtn: 'inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',

  // Preview modal
  previewOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
  previewModal: 'relative w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl',
  previewHeader: 'mb-1 flex items-center justify-between',
  previewTitle: 'text-lg font-medium text-foreground',
  previewClose: 'flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',
  previewHint: 'mb-4 text-sm text-muted-foreground',

  // No-image slide (renders text + bg when image not uploaded yet)
  previewSlide: 'flex items-center justify-between rounded-xl px-8 py-6',
  previewSlideLeft: 'flex flex-col gap-2',
  previewSlideDiscount: 'text-sm font-medium text-primary',
  previewSlideTitle: 'text-lg font-semibold text-foreground',
  previewSlideDesc: 'text-sm text-muted-foreground',
  previewNoImage: 'flex h-24 w-48 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border/50 text-xs text-muted-foreground/60',
};
