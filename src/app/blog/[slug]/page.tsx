import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Image from "next/image";
import type { Metadata } from "next";
import type { PostData } from "@/types";

import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";
import Link from "next/link";
import ShareButtons from "@/components/ShareButtons";

async function getPost(slug: string): Promise<PostData> {
  const port = process.env.PORT || "3000";
  const baseUrl = `http://localhost:${port}`;
  try {
    const { data } = await fetcher<PostData>(
      `${baseUrl}${API_ENDPOINTS.POSTS}/${slug}`,
      { cache: "no-store" },
    );
    return data!;
  } catch (err) {
    throw new Error("Artikel tidak ditemukan");
  }
}

// Dynamic metadata untuk SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.thumbnail || "/logo-mrilseven-removebg.png",
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Person",
      "name": post.author,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-3xl mx-auto py-10 px-4 md:px-0">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-10 gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-inner border border-gray-50">
                👤
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900">
                  {post.author}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.readingTime || 1} min read</span>
                  <span>·</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="flex items-center gap-1 text-sm text-gray-400">
                👁️ {post.views || 0} views
              </span>
            </div>
          </div>

          {post.thumbnail && (
            <div className="relative w-full aspect-video mb-12">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 48rem"
                className="object-cover rounded-2xl shadow-xl shadow-gray-200"
                priority
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-lg prose-serif max-w-none
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:leading-relaxed prose-p:text-gray-800 font-serif"
        >
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Share & Tags Section */}
        <div className="mt-20 py-10 border-t border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-wrap gap-2">
            {post.tags &&
              post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?tag=${tag}`}
                  className="bg-gray-50 px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-900 hover:text-white transition-all uppercase tracking-wider"
                >
                  #{tag}
                </Link>
              ))}
          </div>
          
          <ShareButtons title={post.title} url={`${process.env.NEXTAUTH_URL}/blog/${post.slug}`} />
        </div>

        {/* Comment Section Placeholder */}
        <section className="mt-20">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Responses</h3>
          <div className="bg-gray-50 p-10 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-600 max-w-xs mx-auto">
              Sistem komentar sedang disiapkan. Segera hadir untuk mendiskusikan artikel ini!
            </p>
          </div>
        </section>
      </article>
    </>
  );
}

