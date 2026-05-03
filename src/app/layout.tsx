import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: { template: "%s | MrilSeven", default: "MrilSeven" },
  description: "Blog artikel seputar teknologi dan pengembangan web",
  openGraph: { type: "website" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${lora.variable} font-sans bg-white flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
            {children}
          </main>
          <footer className="py-12 border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
              <div>© 2024 MrilSeven. All rights reserved.</div>
              <div className="flex gap-6">
                <Link href="/" className="hover:text-gray-900">Beranda</Link>
                <Link href="/admin" className="hover:text-gray-900">Admin</Link>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
