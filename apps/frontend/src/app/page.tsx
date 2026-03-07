import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Store</h1>
      <p className="text-muted-foreground">Welcome to the online store</p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Browse Products
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-input px-6 py-2 hover:bg-accent"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
