import Link from 'next/link';
import { PackageSearch } from 'lucide-react';


export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <PackageSearch className="h-16 w-16 text-muted-foreground/40" />
      <h1 className="text-2xl font-semibold">404 — Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to catalog
      </Link>
    </div>
  );
}
