import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap, Beaker, Orbit, ArrowRight } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

export const dynamic = 'force-dynamic';

export default async function KatalogPage() {
  const allMateri = await prisma.materi.findMany({
    orderBy: [
      { kelas: 'asc' },
      { semester: 'asc' },
      { title: 'asc' }
    ],
    include: {
      category: true,
      asesmen: { select: { id: true } }
    }
  });

  const groupedByKelas = allMateri.reduce((acc: any, curr) => {
    if (!acc[curr.kelas]) acc[curr.kelas] = [];
    acc[curr.kelas].push(curr);
    return acc;
  }, {});

  const getKelasIcon = (kelas: number) => {
    switch (kelas) {
      case 7: return <BookOpen className="h-8 w-8 text-blue-400" />;
      case 8: return <Beaker className="h-8 w-8 text-purple-400" />;
      case 9: return <GraduationCap className="h-8 w-8 text-orange-400" />;
      default: return <Orbit className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="bs-container py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 py-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Katalog Materi {APP_CONFIG.subject}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Daftar lengkap modul pembelajaran {APP_CONFIG.subject} yang disusun secara sistematis untuk memandu langkah belajar Anda.
        </p>
      </div>

      <div className="space-y-20">
        {[7, 8, 9].map((kelas) => (
          <section key={kelas} className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-muted rounded-lg border border-border shadow-sm">
                {getKelasIcon(kelas)}
              </div>
              <div>
                <h2 className="text-3xl font-bold italic">Kelas {kelas}</h2>
                <div className="h-1 w-20 bg-primary/50 rounded-full mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Semester 1 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-4 border-l-2 border-primary/30">
                  Semester 1 (Ganjil)
                </h3>
                <div className="grid gap-3">
                  {groupedByKelas[kelas]?.filter((m: any) => m.semester === 1).map((m: any) => (
                    <Link 
                      key={m.id}
                      href={`/materi/${m.id}`}
                      className="bg-card p-4 rounded-lg border border-border hover:border-primary/40 group transition-all flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          {m.category.name.substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-medium text-[17px] text-foreground group-hover:text-primary transition-colors line-clamp-1">{m.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {m.asesmen.length > 0 && <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">Kuis Aktif</span>}
                            <span className="text-[10px] text-muted-foreground">{m.category.name}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Semester 2 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-4 border-l-2 border-accent/30">
                  Semester 2 (Genap)
                </h3>
                <div className="grid gap-3">
                   {groupedByKelas[kelas]?.filter((m: any) => m.semester === 2).map((m: any) => (
                    <Link 
                      key={m.id}
                      href={`/materi/${m.id}`}
                      className="bg-card p-4 rounded-lg border border-border hover:border-accent/40 group transition-all flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-accent/10 text-accent font-bold text-xs">
                          {m.category.name.substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-medium text-[17px] group-hover:text-accent transition-colors line-clamp-1">{m.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                             {m.asesmen.length > 0 && <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20">Kuis Aktif</span>}
                            <span className="text-[10px] text-muted-foreground">{m.category.name}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-20 bg-primary/5 p-8 rounded-xl border border-primary/20 text-center">
        <h3 className="text-2xl font-bold mb-4">Mulai Belajar Sekarang</h3>
        <p className="text-muted-foreground mb-8">Pilih salah satu modul di atas untuk memulai perjalanan sains Anda hari ini.</p>
        <Link href="/" className="bs-button-primary shadow-indigo-200/50">
           Kembali ke Dashboard <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}
