export const s = {
  page: 'mx-auto max-w-3xl px-4 py-8 sm:px-6',
  header: 'mb-6',
  pageTitle: 'text-2xl font-semibold tracking-tight',
  pageSubtitle: 'mt-1 text-sm text-muted-foreground',

  // Chat container
  chatCard: 'rounded-xl border border-border bg-card overflow-hidden flex flex-col',
  chatMessages: 'flex flex-col gap-3 p-4 min-h-[400px] max-h-[500px] overflow-y-auto',
  emptyState: 'flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center',
  emptyIcon: 'h-10 w-10 text-muted-foreground/50',
  emptyTitle: 'text-sm font-medium text-muted-foreground',
  emptyText: 'text-xs text-muted-foreground',

  // Message bubbles
  messageRowUser: 'flex justify-end',
  messageRowAdmin: 'flex justify-start',
  messageWrapperUser: 'max-w-[75%]',
  messageWrapperAdmin: 'max-w-[75%]',
  bubbleUser: 'rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground break-words',
  bubbleAdmin: 'rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm break-words',
  messageTime: 'mt-1 text-[11px] text-muted-foreground',
  messageTimeUser: 'mt-1 text-[11px] text-primary/70 text-right',

  // Admin label
  adminLabel: 'text-xs font-medium text-muted-foreground mb-1',

  // Input area
  inputArea: 'border-t border-border p-4',
  inputRow: 'flex items-end gap-3',
  textarea: 'flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] max-h-[160px]',
  sendButton: 'h-[44px] w-[110px] shrink-0',

  // Status
  notAuth: 'flex min-h-[400px] flex-col items-center justify-center gap-4 text-center',
  notAuthTitle: 'text-lg font-medium',
  notAuthText: 'text-sm text-muted-foreground',
};
