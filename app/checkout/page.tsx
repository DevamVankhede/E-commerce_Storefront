// app/checkout/page.tsx
"use client";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fake "submit": in real app call API here
    console.log("Order", { name, address, items, total });
    clearCart();
    setDone(true);
  };

  if (done) return <div className="p-6">✅ Order placed. Thank you!</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full p-2 border rounded"
          required
        />
        <div className="font-bold">Total: ₹{total}</div>
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Place Order
        </button>
      </form>
    </div>
  );
}
