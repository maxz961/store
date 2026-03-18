export const s = {
  layout: 'flex flex-col gap-6 lg:flex-row',
  sidebar: 'hidden lg:block w-64 shrink-0',
  content: 'flex-1 relative min-h-[200px]',

  mobileFilterBtn: 'flex lg:hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-150 hover:bg-accent',

  // Drawer
  backdrop: 'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm',
  drawer: 'fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col bg-background shadow-xl',
  drawerHeader: 'flex shrink-0 items-center justify-between border-b border-border px-4 py-3',
  drawerTitle: 'text-sm font-semibold',
  drawerClose: 'flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
  drawerBody: 'flex-1 overflow-y-auto p-4',

  // Pagination
  loadingOverlay: 'fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-[1px] pointer-events-none',
  grid: 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4',
  empty: 'flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center',
  emptyTitle: 'text-base font-medium',
  emptyText: 'mt-1 text-sm text-muted-foreground',
  error: 'flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 py-20 text-center',
  errorTitle: 'text-base font-medium text-destructive',
  errorText: 'mt-1 text-sm text-muted-foreground',
  pagination: 'mt-10 flex items-center justify-between gap-4',
  paginationArrow: 'flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors duration-150 hover:bg-accent disabled:pointer-events-none disabled:opacity-40',
  paginationNumbers: 'flex items-center gap-1',
  paginationNumber: 'flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-sm text-foreground shadow-sm transition-colors duration-150 hover:bg-accent',
  paginationNumberActive: 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
  paginationDots: 'flex h-9 w-9 items-center justify-center text-sm text-muted-foreground',
};
