import React from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  undiscountedPrice?: number;
}; // Updated Product type

export default function ProductCard({
  product,
}: {
  readonly product: Product;
}) {
  return (
    <div
      className="group relative flex flex-col h-full rounded-xl overflow-hidden 
      shadow-lg bg-gray-900 dark:bg-gray-900 
      border border-gray-700 dark:border-gray-700 
      hover:shadow-xl 
      transition-all duration-300 ease-in-out transform hover:-translate-y-1"
    >
      {/* Image */}
      <Link
        href={`/products/${encodeURIComponent(product.id)}`}
        className="block flex-grow"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-800 dark:bg-gray-800 rounded-t-xl">
          <Image
            src={product.image || "/file.svg"}
            alt={product.title}
            fill
            className="transition-transform duration-300 group-hover:scale-105 object-cover"
            loading="lazy"
          />
          {/* No overlay, just a clean dark background for the image area */}
        </div>

        {/* Content */}
        <div className="p-5 flex-grow flex flex-col justify-between bg-gray-900 dark:bg-gray-900">
          <div>
            <h3
              className="font-extrabold text-xl text-white dark:text-white 
              mb-2 line-clamp-2 tracking-tight"
            >
              {product.title}
            </h3>
            {product.undiscountedPrice &&
            product.undiscountedPrice > product.price ? (
              <div className="flex items-baseline space-x-2">
                <p className="mt-2 text-2xl font-bold text-emerald-400 dark:text-emerald-400">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(product.price)}
                </p>
                <p className="mt-2 text-lg text-gray-500 line-through">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(product.undiscountedPrice)}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-2xl font-bold text-emerald-400 dark:text-emerald-400">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* CTA Button */}
      <div className="p-5 pt-0 bg-gray-900 dark:bg-gray-900">
        <Link
          href={`/products/${encodeURIComponent(product.id)}`}
          className="inline-flex items-center justify-center w-full px-6 py-3 
          text-lg font-semibold text-emerald-400 border border-emerald-400 rounded-xl 
          bg-transparent hover:bg-emerald-400 hover:text-white 
          shadow-md hover:shadow-2xl 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 
          transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
