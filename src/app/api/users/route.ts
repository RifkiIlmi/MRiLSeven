import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import bcrypt from "bcryptjs";

// GET: List all users (Admin only)
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    // Auth Check
    const token = req.cookies.get("auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    
    if (!payload || payload.role !== "admin") {
      return errorResponse("Akses ditolak. Khusus Admin.", 403);
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return successResponse(users);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal mengambil data user", 500, message);
  }
}

// POST: Create new user (Admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Auth Check
    const token = req.cookies.get("auth_token")?.value;
    const payload = token ? await verifyToken(token) : null;
    
    if (!payload || payload.role !== "admin") {
      return errorResponse("Akses ditolak. Khusus Admin.", 403);
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return errorResponse("Nama, email, dan password wajib diisi", 400);
    }

    // Cek email duplikat
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse("Email sudah digunakan", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "author",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return successResponse(userResponse, undefined, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Gagal membuat user", 500, message);
  }
}
