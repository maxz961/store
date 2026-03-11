export const s = {
  // Carousel wrapper
  wrapper: 'relative mb-6',
  viewport: 'overflow-hidden rounded-xl',
  track: 'flex transition-transform duration-500 ease-in-out',

  // Slide
  slide: 'w-full shrink-0 flex items-center justify-between rounded-xl px-8 py-6 sm:px-12 sm:py-8',
  slideLeft: 'flex flex-col gap-2 max-w-[55%]',
  slideTitle: 'text-lg font-semibold text-foreground sm:text-xl',
  slideDescription: 'text-sm text-muted-foreground line-clamp-2',
  slideDiscount: 'text-sm font-medium text-primary',
  slideLink: 'mt-2 inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 w-fit',
  slideRight: 'hidden sm:flex items-center justify-center max-w-[40%]',
  slideImage: 'max-h-[120px] w-auto object-contain',

  // Navigation arrows
  arrowBase: 'absolute top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 border border-border shadow-sm transition-colors duration-150 hover:bg-background',
  arrowLeft: 'left-2',
  arrowRight: 'right-2',

  // Dots
  dotsWrapper: 'flex justify-center gap-1.5 mt-3',
  dot: 'h-1.5 w-1.5 rounded-full transition-colors duration-150',
  dotActive: 'bg-primary',
  dotInactive: 'bg-border',
};
