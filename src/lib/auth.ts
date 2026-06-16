import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "./mongodb";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function generateToken(
  payload: Record<string, unknown>,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string,
): Promise<Record<string, any> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Record<string, any>;
  } catch {
    return null;
  }
}

/**
 * Otentikasi user dari database
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<{ id: string; email: string; name: string; role: string } | null> {
  await connectDB();

  // 1. Cek User di Database
  const user = await User.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }
  }

  // 2. Fallback ke Super Admin dari .env (untuk setup awal)
  const adminEmail = process.env.ADMIN_EMAIL || "admin@blog.com";
  const b64Hash = process.env.ADMIN_PASSWORD_HASH_B64 || "admin123";

  if (email === adminEmail && b64Hash) {
    const adminPasswordHash = Buffer.from(b64Hash, 'base64').toString();
    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (isMatch) {
      return {
        id: "super-admin",
        email: adminEmail,
        name: "Super Admin",
        role: "admin",
      };
    }
  }

  return null;
}
