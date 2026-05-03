# MrilSeven — Modern Editorial Platform `v0.1.0`

**MrilSeven** adalah platform blog modern dengan estetika premium yang terinspirasi oleh Medium. Dibangun menggunakan teknologi terbaru untuk memberikan pengalaman menulis dan membaca yang mulus, cepat, dan elegan.

![Aesthetic Banner](public/banner-mrilseven.png)

## ✨ Fitur Utama

- **Premium Writing Experience**: Rich Text Editor (Tiptap) yang mendukung Markdown, highlight kode, task lists, dan image upload terintegrasi.
- **Smart Analytics**: 
  - **Reading Time**: Estimasi waktu baca otomatis berdasarkan panjang konten.
  - **Real-time Views**: Penghitung jumlah pembaca yang akurat di setiap artikel.
- **Content Management System (CMS)**:
  - **Drafting System**: Simpan tulisan sebagai draft atau publikasikan secara instan.
  - **Topic Tagging**: Kategorikan cerita Anda dengan sistem tagging yang dinamis.
- **Admin Dashboard**: Dashboard eksklusif dengan visualisasi data (Recharts) untuk memonitor performa (Total Views, Drafts, dan Stories).
- **High Performance**:
  - **Server-Side Rendering (SSR)** untuk SEO maksimal dan loading awal yang instan.
  - **Lazy Loading** untuk editor berat guna mengoptimalkan ukuran bundle JavaScript.
  - **Image Optimization** menggunakan Next.js Image untuk pengiriman gambar yang efisien.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com) (Engine v4)
- **Database**: [MongoDB](https://www.mongodb.com) dengan [Mongoose](https://mongoosejs.com)
- **State Management**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Editor**: [Tiptap](https://tiptap.dev) (WYSIWYG Markdown-ready) & [React Markdown](https://github.com/remarkjs/react-markdown)
- **Icons**: [Lucide React](https://lucide.dev)
- **Visuals**: [Recharts](https://recharts.org) (Dashboard Analytics)
- **Typography**: [Lora](https://fonts.google.com/specimen/Lora) (Serif) & [Inter](https://fonts.google.com/specimen/Inter) (Sans)

## 🛠️ Instalasi & Konfigurasi

1. **Clone repository**:
   ```bash
   git clone https://github.com/RifkiIlmi/MRiLSeven.git
   cd mrilseven
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable**:
   Buat file `.env.local` di root direktori dan isi dengan:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   
   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD_HASH_B64=your_base64_encoded_password
   
   # Cloudinary (Untuk Upload Gambar)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

4. **Jalankan aplikasi**:
   ```bash
   npm run dev
   ```

## 📸 Preview
- **Beranda**: Menampilkan kartu artikel yang elegan dengan font Serif yang cantik.
- **Admin**: Dashboard profesional dengan statistik performa real-time.
- **Editor**: Antarmuka bersih yang fokus pada konten tanpa gangguan.

---

Didesain dengan ❤️ oleh **Rifki Ilmi**
