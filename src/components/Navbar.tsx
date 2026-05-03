"use client";
import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "./SearchBar";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif font-bold text-3xl tracking-tight text-gray-900">
          MrilSeven
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Suspense fallback={<div className="w-52 h-8" />}>
            <SearchBar />
          </Suspense>
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Beranda
          </Link>
          
          {loading ? (
            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
