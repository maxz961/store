export const s = {
  page: 'mx-auto max-w-2xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold text-foreground',

  // Form
  form: 'mt-6 space-y-6',
  card: 'rounded-xl border border-border bg-card p-6 shadow-sm space-y-4',
  cardTitle: 'text-lg font-medium text-foreground',

  // Field
  fieldGroup: 'space-y-1.5',
  label: 'block text-sm font-medium text-foreground',
  input: 'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-150',
  textarea: 'flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-150 resize-none',
  select: 'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-150',
  hint: 'text-xs text-muted-foreground',
  slugInput: 'flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-mono text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors duration-150',

  // Grid
  grid2: 'grid grid-cols-2 gap-4',

  // Tags
  tagsTitle: 'text-sm font-medium text-foreground',
  tagsWrapper: 'mt-2 flex flex-wrap gap-2',
  tagBtn: 'rounded-full px-3 py-1.5 text-sm font-medium border transition-colors duration-150',
  tagBtnActive: 'bg-primary text-primary-foreground border-primary',
  tagBtnInactive: 'border-border text-muted-foreground hover:bg-accent hover:text-foreground',

  // Checkbox
  checkboxLabel: 'flex items-center gap-2.5 text-sm text-foreground cursor-pointer',
  checkbox: 'h-4 w-4 rounded border-input accent-primary',

  // Error / submit
  error: 'rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive',
};
