import { api } from "@/lib/api";
import { notFound } from "next/navigation";

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stock: number;
  category: { name: string; slug: string };
  tags: { tag: { name: string; slug: string } }[];
  reviews: {
    id: string;
    rating: number;
    comment?: string;
    user: { name?: string; image?: string };
    createdAt: string;
  }[];
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product: ProductDetail;

  try {
    product = await api.get<ProductDetail>(`/products/${params.slug}`, {
      cache: "no-store",
    });
  } catch {
    notFound();
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full rounded-lg object-cover"
          />
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img, i) => (
                <img key={i} src={img} alt="" className="rounded-md object-cover" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="mb-1 text-sm text-muted-foreground">{product.category.name}</p>
          <h1 className="mb-3 text-3xl font-bold">{product.name}</h1>

          <div className="mb-4 flex flex-wrap gap-1">
            {product.tags.map(({ tag }) => (
              <span
                key={tag.slug}
                className="rounded-full bg-secondary px-3 py-1 text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">${Number(product.price).toFixed(2)}</span>
            {product.comparePrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${Number(product.comparePrice).toFixed(2)}
              </span>
            )}
          </div>

          {avgRating && (
            <p className="mb-4 text-sm text-muted-foreground">
              ★ {avgRating.toFixed(1)} ({product.reviews.length} reviews)
            </p>
          )}

          <p className="mb-6 text-muted-foreground">{product.description}</p>

          <p className="mb-4 text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} in stock</span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </p>

          <button
            className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-3">
                  {review.user.image && (
                    <img
                      src={review.user.image}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="font-medium">{review.user.name ?? "Anonymous"}</span>
                  <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                </div>
                {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
