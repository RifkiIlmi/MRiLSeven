import PostList from "@/components/PostList";
import type { Metadata } from "next";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";
import { ApiResponse, PostData } from "@/types";

export const metadata: Metadata = {
  title: "Beranda — Semua Artikel",
};

interface HomeProps {
  searchParams: Promise<{ page?: string; search?: string; tag?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const search = params.search || "";
  const tag = params.tag || "";

  // Fetch data on server for better performance
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  let initialData: ApiResponse<PostData[]> | undefined = undefined;
  let trendingPosts: PostData[] = [];
  let topTags: string[] = [];

  try {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: "9",
      ...(search && { search }),
      ...(tag && { tag }),
    });

    // Parallel fetch for better performance
    const [postsRes, trendingRes, tagsRes] = await Promise.all([
      fetcher<PostData[]>(`${baseUrl}${API_ENDPOINTS.POSTS}?${query}`, {
        cache: "no-store",
      }),
      fetcher<PostData[]>(
        `${baseUrl}${API_ENDPOINTS.POSTS}?sort=views&limit=3`,
        { cache: "no-store" },
      ),
      fetcher<string[]>(`${baseUrl}/api/tags`, { cache: "no-store" }),
    ]);

    initialData = postsRes;
    trendingPosts = trendingRes.data || [];
    topTags = tagsRes.data || [
      "Tech",
      "Programming",
      "Next.js",
      "Lifestyle",
      "Design",
    ];
  } catch (err) {
    console.error("Failed to fetch initial data:", err);
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
            Bite-sized brilliance. Master the complex in less than 7 minutes.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-16">
        {/* Main Feed */}
        <div className="flex-[2]">
          {tag && (
            <div className="mb-8 flex items-center gap-3">
              <span className="text-gray-500">Showing stories in:</span>
              <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                #{tag}
                <Link href="/" className="hover:text-gray-300 ml-1">
                  ×
                </Link>
              </span>
            </div>
          )}
          <PostList
            page={page}
            search={search}
            tag={tag}
            initialData={initialData}
          />
        </div>

        {/* Sidebar - Medium style */}
        <div className="flex-1 hidden md:block border-l pl-12 border-gray-100 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-6 uppercase text-xs tracking-widest">
            Trending on MrilSeven
          </h3>
          <div className="space-y-8">
            {trendingPosts.map((p, idx) => (
              <div key={p._id} className="flex gap-4 items-start">
                <span className="text-3xl font-bold text-gray-100 leading-none">
                  0{idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px]">
                      👤
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      {p.author || "Admin"}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="font-bold text-sm line-clamp-2 hover:text-gray-600 transition-colors"
                  >
                    {p.title}
                  </Link>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {p.readingTime} min read
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-widest">
              Recommended topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {topTags.map((t) => (
                <Link
                  key={t}
                  href={`/?tag=${t}`}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    tag === t
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
