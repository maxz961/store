'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';


interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}


export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertCircle className="h-16 w-16 text-destructive/60" />
      <h1 className="text-2xl font-semibold">Admin panel error</h1>
      <p className="text-sm text-muted-foreground">
        An unexpected error occurred in the admin panel.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
