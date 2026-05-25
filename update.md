# Catatan Pembaruan (Update Log) - 25 Mei 2026

Dokumen ini berisi catatan perubahan untuk mendukung migrasi deployment online aplikasi **Media Ajar Digital** ke platform **Vercel** dan database **Supabase**.

---

## Ringkasan Pembaruan (Versi Cloud/Online)

### 1. 📂 Pemisahan Folder Khusus Vercel (`mediaajar_vercel`)
*   **Tujuan**: Menghindari kerusakan atau perubahan pada versi offline/portabel lokal (`dev.db`).
*   **Detail**: Membuat salinan proyek baru yang bersih dari *cache* lokal, folder `.next`, dan *database* SQLite lokal lama.

### 2. 🗄️ Migrasi Database dari SQLite ke PostgreSQL (Supabase)
*   **Berkas yang Diubah**: `prisma/schema.prisma` dan `.env`
*   **Detail Perubahan**:
    *   Mengubah *database provider* di Prisma dari `sqlite` ke `postgresql`.
    *   Menambahkan dukungan `directUrl` di `schema.prisma` untuk mendukung migrasi database yang aman pada model *connection pooling* Supabase.
    *   Mengamankan file `.env` yang berisikan kredensial database sensitif agar tidak terunggah ke repositori publik GitHub menggunakan `.gitignore`.

### 3. 🔑 Penyesuaian Karakter Khusus pada Database URL (URL Encoding)
*   **Berkas yang Diubah**: `.env`
*   **Detail Perubahan**: Mengubah karakter khusus seperti `!` dan `#` pada password database menjadi format URL-encoded (`%21` dan `%23`) untuk mencegah kegagalan *parsing* port pada saat koneksi Prisma dijalankan.

### 4. 🌱 Sinkronisasi & Pengisian Data Awal (Seed Data)
*   **Perintah yang Dijalankan**: `npx prisma db push` dan `npx prisma db seed`
*   **Detail**: Menginisialisasi tabel-tabel database di Supabase dan memasukkan akun admin default (`admin@science.id`) beserta kategori serta contoh materi ajar awal.

### 5. 🚀 Deployment Terintegrasi di Vercel
*   **Konfigurasi**: Menghubungkan Git ke repository GitHub `sijambronk/media-ajar-online` dan melakukan build di Vercel menggunakan *custom build command* (`npx prisma db push && npm run build`) agar database selalu sync di sisi serverless.

---

# Catatan Pembaruan (Update Log) - 19 Mei 2026

Dokumen ini berisi catatan perubahan, perbaikan bug, dan peningkatan fitur yang telah diimplementasikan hari ini pada aplikasi **Media Ajar Digital**.

---

## Ringkasan Pembaruan

### 1. 🛠️ Perbaikan Hamburger Sidebar (Desktop & Mobile)
* **Berkas yang Diubah**: `src/components/AdminSidebar.tsx` dan `src/components/AdminLayoutClient.tsx`
* **Detail Perubahan**:
  * Menghapus class statis `lg:translate-x-0` pada kontainer `<aside>`.
  * Status transisi buka-tutup sidebar sekarang dikendalikan penuh secara dinamis oleh React state `isOpen` pada desktop maupun mobile.
  * Ketika hamburger diklik pada desktop, sidebar akan menyusut dengan transisi slide-out yang mulus, dan lebar area konten utama akan meluas otomatis (`lg:ml-0`).

### 2. 🧹 Pembersihan Tampilan Bawah Sidebar
* **Berkas yang Diubah**: `src/components/AdminSidebar.tsx`
* **Detail Perubahan**:
  * Menghapus bagian **User Section** di bagian bawah sidebar (kartu akun "Admin IPA / Super Admin" dan tombol logout bawaan) agar tampilan navigasi sidebar lebih bersih, lega, dan modern.

