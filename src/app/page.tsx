import PostList from "@/components/PostList";
import type { Metadata } from "next";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";
import { ApiResponse, PostData } from "@/types";

export const metadata: Metadata = {
  title: "Beranda — Semua Artikel",
};

interface HomeProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";

  // Fetch data on server for better performance
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  let initialData: ApiResponse<PostData[]> | undefined = undefined;
  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "9",
      ...(search && { search }),
    });
    initialData = await fetcher<PostData[]>(`${baseUrl}${API_ENDPOINTS.POSTS}?${query}`, {
      cache: "no-store",
    });
  } catch (err) {
    console.error("Failed to fetch initial posts:", err);
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Hero Section - Medium style */}
      {!search && (
        <div className="py-20 border-b border-gray-900 mb-16">
          <h1 className="text-7xl md:text-9xl font-serif font-medium tracking-tight text-gray-900 mb-8">
            MrilSeven
          </h1>
          <p className="text-2xl md:text-3xl font-serif italic text-gray-600 max-w-2xl leading-snug">
            Write, read, and connect with the world through technology and stories.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-16">
        {/* Main Feed */}
        <div className="flex-[2]">
          <PostList page={page} search={search} initialData={initialData} />
        </div>

        {/* Sidebar - Medium style */}
        <div className="flex-1 hidden md:block border-l pl-12 border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Trending on MrilSeven</h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <span className="text-3xl font-bold text-gray-100">01</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gray-200" />
                  <span className="text-xs font-medium text-gray-900">Admin</span>
                </div>
                <h4 className="font-bold text-sm line-clamp-2">Tips Memilih Stack Next.js 15</h4>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-3xl font-bold text-gray-100">02</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 rounded-full bg-gray-200" />
                  <span className="text-xs font-medium text-gray-900">Rifki</span>
                </div>
                <h4 className="font-bold text-sm line-clamp-2">Migrasi ke MongoDB Atlas</h4>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="font-bold text-gray-900 mb-4">Recommended topics</h3>
            <div className="flex flex-wrap gap-2">
              {['Tech', 'Programming', 'Next.js', 'Life', 'Design'].map(tag => (
                <span key={tag} className="bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
