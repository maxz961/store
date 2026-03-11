export const s = {
  container: 'space-y-3',

  // Drop zone
  dropzone: 'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors duration-150 hover:border-primary/50 hover:bg-accent/50',
  dropzoneActive: 'border-primary bg-primary/5',
  dropzoneIcon: 'h-8 w-8 text-muted-foreground',
  dropzoneText: 'text-sm text-muted-foreground',
  dropzoneHint: 'text-xs text-muted-foreground/60',

  // Thumbnails
  thumbnails: 'flex flex-wrap gap-2',
  thumb: 'group relative h-20 w-20 overflow-hidden rounded-lg border border-border bg-white',
  thumbImage: 'h-full w-full object-cover',
  thumbRemove: 'absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100',
};
