"use client";

import { useState, useEffect } from "react";
import { When } from "react-if";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "0",
    sku: "",
    categoryId: "",
    isPublished: false,
    images: "",
  });

  useEffect(() => {
    Promise.all([
      api.get<{ id: string; name: string }[]>("/categories"),
      api.get<{ id: string; name: string }[]>("/tags"),
    ]).then(([cats, tgs]) => {
      setCategories(cats);
      setTags(tgs);
    });
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, name, slug }));
  };

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/products", {
        ...form,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        stock: parseInt(form.stock),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        tagIds: selectedTags,
      });
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Product Name"
          required
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          placeholder="Slug (auto-generated)"
          required
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          placeholder="Description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Price"
            required
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            placeholder="Compare Price (optional)"
            type="number"
            step="0.01"
            min="0"
            value={form.comparePrice}
            onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Stock"
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            placeholder="SKU (optional)"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          placeholder="Image URLs (comma-separated)"
          required
          value={form.images}
          onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {/* Tags */}
        <When condition={tags.length > 0}>
          <div>
            <p className="mb-2 text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </When>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
          />
          Publish immediately
        </label>

        <When condition={!!error}>
          <p className="text-sm text-destructive">{error}</p>
        </When>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
