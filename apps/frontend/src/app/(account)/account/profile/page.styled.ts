export const s = {
  page: 'mx-auto max-w-3xl px-4 py-8 sm:px-6',
  title: 'text-2xl font-semibold tracking-tight',

  // Profile card
  card: 'rounded-xl border border-border bg-card p-6',
  cardHeader: 'flex items-center gap-5',
  avatar: 'h-16 w-16 shrink-0 rounded-full object-cover',
  avatarFallback: 'flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-medium text-primary',
  userInfo: 'flex-1 min-w-0',
  userName: 'text-lg font-medium truncate',
  userEmail: 'text-sm text-muted-foreground truncate',
  userMeta: 'mt-1 text-xs text-muted-foreground',

  // Actions
  actions: 'mt-6 flex items-center gap-3 border-t border-border pt-6',

  // Quick links
  section: 'mt-8',
  sectionTitle: 'text-lg font-medium mb-4',
  linkCard: 'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-150 hover:bg-accent',
  linkIcon: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
  linkInfo: 'flex-1 min-w-0',
  linkTitle: 'text-sm font-medium',
  linkDescription: 'text-xs text-muted-foreground',
  linkArrow: 'h-4 w-4 text-muted-foreground',

  // Loading
  skeleton: 'animate-pulse rounded-md bg-muted',

  // Not authenticated
  notAuth: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  notAuthTitle: 'text-lg font-medium',
  notAuthText: 'text-sm text-muted-foreground',
};
