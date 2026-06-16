const fs = require("fs");
const path = require("path");

/**
 * Cross-platform script to copy public and static assets
 * into the Next.js standalone build directory.
 */

const standalonePath = path.join(__dirname, "..", ".next", "standalone");
const publicSrc = path.join(__dirname, "..", "public");
const publicDest = path.join(standalonePath, "public");
const staticSrc = path.join(__dirname, "..", ".next", "static");
const staticDest = path.join(standalonePath, ".next", "static");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠ Source not found, skipping: ${src}`);
    return;
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("📦 Copying public assets to standalone build...");
copyDir(publicSrc, publicDest);
console.log("✅ Public assets copied.");

console.log("📦 Copying static assets to standalone build...");
copyDir(staticSrc, staticDest);
console.log("✅ Static assets copied.");

console.log("🚀 Standalone build is ready for PM2!");
