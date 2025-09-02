"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleStartShopping = () => {
    if (isLoggedIn) {
      router.push("/products");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden font-sans">
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-8 drop-shadow-lg leading-tight tracking-tight animate-fade-in-up">
          Welcome to Your <span className="text-emerald-400">Premium</span>{" "}
          E-commerce Experience
        </h1>
        <p className="text-xl text-gray-300 opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          Discover a curated selection of high-quality products, designed for
          your modern lifestyle. Shop with confidence and unparalleled style.
        </p>
        <button
          onClick={handleStartShopping}
          className="inline-flex items-center justify-center px-12 py-5 border border-transparent text-lg font-semibold rounded-full shadow-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 animate-pop-in delay-200"
        >
          Start Shopping
          <svg
            className="ml-3 -mr-1 w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
