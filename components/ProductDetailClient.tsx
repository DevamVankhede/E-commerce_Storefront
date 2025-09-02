"use client";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
};

export default function ProductDetailClient({
  product,
}: {
  readonly product: Product;
}) {
  const { addItem } = useCart();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10">
        {/* Product Image */}
        <div className="md:w-1/2 relative aspect-square bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={product.image || "/file.svg"}
            alt={product.title}
            width={500} // Assuming a reasonable default width
            height={500} // Assuming a reasonable default height
            className="max-h-full max-w-full object-contain p-4"
            loading="eager"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-6">
              {product.price > 0
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(product.price)
                : "Price not available"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line mb-8">
              {product.description}
            </p>
          </div>
          <button
            onClick={() =>
              addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1,
                image: product.image,
              })
            }
            className="w-full px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl text-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
