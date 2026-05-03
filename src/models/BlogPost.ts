import mongoose, { Document, Schema, Model } from "mongoose";

// TypeScript interface untuk type safety
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  author: string;
  author_id: string;
  published: boolean;
  tags: string[];
  views: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema Mongoose
const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: {
      type: String,
      required: [true, "Judul artikel harus diisi"],
      trim: true,
      maxlength: [200, "Judul maksimal 200 karakter"],
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Pastikan slug unik untuk SEO
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Konten artikel harus diisi"],
    },
    excerpt: {
      type: String,
      maxlength: [500, "Excerpt maksimal 500 karakter"],
      default: "",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: "Admin",
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    published: {
      type: Boolean,
      default: false, // Default ke draft
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    readingTime: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Index untuk performa query
BlogPostSchema.index({ createdAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ title: "text", content: "text" }); // Untuk full-text search

// Gunakan model yang sudah ada atau buat baru
// (penting untuk Next.js agar tidak error "Cannot overwrite model")
const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
