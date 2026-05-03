import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Image from "next/image";
import type { Metadata } from "next";
import type { PostData } from "@/types";

import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS } from "@/lib/constants";
import Link from "next/link";

async function getPost(slug: string): Promise<PostData> {
  try {
    const { data } = await fetcher<PostData>(
      `${process.env.NEXTAUTH_URL}${API_ENDPOINTS.POSTS}/${slug}`,
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

  return (
    <article className="max-w-3xl mx-auto py-10 px-4 md:px-0">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-inner">
            👤
          </div>
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-900">
              {post.author}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.readingTime || 1} min read</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span className="text-gray-400">👁️</span> {post.views || 0}{" "}
                views
              </span>
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

        {post.thumbnail && (
          <div className="relative w-full aspect-video mb-12">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 48rem"
              className="object-cover rounded-lg"
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

      <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
        {post.tags &&
          post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/?tag=${tag}`}
              className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
      </div>
    </article>
  );
}
