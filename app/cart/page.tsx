// app/cart/page.tsx
"use client";
import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();

  if (items.length === 0)
    return (
      <div className="p-6">
        Cart is empty.{" "}
        <Link href="/products" className="text-emerald-600">
          Shop now
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="flex items-center justify-between bg-gray-400 p-3 rounded shadow"
          >
            <div className="flex text-black items-center gap-3">
              <img
                src={it.image}
                alt={it.title}
                className="w-16 h-16 object-cover"
              />
              <div>
                <div className="font-semibold">{it.title}</div>
                <div>₹{it.price}</div>
              </div>
            </div>
            <div className="flex text-black items-center gap-2">
              <input
                type="number"
                className="w-20 p-1 border rounded"
                value={it.quantity}
                onChange={(e) =>
                  updateQty(it.id, Math.max(1, Number(e.target.value)))
                }
              />
              <button
                onClick={() => removeItem(it.id)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right font-bold">Total: ₹{total}</div>
      <div className="mt-4 text-right">
        <Link
          href="/checkout"
          className="px-4 py-2 bg-emerald-600 text-white rounded"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
