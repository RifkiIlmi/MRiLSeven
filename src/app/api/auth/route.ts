import { NextRequest } from "next/server";
import { verifyAdmin, generateToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const isValid = await verifyAdmin(email, password);
    if (!isValid) {
      return errorResponse("Email atau password salah", 401);
    }

    const token = await generateToken({ email, role: "admin" });

    const response = successResponse({ 
      token, 
      user: { email, role: "admin" } 
    });
    // Simpan token di httpOnly cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return errorResponse("Login gagal", 500, message);
  }
}
