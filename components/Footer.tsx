import Link from "next/link";
import { Globe } from "lucide-react"; // Changed from specific social media icons to a generic Globe icon

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 mt-20 py-10 border-t border-gray-700 shadow-inner font-sans">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <p className="mb-6 md:mb-0 text-gray-400 text-base">
          &copy; {year} E-Shop. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center items-center mb-6 md:mb-0">
          <Link
            href="/"
            className="hover:text-emerald-400 transition-colors duration-300 text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-emerald-400 transition-colors duration-300 text-base font-medium"
          >
            Products
          </Link>
          <Link
            href="/about"
            className="hover:text-emerald-400 transition-colors duration-300 text-base font-medium"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="hover:text-emerald-400 transition-colors duration-300 text-base font-medium"
          >
            Contact
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link
            href="/"
            className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            aria-label="Facebook"
          >
            <Globe className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            aria-label="Twitter"
          >
            <Globe className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            aria-label="Instagram"
          >
            <Globe className="w-6 h-6" />
          </Link>
          <Link
            href="/"
            className="text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Globe className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
