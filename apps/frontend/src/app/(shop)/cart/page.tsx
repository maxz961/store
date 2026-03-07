"use client";

import { useCartStore } from "@/store/cart";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link
          href="/products"
          className="rounded-md bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border p-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/products/${item.slug}`} className="font-semibold hover:text-primary">
                  {item.name}
                </Link>
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-7 w-7 rounded border text-lg leading-none hover:bg-accent"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-7 w-7 rounded border text-lg leading-none hover:bg-accent"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-sm text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-6 h-fit">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="mb-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${totalPrice().toFixed(2)}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full rounded-md bg-primary py-3 text-center font-medium text-primary-foreground hover:bg-primary/90"
          >
            Checkout
          </Link>
          <button
            onClick={clearCart}
            className="mt-3 w-full text-sm text-muted-foreground hover:text-destructive"
          >
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
