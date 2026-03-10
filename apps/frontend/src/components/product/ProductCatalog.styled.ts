export const s = {
  layout: 'flex flex-col gap-6 lg:flex-row',
  sidebar: 'w-full lg:w-52 shrink-0',
  content: 'flex-1 relative min-h-[200px]',
  loadingOverlay: 'absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px] rounded-xl',
  spinner: 'h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary',
  grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4',
  empty: 'flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center',
  emptyTitle: 'text-base font-medium',
  emptyText: 'mt-1 text-sm text-muted-foreground',
  error: 'flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 py-20 text-center',
  errorTitle: 'text-base font-medium text-destructive',
  errorText: 'mt-1 text-sm text-muted-foreground',
};
