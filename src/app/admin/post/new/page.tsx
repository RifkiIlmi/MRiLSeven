"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostForm, { PostFormData } from "@/components/PostForm";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";

export default function NewPostPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await fetcher<{ url: string }>(API_ENDPOINTS.UPLOAD, {
        method: "POST",
        body: formData,
      });
      if (data?.url) {
        setThumbnail(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(data: PostFormData) {
    setLoading(true);

    try {
      await fetcher(API_ENDPOINTS.POSTS, {
        method: "POST",
        body: JSON.stringify({
          ...data,
          thumbnail,
          author: "Admin",
        }),
      });

      router.push(ROUTES.ADMIN_DASHBOARD);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        <div>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 mb-2 block transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Create New Story</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Post Form Component */}
          <PostForm onSubmit={handleSubmit} isSubmitting={loading} />
        </div>

        <div className="space-y-6">
          {/* Thumbnail Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Article Thumbnail</h3>
            <div className="relative aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden group hover:border-gray-900 transition-colors">
              {thumbnail ? (
                <>
                  <Image
                    src={thumbnail}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label htmlFor="file-upload" className="cursor-pointer text-white text-sm font-medium">
                      Change Image
                    </label>
                  </div>
                </>
              ) : (
                <label htmlFor="file-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Upload Cover"}</span>
                </label>
              )}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Pro Tip</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Use high-quality images (1200x630px) for better engagement on social media.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
