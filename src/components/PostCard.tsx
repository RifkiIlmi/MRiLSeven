// src/components/PostCard.tsx
import Link from "next/link";
import Image from "next/image";
import type { PostData } from "@/types";

interface Props {
  post: PostData;
}

export default function PostCard({ post }: Props) {
  return (
    <article className="py-8 border-b border-gray-100 last:border-0 group cursor-pointer">
      <Link href={`/blog/${post.slug}`} className="flex justify-between items-start gap-8">
        <div className="flex-1 min-w-0">
          {/* Author Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">👤</div>
            <span className="text-sm font-medium text-gray-900">{post.author || "Admin"}</span>
            <span className="text-gray-400">·</span>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          {/* Title & Excerpt */}
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-500 font-serif line-clamp-3 mb-4 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Footer Meta */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              {post.tags && post.tags.length > 0 ? (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                  {post.tags[0]}
                </span>
              ) : (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                  General
                </span>
              )}
              <span className="text-xs text-gray-400 font-medium">{post.readingTime || 1} min read</span>
              <span className="text-xs text-gray-400 font-medium">·</span>
              <span className="text-xs text-gray-400 font-medium">{post.views || 0} views</span>
            </div>
          </div>
        </div>

        {/* Thumbnail on the Right */}
        {post.thumbnail && (
          <div className="relative w-24 h-24 sm:w-40 sm:h-32 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100px, 160px"
              className="object-cover"
            />
          </div>
        )}
      </Link>
    </article>
  );
}
