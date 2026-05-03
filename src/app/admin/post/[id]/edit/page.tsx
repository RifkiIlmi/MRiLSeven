"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import PostForm, { PostFormData } from "@/components/PostForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetcher } from "@/lib/fetcher";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";
import { PostData } from "@/types";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [initialValues, setInitialValues] = useState<PostFormData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data: post } = await fetcher<PostData>(`${API_ENDPOINTS.POSTS}/${id}`);
        if (!post) throw new Error("Not found");
        setInitialValues({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          tags: post.tags || [],
          published: post.published ?? false,
        });
        setThumbnail(post.thumbnail || "");
      } catch {
        setError("Gagal memuat artikel");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

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
    } catch {
      alert("Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(data: PostFormData) {
    setSubmitting(true);

    try {
      await fetcher(`${API_ENDPOINTS.POSTS}/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...data,
          thumbnail,
        }),
      });

      router.push(ROUTES.ADMIN_DASHBOARD);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin" className="text-blue-600 hover:underline">
          ← Kembali ke Dashboard
        </Link>
      </div>
    );
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
          <h1 className="text-4xl font-serif font-bold text-gray-900">Edit Story</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Post Form Component */}
          {initialValues && (
            <PostForm
              initialValues={initialValues}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          )}
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
                    <label htmlFor="file-upload-edit" className="cursor-pointer text-white text-sm font-medium">
                      Change Image
                    </label>
                  </div>
                </>
              ) : (
                <label htmlFor="file-upload-edit" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Upload Cover"}</span>
                </label>
              )}
              <input
                id="file-upload-edit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Edit Mode</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Updating your thumbnail or content will reflect immediately on the live site after you save.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
