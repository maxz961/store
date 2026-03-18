export const s = {
  page: 'mx-auto max-w-3xl px-4 py-8 sm:px-6',

  // Header
  backLink: 'mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150',
  userHeader: 'mb-4 flex items-center gap-3',
  avatar: 'h-10 w-10 shrink-0 rounded-full object-cover border border-border bg-muted',
  avatarFallback: 'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground',
  userInfo: 'min-w-0',
  userName: 'text-base font-medium truncate',
  userEmail: 'text-xs text-muted-foreground truncate',

  // Chat
  chatCard: 'rounded-xl border border-border bg-card overflow-hidden flex flex-col',
  chatMessages: 'flex flex-col gap-3 p-4 min-h-[400px] max-h-[500px] overflow-y-auto',
  emptyState: 'flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center',
  emptyText: 'text-sm text-muted-foreground',

  // Bubbles
  messageRowUser: 'flex justify-end',
  messageRowAdmin: 'flex justify-start',
  messageWrapper: 'max-w-[75%]',
  bubbleUser: 'rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 text-sm break-words',
  bubbleAdmin: 'rounded-2xl rounded-tl-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground break-words',
  senderLabel: 'text-xs font-medium text-muted-foreground mb-1',
  senderLabelRight: 'text-xs font-medium text-muted-foreground mb-1 text-right',
  messageTime: 'mt-1 text-[11px] text-muted-foreground',
  messageTimeRight: 'mt-1 text-[11px] text-muted-foreground text-right',

  // Input
  inputArea: 'border-t border-border p-4',
  inputRow: 'flex items-end gap-3',
  textarea: 'flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] max-h-[160px]',
  sendButton: 'h-[44px] w-[110px] shrink-0',
};
