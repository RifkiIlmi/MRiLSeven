import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return errorResponse("Not authenticated", 401);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return errorResponse("Invalid token", 401);
  }

  return successResponse({ user: payload });
}