### 3. 👤 Pemindahan Menu Logout ke Header Kanan Atas (Dropdown Premium)
* **Berkas yang Diubah**: `src/components/AdminLayoutClient.tsx`
* **Detail Perubahan**:
  * Mengubah informasi akun admin di pojok kanan atas header menjadi tombol menu profil yang interaktif.
  * Mengintegrasikan state dropdown `isProfileDropdownOpen` dengan animasi kemunculan panel menu dropdown yang elegan.
  * Dropdown ini mencantumkan informasi detail akun admin ("Administrator" & "Super Admin") dan tombol **Log Out** aktif terintegrasi dengan NextAuth `signOut()`.
  * Dilengkapi dengan detektor *outside click backdrop* transparan yang otomatis menutup menu dropdown ketika pengguna mengklik di luar area menu.

### 4. 📌 Navigasi Menu Sidebar Tetap Terbuka di Desktop
* **Berkas yang Diubah**: `src/components/AdminSidebar.tsx`
* **Detail Perubahan**:
  * Menyesuaikan fungsi `handleClick` pada tautan navigasi sidebar.
  * Panggilan `onClose()` (yang menutup laci sidebar) sekarang dibatasi hanya aktif pada lebar layar kurang dari 1024px (`window.innerWidth < 1024` - mobile/tablet).
  * Pada desktop, menjelajahi dan mengklik sub-menu navigasi **tidak akan menutup sidebar**, sehingga navigasi menjadi jauh lebih praktis.

### 5. 📞 Pembaruan Sosial Media di Footer ("Lainnya" ➔ "Hubungi:")
* **Berkas yang Diubah**: `src/components/ConditionalLayout.tsx`
* **Detail Perubahan**:
  * Mengubah kolom footer "**Lainnya**" menjadi "**Hubungi:**".
  * Menambahkan tautan sosial media interaktif lengkap dengan ikon grafis SVG asli buatan sendiri:
    * **WhatsApp**: Menuju otomatis ke `https://wa.me/6285777191967`.
    * **Instagram**: Menuju ke `https://instagram.com/kios.media.digital`.
    * **YouTube**: Menuju ke `https://www.youtube.com/@kiosmediadigital`.
  * **Efek Hover**: Mengimplementasikan micro-animation interaktif kelas premium. Tombol medsos akan membesar (`scale-110`), memberikan efek bayangan lembut, dan memudar anggun ke warna representatif merek masing-masing (WhatsApp hijau, Instagram gradasi oranye-pink-ungu, YouTube merah) ketika kursor diarahkan.

### 6. 🔒 Otomatis Logout Saat Aplikasi & Terminal Ditutup (Keamanan Sesi)
* **Berkas yang Diubah**: `src/lib/auth.ts`
* **Detail Perubahan**:
  * Memanfaatkan modul `crypto` bawaan Node.js untuk membangkitkan token enkripsi NextAuth yang acak (`dynamicSecret`) secara dinamis setiap kali server dijalankan ulang (boot) khusus di lingkungan produksi/portable.
  * Jika terminal ditutup dan skrip batch `start_lms.bat` dijalankan kembali di masa mendatang, kunci enkripsi lama kedaluwarsa sehingga browser otomatis ter-logout dengan aman dan langsung diarahkan kembali ke halaman login.
  * Di lingkungan pengembangan (dev mode), aplikasi tetap menggunakan secret statis agar developer tidak ter-logout berulang kali karena fast-refresh.

### 7. 🚀 Skrip Pemaket Ramping yang Lebih Robust (Anti-Crash EPERM)
* **Berkas yang Diubah**: `scripts/build-lite.js`
* **Detail Perubahan**:
  * Mengubah logika pembersihan folder dist-lite lama (`modulajarportabel`).
  * Alih-alih menghapus folder induk secara total (yang sering kali memicu error crash `EPERM` di Windows jika folder tersebut sedang dibuka di CMD/Explorer), skrip kini hanya membersihkan isi (file/sub-folder) di dalamnya satu per satu dengan penanganan `try-catch` yang kokoh.
  * Proses build portable (`npm run build-lite`) kini 100% aman dan antiputus di tengah jalan.
