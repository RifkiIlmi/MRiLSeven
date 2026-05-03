import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import slugify from "slugify";
import { successResponse, errorResponse } from "@/lib/api-response";
import { verifyToken } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// GET: Ambil satu post berdasarkan slug atau ObjectId
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    // Deteksi apakah param adalah ObjectId (24 karakter hex) atau slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    // View Guard: Cek cookie untuk mencegah spam view
    const viewCookieName = `viewed_${id}`;
    const hasViewed = req.cookies.has(viewCookieName);
    const shouldIncrement = !isObjectId && !hasViewed;

    const post = isObjectId
      ? await BlogPost.findById(id).lean()
      : await BlogPost.findOneAndUpdate(
          { slug: id, published: true },
          shouldIncrement ? { $inc: { views: 1 } } : {},
          { new: true },
        ).lean();

    if (!post) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    const response = successResponse(post);

    // Set cookie jika view bertambah (berlaku 24 jam)
    if (shouldIncrement) {
      response.cookies.set(viewCookieName, "true", {
        maxAge: 60 * 60 * 24, // 24 jam
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal mengambil artikel", 500, message);
  }
}

// PUT: Update artikel
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    // Keamanan: Verifikasi Token Admin/Author
    const token = req.cookies.get("auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return errorResponse("Tidak diizinkan. Silakan login.", 401);
    }

    const { id } = await params;

    // Cek kepemilikan artikel
    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    if (payload.role !== "admin" && existingPost.author_id !== payload.id) {
      return errorResponse(
        "Akses ditolak. Anda hanya bisa mengubah artikel milik sendiri.",
        403,
      );
    }

    const body = await req.json();
    const { title, content, excerpt, thumbnail, published, tags } = body;

    // ... sisa logika update ...
    const finalExcerpt =
      excerpt ||
      (content ? content.replace(/[#*`]/g, "").slice(0, 200) + "..." : "");

    let readingTime = existingPost.readingTime;
    if (content) {
      const words = content.trim().split(/\s+/).length;
      readingTime = Math.ceil(words / 200);
    }

    let updateData: Record<string, unknown> = {
      content,
      excerpt: finalExcerpt,
      thumbnail,
      published,
      tags: tags || [],
      readingTime,
    };

    // Jika artikel lama belum punya author_id, masukkan ID pengubah sekarang
    if (!existingPost.author_id) {
      updateData.author_id = payload.id;
      // Opsional: Update nama author juga jika kosong
      if (!existingPost.author) {
        updateData.author = payload.name || "Admin";
      }
    }

    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      updateData = { ...updateData, title, slug };
    }

    const post = await BlogPost.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });

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

    // Keamanan: Verifikasi Token Admin/Author
    const token = req.cookies.get("auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload) {
      return errorResponse("Tidak diizinkan. Silakan login.", 401);
    }

    const { id } = await params;

    // Cek kepemilikan artikel
    const existingPost = await BlogPost.findById(id);
    if (!existingPost) {
      return errorResponse("Artikel tidak ditemukan", 404);
    }

    if (payload.role !== "admin" && existingPost.author_id !== payload.id) {
      return errorResponse(
        "Akses ditolak. Anda hanya bisa menghapus artikel milik sendiri.",
        403,
      );
    }

    await BlogPost.findByIdAndDelete(id);
    return successResponse(null, undefined, 200, "Artikel berhasil dihapus");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal menghapus artikel", 500, message);
  }
}
