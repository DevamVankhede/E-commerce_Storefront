"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react"; // Added Menu and X icons
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { isLoggedIn, username, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const { items } = useCart();
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [items]
  );

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg p-4 font-sans relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-3xl font-extrabold tracking-tight text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
        >
          E-Shop
        </Link>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Menu className="w-7 h-7 text-white" />
            )}
          </button>
        </div>

        {/* Desktop and Mobile Menu */}
        <div
          className={`absolute md:relative top-full left-0 w-full md:w-auto bg-gradient-to-r from-gray-900 to-gray-800 md:bg-none shadow-lg md:shadow-none transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row items-center gap-6 py-4 md:py-0`}
        >
          {/* Always visible */}
          <Link
            href="/"
            className="text-lg font-medium text-gray-200 hover:text-emerald-400 transition-colors duration-300"
          >
            Home
          </Link>

          {/* If NOT logged in → only show Login */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="text-lg font-medium text-gray-200 hover:text-emerald-400 transition-colors duration-300"
            >
              Login
            </Link>
          ) : (
            <>
              {/* Show Products link after login */}
              <Link
                href="/products"
                className="text-lg font-medium text-gray-200 hover:text-emerald-400 transition-colors duration-300"
              >
                Products
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
              >
                <ShoppingCart className="w-6 h-6 text-emerald-300" />
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
                <span className="hidden md:inline text-lg font-medium text-gray-200">
                  Cart
                </span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <User className="w-6 h-6 text-emerald-300" />
                  <span className="text-lg font-medium text-gray-200">
                    {username}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-xl py-2 z-10 animate-fade-in-down">
                    <div className="px-4 py-3 border-b border-gray-600 font-medium text-gray-200">
                      Hello, {username}!
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors duration-200 text-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
