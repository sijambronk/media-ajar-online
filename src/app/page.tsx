import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  ClipboardCheck,
  BarChart3,
  Layers,
  Users,
  Sparkles,
} from "lucide-react";
import BootstrapCard from "@/components/BootstrapCard";
import { APP_CONFIG, getClassLabel, getClassDescription } from "@/lib/config";
import { prisma } from "@/lib/prisma";

// Warna per kelas (Bootstrap-palette)
const classColors: Record<number, { bg: string; badge: string }> = {
  7: { bg: "bg-primary/5", badge: "bg-primary/10 text-primary" },
  8: { bg: "bg-accent/5",  badge: "bg-accent/10 text-cyan-700" },
  9: { bg: "bg-success/5", badge: "bg-green-100 text-green-700" },
};

export default async function Home() {
  const classesFromDb = await prisma.kelas.findMany({
    select: { tingkat: true },
    distinct: ['tingkat'],
    orderBy: { tingkat: 'asc' },
  });

  const uniqueTingkat = classesFromDb.length > 0 
    ? classesFromDb.map((c) => c.tingkat)
    : APP_CONFIG.classes;

  const totalLevels = uniqueTingkat.length;
  return (
    <main className="min-h-screen bg-background">

      <section className="border-b border-border bg-card overflow-hidden relative">
        <div className="bs-container py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-6 border border-primary/20 animate-in slide-in-from-left-4 duration-500">
                <Sparkles className="h-3 w-3" />
                Kurikulum Merdeka {new Date().getFullYear()}
              </span>

              {/* Heading */}
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6 animate-in slide-in-from-left-6 duration-700">
                Platform Media Ajar Digital{" "}
                <span className="text-primary">Terintegrasi.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl animate-in slide-in-from-left-8 duration-1000">
                Kelola media ajar, asesmen interaktif, dan pantau progres siswa dalam satu platform. 
                Dirancang untuk guru {APP_CONFIG.schoolLevel} — simpel, cepat, dan efisien.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 animate-in slide-in-from-bottom-4 duration-1200">
                <Link href="/katalog" className="bs-button-primary px-8 py-3 text-base shadow-lg shadow-primary/20">
                  Lihat Katalog Materi
                  <ArrowRight className="ml-2 h-4 w-4 inline" />
                </Link>
                <Link href="/login" className="bs-button-secondary px-8 py-3 text-base">
                  Masuk sebagai Guru
                </Link>
              </div>

              {/* Trust stat */}
              <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-10 animate-in fade-in duration-1500">
                {[
                  { value: `${totalLevels} Jenjang`, label: "Tersedia" },
                  { value: "100%", label: "Kurikulum Merdeka" },
                  { value: "CP & TP", label: "Lengkap" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-foreground">{s.value}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative hidden lg:block animate-in zoom-in-95 fade-in duration-1000 delay-300">
               <div className="absolute -inset-4 bg-primary/5 rounded-full blur-3xl opacity-50" />
               <img 
                 src="/hero_illustration.png" 
                 alt="Digital Education Platform Illustration" 
                 className="relative z-10 w-full h-auto drop-shadow-2xl rounded-3xl border border-border/50"
               />
            </div>
          </div>
        </div>
      </section>

      {/* ===== KELAS SECTION ===== */}
      <section className="bs-section bg-muted/30">
        <div className="bs-container">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Pilih Jenjang Kelas
            </h2>
            <p className="text-muted-foreground text-sm">
              Modul yang disusun sesuai dengan Capaian Pembelajaran Kurikulum Merdeka untuk setiap tingkatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {uniqueTingkat.map((kelas) => {
              const colors = classColors[kelas] ?? classColors[7];
              return (
                <BootstrapCard
                  key={kelas}
                  className="group hover:-translate-y-1 transition-all duration-300"
                  header={
                    <div className={`h-56 flex items-center justify-center rounded-t-3xl bg-muted/20 relative overflow-hidden group/img`}>
                      <img 
                        src={`/image/kelas_${kelas}.png`} 
                        alt={`Ilustrasi Kelas ${kelas}`}
                        className="w-full h-full object-contain p-4 group-hover/img:scale-110 transition-transform duration-500"
                      />
                      {/* Badge Overlay */}
                      <div className="absolute top-4 left-4">
                         <div className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg">
                           <span className="text-sm font-black text-primary">{kelas}</span>
                         </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${colors.badge}`}>
                          {kelas <= 6 ? "Fase A/B/C" : (kelas >= 7 && kelas <= 9) ? "Fase D" : kelas <= 11 ? "Fase E" : "Fase F"}
                        </span>
                      </div>
                    </div>
                  }
                  footer={
                    <Link
                      href={`/katalog?kelas=${kelas}`}
                      className="bs-button-primary w-full justify-center gap-2"
                    >
                      Buka Modul <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                >
                  <div className="p-4 text-center md:text-left">
                    <h3 className="text-base font-bold text-foreground mb-1">
                      {getClassLabel(kelas)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getClassDescription(kelas)}
                    </p>
                  </div>
                </BootstrapCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FITUR SECTION ===== */}
      <section className="bs-section bg-background border-t border-border">
        <div className="bs-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Mengapa Menggunakan Platform Ini?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dirancang khusus untuk kebutuhan guru {APP_CONFIG.schoolLevel} dalam menyusun dan membagikan materi secara digital.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  {
                    icon: ClipboardCheck,
                    title: "Materi Terstruktur",
                    desc: "Setiap modul disusun dengan CP dan TP yang jelas sesuai kurikulum.",
                    color: "bg-primary/10 text-primary",
                  },
                  {
                    icon: BarChart3,
                    title: "Asesmen Interaktif",
                    desc: "Buat soal pilihan ganda, isian, dan asesmen lainnya langsung dari dashboard.",
                    color: "bg-accent/10 text-cyan-700",
                  },
                  {
                    icon: Users,
                    title: "Manajemen Siswa",
                    desc: "Kelola data kelas dan siswa, lengkap dengan import/export Excel.",
                    color: "bg-green-100 text-green-700",
                  },
                  {
                    icon: Layers,
                    title: "Multi Kategori",
                    desc: "Susun materi berdasarkan bab, topik, atau kategori yang Anda tentukan.",
                    color: "bg-orange-100 text-orange-700",
                  },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4 items-start">
                    <div className={`h-10 w-10 rounded-lg ${f.color} flex items-center justify-center flex-shrink-0`}>
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-0.5">{f.title}</h4>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Mudah Digunakan", desc: "Tidak perlu keahlian teknis", icon: CheckCircle2, color: "text-primary" },
                { label: "Akses Fleksibel", desc: "Dari perangkat apa saja", icon: GraduationCap, color: "text-cyan-600" },
                { label: "Data Aman", desc: "Tersimpan di server sekolah", icon: BookOpen, color: "text-green-600" },
                { label: "Hemat Waktu", desc: "Proses lebih cepat & efisien", icon: Sparkles, color: "text-orange-500" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bs-card p-5 flex flex-col gap-3"
                >
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="border-t border-border bg-primary">
        <div className="bs-container py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Siap Mulai Mengajar Lebih Efektif?
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-xl mx-auto">
            Bergabunglah dan mulai buat media ajar digital pertama Anda. Gratis, mudah, dan langsung pakai.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 bg-white text-primary rounded font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Masuk ke Dashboard
            </Link>
            <Link
              href="/katalog"
              className="px-6 py-2.5 border border-white/30 text-white rounded font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Lihat Katalog
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
