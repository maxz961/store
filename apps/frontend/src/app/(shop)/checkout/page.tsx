"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type DeliveryMethod = "COURIER" | "PICKUP" | "POST";

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; description: string }[] = [
  { value: "COURIER", label: "Courier", description: "Delivery to your address" },
  { value: "PICKUP", label: "Pickup", description: "Pick up at our location" },
  { value: "POST", label: "Post", description: "Postal delivery" },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("COURIER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const order = await api.post("/orders", {
        deliveryMethod,
        shippingAddress: address,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });

      clearCart();
      router.push(`/orders/${(order as { id: string }).id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Method */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Delivery Method</h2>
          <div className="grid grid-cols-3 gap-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDeliveryMethod(opt.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  deliveryMethod === opt.value
                    ? "border-primary bg-primary/10"
                    : "hover:bg-accent"
                }`}
              >
                <div className="font-medium">{opt.label}</div>
                <div className="text-xs text-muted-foreground">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h2 className="mb-3 text-lg font-semibold">Shipping Address</h2>
          <div className="space-y-3">
            <input
              placeholder="Full Name"
              required
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Address Line 1"
              required
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              placeholder="Address Line 2 (optional)"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="City"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="State / Region"
                required
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Postal Code"
                required
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="Country (e.g. US)"
                required
                maxLength={2}
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value.toUpperCase() })}
                className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-1 text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
