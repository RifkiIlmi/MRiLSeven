import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import slugify from "slugify";
import { successResponse, errorResponse } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

// GET: Ambil satu post berdasarkan slug atau ObjectId
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    // Deteksi apakah param adalah ObjectId (24 karakter hex) atau slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const post = isObjectId
      ? await BlogPost.findById(id).lean()
      : await BlogPost.findOneAndUpdate(
          { slug: id, published: true },
          { $inc: { views: 1 } },
          { new: true }
        ).lean();

    if (!post) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    return successResponse(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal mengambil artikel", 500, message);
  }
}

// PUT: Update artikel
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, thumbnail, published, tags } = body;

    // Auto-generate excerpt jika tidak ada atau kosong
    const finalExcerpt = excerpt || (content ? content.replace(/[#*`]/g, "").slice(0, 200) + "..." : "");

    // Hitung estimasi waktu baca
    let readingTime = 1;
    if (content) {
      const words = content.trim().split(/\s+/).length;
      readingTime = Math.ceil(words / 200);
    }

    // Re-generate slug jika judul berubah
    let updateData: Record<string, unknown> = {
      content,
      excerpt: finalExcerpt,
      thumbnail,
      published,
      tags: tags || [],
      readingTime
    };

    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      updateData = { ...updateData, title, slug };
    }

    const post = await BlogPost.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!post) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    return successResponse(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal mengupdate artikel", 500, message);
  }
}

// DELETE: Hapus artikel
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const post = await BlogPost.findByIdAndDelete(id);

    if (!post) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    return successResponse(null, { message: "Artikel berhasil dihapus" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal menghapus artikel", 500, message);
  }
}
