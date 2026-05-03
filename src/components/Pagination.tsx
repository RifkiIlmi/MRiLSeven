// src/components/Pagination.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import type { PaginationMeta } from "@/types";

export default function Pagination({ meta }: { meta: PaginationMeta }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button
        onClick={() => goToPage(meta.page - 1)}
        disabled={meta.page === 1}
        className="px-4 py-2 text-sm rounded-lg border disabled:opacity-40 hover:bg-gray-50"
      >
        ← Sebelumnya
      </button>
      {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`w-10 h-10 text-sm rounded-lg border ${
            p === meta.page
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => goToPage(meta.page + 1)}
        disabled={meta.page === meta.totalPages}
        className="px-4 py-2 text-sm rounded-lg border disabled:opacity-40 hover:bg-gray-50"
      >
        Selanjutnya →
      </button>
    </div>
  );
}
