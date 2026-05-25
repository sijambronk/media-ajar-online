# Referensi Teknis Aplikasi Media Ajar IPA SMP

Dokumen ini berisi rangkuman arsitektur, teknologi, dan panduan desain untuk pemeliharaan dan pembuatan konten di masa mendatang.

---

## 1. Arsitektur & Struktur Aplikasi
Aplikasi dibangun menggunakan **Next.js 16 (React 19)** dengan **App Router** untuk performa optimal dan SEO tingkat lanjut.

- **Frontend**: Menggunakan Server Components untuk pemuatan data (RSC) dan Client Components untuk interaktivitas (Kuis, Editor).
- **Backend**: API Routes terintegrasi di dalam Next.js (`src/app/api`).
- **Database**: **SQLite** dengan **Prisma ORM** untuk manajemen data yang cepat (Materi, Kategori, Asesmen, Pertanyaan, Jawaban).
- **Autentikasi**: **NextAuth.js** untuk manajemen akun Guru, Siswa, dan Admin.

---

## 2. Bahasa Kode & Basis Teknologi
- **Bahasa Utama**: **TypeScript** (menjamin keamanan kode dan autocompletion yang cerdas).
- **Framework UI**: **Next.js 16.2.1** dengan dukungan **React 19**.
- **Styling**: **Tailwind CSS v4** (menggunakan `@theme` atomik untuk fleksibilitas tinggi).
- **Icons**: **Lucide React** (set ikon yang modern dan ringan).
- **Math Rendering**: **KaTeX** (`react-katex`) untuk penulisan rumus matematika dan kimia yang presisi.

---

## 3. Tema & Estetika Visual (UI/UX)
Sistem desain menggunakan pendekatan **Premium Glassmorphism & Science-Inspired Aesthetics**.

- **Warna Utama (Brand)**: **Vibrant Indigo-Blue (#4355f3)**.
- **Tipografi**: **Geist Sans/Mono** (modern, bersih, dan sangat terbaca).
- **Efek Visual**: 
    - *Glass Cards*: Lapisan semi-transparan dengan *blur* latar belakang (`backdrop-filter`).
    - *Sci-Fi Borders*: Garis bawah gradasi pada judul yang bertema sains.
    - *Dark Mode Support*: Mendukung penuh tema gelap secara otomatis.

---

## 4. Sistem Editor Konten (Tiptap Plugin)
Aplikasi ini memiliki sistem editor khusus yang telah dikustomisasi untuk kebutuhan sains:

### Plugin Kustom Utama:
- **Resizable Image**: Gambar yang dapat ditarik (*resize*) manual di 4 sudut dan memiliki toolbar perataan (*alignment*).
- **Formula Integrator**: Mendukung **Subscript (H₂O)** dan **Superscript (x²)** secara native.
- **Science Theme Colors**: Palette warna khusus (Blue, Green, Yellow, Red, Purple) untuk menyoroti istilah penting.
- **Indentation (Tabulasi)**: Mendukung spasi dan tabulasi untuk struktur teks yang rapi.
- **Science Cards (Code Block)**: Transformasi blok kode menjadi kartu informasi premium dengan ikon sains (*Sparkles*).

---

## 5. Alur Data (Architecture Flow)
1. **Materi**: Materi disusun dalam blok-blok modular (`MateriBlock`).
2. **Kategori**: Materi dikelompokkan berdasarkan materi pelajaran (Biologi, Fisika, Kimia, Bumi & Antariksa).
3. **Asesmen**: Terhubung langsung ke Materi terkait, mendukung tipe soal **Pilihan Ganda** dan **Esai**.
4. **Rendering**: Komponen `ScienceText` di sisi student secara cerdas mendeteksi HTML kaya (*rich-text*) dari editor dan simbol KaTeX (`$...$`) secara bersamaan.

---

## 6. Referensi Konten (Format Narasi)
Untuk pembuatan materi di masa mendatang, cukup gunakan standar ini:
- **Judul**: Gunakan `H1` atau `H2` dengan gradasi warna primer.
- **Gambar**: Pastikan memiliki properti alignment (Default: Center).
- **Rumus**: Gunakan tombol Sub/Sup untuk rumus sederhana, atau anotasi `$...$` untuk rumus kompleks.
- **Penekanan**: Gunakan warna tema sains untuk kata kunci penting.

---

*Dokumen ini dibuat pada: 24 Maret 2026 sebagai panduan blueprint aplikasi.*
