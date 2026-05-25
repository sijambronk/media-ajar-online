/**
 * Konfigurasi Aplikasi Terpusat
 * Ubah nilai di sini untuk menyesuaikan aplikasi dengan mata pelajaran & sekolah Anda.
 * Atau gunakan environment variables (.env) untuk konfigurasi dinamis.
 */

export const APP_CONFIG = {
  /** Nama aplikasi yang tampil di navbar, sidebar, dan halaman */
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Media Ajar Digital",

  /** Tagline pendek yang tampil di bawah nama app */
  appTagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "Platform Pembelajaran",

  /** Mata pelajaran utama (contoh: "IPA", "Matematika", "Bahasa Indonesia") */
  subject: process.env.NEXT_PUBLIC_SUBJECT || "Mata Pelajaran",

  /** Singkatan mapel untuk label ringkas */
  subjectShort: process.env.NEXT_PUBLIC_SUBJECT_SHORT || "Pelajaran",

  /** Jenjang sekolah (contoh: "SMP", "SMA", "SD") */
  schoolLevel: process.env.NEXT_PUBLIC_SCHOOL_LEVEL || "SMP",

  /** Kelas yang tersedia (array angka) */
  classes: [7, 8, 9] as number[],

  /** Deskripsi singkat setiap kelas — sesuaikan dengan mapel */
  classDescriptions: {
    7: process.env.NEXT_PUBLIC_DESC_KELAS7 || "Pengenalan konsep dasar dan fondasi pembelajaran.",
    8: process.env.NEXT_PUBLIC_DESC_KELAS8 || "Pengembangan konsep dan penerapan dalam kehidupan.",
    9: process.env.NEXT_PUBLIC_DESC_KELAS9 || "Pendalaman materi dan persiapan ujian akhir.",
  } as Record<number, string>,

  /** SEO — judul halaman utama */
  siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE || "Media Ajar Digital - Platform Pembelajaran Interaktif",

  /** SEO — deskripsi meta halaman utama */
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Platform pembelajaran digital dengan media ajar terintegrasi, asesmen interaktif, dan statistik progres yang akurat.",

  /** Nama sekolah default (bisa dioverride dari SchoolProfile di database) */
  schoolName: process.env.NEXT_PUBLIC_SCHOOL_NAME || "Sekolah",

  /** Daftar mata pelajaran yang tersedia */
  availableSubjects: [
    "IPA", "Matematika", "Bahasa Indonesia", "Bahasa Inggris", 
    "IPS", "PPKn", "PAI", "Seni Budaya", "PJOK", "Informatika"
  ] as string[],
} as const;

/** Helper: ambil deskripsi kelas */
export function getClassDescription(kelas: number): string {
  return (
    APP_CONFIG.classDescriptions[kelas] ??
    `Materi ${APP_CONFIG.subject} Kelas ${kelas}`
  );
}

/** Helper: label lengkap kelas */
export function getClassLabel(kelas: number): string {
  const phaseMap: Record<number, string> = {
    7: "Fase D",
    8: "Fase D",
    9: "Fase D",
    10: "Fase E",
    11: "Fase E",
    12: "Fase F",
  };
  const phase = phaseMap[kelas] ?? "Fase D";
  return `${phase} - Kelas ${toRoman(kelas)}`;
}

/** Helper: konversi angka ke Romawi (untuk label kelas) */
function toRoman(num: number): string {
  const map: Record<number, string> = {
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };
  return map[num] ?? String(num);
}
