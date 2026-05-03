"use client";

import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl" />,
});

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  published: boolean;
}

interface PostFormProps {
  initialValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => void;
  isSubmitting?: boolean;
}

export default function PostForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostFormData>({
    defaultValues: {
      title: initialValues?.title || "",
      content: initialValues?.content || "",
      excerpt: initialValues?.excerpt || "",
      tags: initialValues?.tags || [],
      published: initialValues?.published ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
            Story Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Title"
            className="w-full text-3xl font-serif font-bold border-none focus:ring-0 placeholder:text-gray-300 px-0"
            {...register("title", { required: "Title is required" })}
          />
          <div className="h-[1px] bg-gray-100 w-full mt-2" />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Tags & Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tags" className="block text-sm font-bold text-gray-900 mb-2">
              Tags (comma separated)
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <input
                  id="tags"
                  type="text"
                  placeholder="tech, writing, lifestyle"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 transition-all outline-none"
                  value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val.split(",").map(t => t.trim()).filter(t => t !== ""));
                  }}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Publication Status
            </label>
            <div className="flex items-center gap-4 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("published")}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Publish article
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-bold text-gray-900 mb-2">
            Subtitle / Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            placeholder="Write a short summary..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 transition-all outline-none resize-none"
            {...register("excerpt")}
          />
        </div>

        {/* Content (Modern Editor) */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Story Content
          </label>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Story content is required" }}
            render={({ field }) => (
              <RichTextEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {errors.content.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all active:scale-95"
        >
          {isSubmitting ? "Saving..." : "Save Story"}
        </button>
      </div>
    </form>
  );
}
