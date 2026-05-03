"use client";

import { useQuery } from "@tanstack/react-query";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { PostData, PaginationMeta, ApiResponse } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";

interface PostListProps {
  page: number;
  search: string;
  initialData?: ApiResponse<PostData[]>;
}

export default function PostList({ page, search, initialData }: PostListProps) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...(search && { search }),
      });
      return fetcher<PostData[]>(`${API_ENDPOINTS.POSTS}?${params}`);
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">
          {error?.message ||
            data?.error ||
            "Terjadi kesalahan saat memuat artikel."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const posts: PostData[] = data?.data || [];
  const meta = (data?.meta as PaginationMeta) || { total: 0, page: 1, limit: 9, totalPages: 0 };

  return (
    <>
      <div className="space-y-2">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            Belum ada artikel.
          </div>
        ) : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {posts.length > 0 && <Pagination meta={meta} />}
    </>
  );
}
