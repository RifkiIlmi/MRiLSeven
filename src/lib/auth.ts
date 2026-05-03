import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

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
): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function verifyAdmin(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@blog.com";
  const b64Hash = process.env.ADMIN_PASSWORD_HASH_B64 || "";
  
  if (email !== adminEmail) return false;
  if (!b64Hash) return false;

  try {
    // Decode hash dari Base64 untuk menghindari masalah simbol "$" di .env
    const adminPasswordHash = Buffer.from(b64Hash, 'base64').toString();
    return bcrypt.compare(password, adminPasswordHash);
  } catch (error) {
    console.error("Auth Error:", error);
    return false;
  }
}

// Jalankan ini sekali untuk hash password admin:
// bcrypt.hash('passwordkamu', 12).then(console.log)
