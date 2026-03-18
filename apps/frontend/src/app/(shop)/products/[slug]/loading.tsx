const ProductLoading = () => (
  <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6">
    {/* Breadcrumbs */}
    <div className="mb-6 flex items-center gap-2">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2 animate-pulse rounded bg-muted" />
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="h-4 w-2 animate-pulse rounded bg-muted" />
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Gallery skeleton */}
      <div className="space-y-3">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-16 shrink-0 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>

      {/* Info skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-10 w-40 animate-pulse rounded bg-muted" />
        <div className="border-t border-border" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-3">
          <div className="h-11 w-11 animate-pulse rounded-lg bg-muted" />
          <div className="h-11 flex-1 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductLoading;
