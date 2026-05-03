import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import slugify from "slugify";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET: Ambil semua post dengan pagination & search
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Query filter
    const all = searchParams.get("all") === "true";
    let filter: any = { published: true };
    
    if (all) {
      filter = {};
    }

    if (search) {
      filter = { ...filter, $text: { $search: search } };
    }

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .select("-content") // Jangan kirim konten penuh untuk performa
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    return successResponse(posts, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("GET /api/posts error:", message);
    return errorResponse("Gagal mengambil data artikel", 500, message);
  }
}

// POST: Buat artikel baru
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, content, excerpt, thumbnail, author, tags, published } = body;

    if (!title || !content) {
      return errorResponse("Judul dan konten wajib diisi", 400);
    }

    // Generate slug dari judul
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: "id",
    });

    // Pastikan slug unik
    let slug = baseSlug;
    let count = 0;
    while (await BlogPost.exists({ slug })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    // Auto-generate excerpt jika tidak ada
    const autoExcerpt =
      excerpt || content.replace(/[#*`]/g, "").slice(0, 200) + "...";

    // Hitung estimasi waktu baca (rata-rata 200 kata/menit)
    const words = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt: autoExcerpt,
      thumbnail: thumbnail || null,
      author: author || "Admin",
      tags: tags || [],
      published: published ?? false,
      readingTime,
      views: 0
    });

    return successResponse(post, undefined, 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return errorResponse("Slug sudah digunakan", 409);
    }
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal membuat artikel", 500, message);
  }
}
