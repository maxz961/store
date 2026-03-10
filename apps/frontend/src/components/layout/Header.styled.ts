export const s = {
  header: 'sticky top-0 z-50 border-b border-border bg-card shadow-sm',
  container: 'mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6',
  logo: 'flex items-center gap-2 text-lg font-semibold text-foreground shrink-0',
  logoIcon: 'h-5 w-5 text-primary',
  searchForm: 'flex-1 max-w-xl mx-auto',
  searchWrapper: 'relative flex items-center',
  searchInput: 'w-full h-9 rounded-lg border border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground/60 outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20',
  searchIcon: 'absolute left-3 h-4 w-4 text-muted-foreground/50',
  actions: 'flex items-center gap-1 shrink-0',
  sunIcon: 'h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
  moonIcon: 'absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
  cartIcon: 'h-4 w-4',
  cartBadge: 'absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground',

  // User menu
  userButton: 'relative h-8 w-8 rounded-full overflow-hidden border border-border transition-colors duration-150 hover:border-primary cursor-pointer',
  userAvatar: 'h-full w-full object-cover',
  userFallback: 'flex h-full w-full items-center justify-center bg-primary/10 text-xs font-medium text-primary',
  loginButton: 'text-sm',

  // Dropdown content
  dropdownHeader: 'px-4 py-3 border-b border-border',
  dropdownName: 'text-sm font-medium truncate',
  dropdownEmail: 'text-xs text-muted-foreground truncate',
  dropdownItem: 'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-accent',
  dropdownIcon: 'h-4 w-4 text-muted-foreground',
  dropdownDivider: 'my-1 border-t border-border',
  dropdownDanger: 'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive transition-colors duration-150 hover:bg-accent',
};
