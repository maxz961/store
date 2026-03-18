export const s = {
  wrapper: 'flex min-h-[calc(100vh-3.5rem)]',

  // Desktop sidebar
  sidebar: 'hidden lg:flex lg:w-56 shrink-0 flex-col border-r border-border bg-card',
  // Mobile sidebar overlay
  sidebarMobileOpen: 'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card shadow-xl',

  sidebarInner: 'flex flex-col gap-1 px-3 py-6 flex-1 overflow-y-auto',
  sidebarTitle: 'mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground',
  navLink: 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground',
  navLinkActive: 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary bg-primary/10',
  navIcon: 'h-4 w-4',
  navLabelGroup: 'flex items-center gap-1.5',
  navBadge: 'flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground',
  navBadgeWarning: 'flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-medium text-white',
  navWarningIcon: 'h-3.5 w-3.5 text-orange-500',

  // Mobile overlay
  backdrop: 'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden',
  drawerHeader: 'flex shrink-0 items-center justify-between border-b border-border px-3 py-3',
  drawerClose: 'flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',

  // Mobile menu button (inside main content)
  mobileMenuBar: 'flex items-center gap-3 border-b border-border px-4 py-2 lg:hidden',
  mobileMenuBtn: 'flex items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',

  content: 'flex-1 min-w-0',
};
