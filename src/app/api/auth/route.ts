import { NextRequest } from "next/server";
import { authenticateUser, generateToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await authenticateUser(email, password);
    if (!user) {
      return errorResponse("Email atau password salah", 401);
    }

    const token = await generateToken({ 
      id: user.id,
      email: user.email, 
      name: user.name,
      role: user.role 
    });

    const response = successResponse({ 
      user: { 
        email: user.email, 
        name: user.name,
        role: user.role 
      } 
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
