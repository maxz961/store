import { api } from "@/lib/api";
import Link from "next/link";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.page) params.set("page", searchParams.page);
  if (searchParams.search) params.set("search", searchParams.search);

  const data = await api.get<{
    items: any[];
    total: number;
    page: number;
    totalPages: number;
  }>(`/products/admin?${params.toString()}`, { cache: "no-store" });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + Add Product
        </Link>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Tags</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((product) => (
              <tr key={product.id} className="border-b hover:bg-muted/20">
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3 text-muted-foreground">{product.category?.name}</td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {product.tags?.slice(0, 3).map((t: any) => (
                      <span key={t.tag.slug} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                        {t.tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-right">${Number(product.price).toFixed(2)}</td>
                <td className="p-3 text-right">{product.stock}</td>
                <td className="p-3 text-center">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${product.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {product.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/admin/products/${product.id}`} className="text-primary hover:underline text-xs">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {data.total} products · Page {data.page} of {data.totalPages}
      </p>
    </div>
  );
}
