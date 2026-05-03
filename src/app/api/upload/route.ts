import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return errorResponse("File tidak ada", 400);
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return errorResponse("Hanya file gambar yang diizinkan", 400);
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse("Ukuran file maksimal 5MB", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer);

    return successResponse({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Upload gagal", 500, message);
  }
}
