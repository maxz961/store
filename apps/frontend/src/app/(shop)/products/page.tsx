import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: { name: string; slug: string };
  tags: { tag: { name: string; slug: string } }[];
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; categorySlug?: string; tagSlugs?: string; page?: string };
}) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.categorySlug) params.set("categorySlug", searchParams.categorySlug);
  if (searchParams.tagSlugs) params.set("tagSlugs", searchParams.tagSlugs);
  if (searchParams.page) params.set("page", searchParams.page);

  const data = await api.get<ProductsResponse>(
    `/products?${params.toString()}`,
    { cache: "no-store" }
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      {data.items.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.items.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.slug}`}
              className="group rounded-lg border p-4 transition-shadow hover:shadow-md"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="mb-3 h-48 w-full rounded object-cover"
              />
              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.map(({ tag }) => (
                  <span
                    key={tag.slug}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <h2 className="font-semibold group-hover:text-primary">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.category.name}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-bold">${Number(product.price).toFixed(2)}</span>
                {product.comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${Number(product.comparePrice).toFixed(2)}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
        <span>{data.total} products</span>
        <span>Page {data.page} of {data.totalPages}</span>
      </div>
    </div>
  );
}
