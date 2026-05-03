"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PostData } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { useAuth } from "@/components/AuthContext";

export default function AdminPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await fetcher<PostData[]>(`${API_ENDPOINTS.POSTS}?limit=100&all=true`, {
          cache: "no-store"
        });
        setPosts(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat artikel",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  async function deletePost(id: string) {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      await fetcher(`${API_ENDPOINTS.POSTS}/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Gagal menghapus artikel");
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
  const totalDrafts = posts.filter(post => !post.published).length;

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex justify-between items-end mb-10 px-4 md:px-0">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">Manage your stories and monitor performance.</p>
        </div>
        <div className="flex gap-4">
          {user?.role === "admin" && (
            <Link
              href="/admin/users"
              className="border border-gray-200 text-gray-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Manage Users
            </Link>
          )}
          <Link
            href={ROUTES.ADMIN_NEW_POST}
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition-all shadow-lg shadow-gray-200"
          >
            Write a story
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4 md:px-0">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Stories</div>
          <div className="text-3xl font-serif font-bold text-gray-900">{posts.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Drafts</div>
          <div className="text-3xl font-serif font-bold text-gray-900">{totalDrafts}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Views</div>
          <div className="text-3xl font-serif font-bold text-gray-900">
            {totalViews > 1000 ? (totalViews / 1000).toFixed(1) + "k" : totalViews}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Title</th>
                <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Author</th>
                <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Status</th>
                <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Views</th>
                <th className="text-left px-6 py-4 font-serif font-bold text-gray-900">Date</th>
                <th className="text-right px-6 py-4 font-serif font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <Link
                      href={ROUTES.blogDetail(post.slug)}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">👤</div>
                      <span className="text-sm text-gray-600">{post.author || "Admin"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {post.published ? (
                      <span className="bg-green-50 text-green-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">Published</span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-gray-500 text-sm">
                    {post.views || 0}
                  </td>
                  <td className="px-6 py-5 text-gray-500 text-sm whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short"
                    })}
                  </td>
                  <td className="px-6 py-5 text-right space-x-4 whitespace-nowrap">
                    <Link
                      href={ROUTES.adminEditPost(post._id)}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deletePost(post._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
