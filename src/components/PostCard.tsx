// src/components/PostCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { PostData } from "@/types";

interface Props {
  post: PostData;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="py-10 border-b border-gray-100 last:border-0 group">
      <div className="flex justify-between items-start gap-6 md:gap-12">
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 border border-gray-200">👤</div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-tight">{post.author || "Admin"}</span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {/* Main Link for Title & Excerpt */}
          <Link href={`/blog/${post.slug}`} className="block group/content">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover/content:text-gray-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-500 font-serif text-base line-clamp-2 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          </Link>

          {/* Footer Meta - Tags outside the main link */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {post.tags && post.tags.length > 0 ? (
                <Link 
                  href={`/?tag=${post.tags[0]}`}
                  className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {post.tags[0]}
                </Link>
              ) : (
                <span className="bg-gray-50 px-3 py-1 rounded-full text-xs font-medium text-gray-400">
                  General
                </span>
              )}
              <span className="text-xs text-gray-400 font-medium">{post.readingTime || 1} min read</span>
              <span className="text-xs text-gray-400 font-medium">·</span>
              <span className="text-xs text-gray-400 font-medium">{post.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Thumbnail on the Right - Also a Link */}
        {post.thumbnail && (
          <Link href={`/blog/${post.slug}`} className="relative w-24 h-24 sm:w-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-md block hover:opacity-90 transition-opacity">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100px, 160px"
              className="object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
