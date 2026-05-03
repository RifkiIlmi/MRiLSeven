"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("search") || "");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleSearch(value: string) {
    setQ(value);

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Debounce 500ms
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    }, 500);
  }

  return (
    <div className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Cari artikel..."
        className="pl-8 pr-4 py-1.5 text-sm border rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        🔍
      </span>
    </div>
  );
}
