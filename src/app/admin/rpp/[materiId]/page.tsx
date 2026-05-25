import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronLeft, Save, FileText, ScrollText, BookOpen, Target, Layout, Lightbulb, PenTool } from "lucide-react";
import Link from "next/link";
import RPPEditor from "../../../../components/RPPEditor";

export const dynamic = 'force-dynamic';

export default async function DetailRPPPage({ params }: { params: Promise<{ materiId: string }> }) {
  const { materiId } = await params;

  const materi = await prisma.materi.findUnique({
    where: { id: materiId },
    include: {
      category: true,
      cpRelation: true,
      tpRelations: true,
    }
  });

  if (!materi) return notFound();

  const rpp = (prisma as any).rpp ? await (prisma as any).rpp.findUnique({
    where: { materiId }
  }) : null;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/admin/rpp" className="flex items-center text-xs font-bold text-primary uppercase tracking-widest mb-2 hover:gap-2 transition-all">
            <ChevronLeft className="h-3 w-3" /> Kembali ke Daftar
          </Link>
          <h1 className="text-3xl font-bold">Media Ajar / RPP Digital</h1>
          <p className="text-muted-foreground text-sm">Penyusunan rencana pembelajaran untuk topik: <span className="text-foreground font-bold">{materi.title}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Info Materi */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-6 rounded-[2rem] border border-border/50 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                 </div>
                 <h2 className="font-bold">Info Materi</h2>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-secondary/30 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mata Pelajaran</div>
                    <div className="text-sm font-bold">{materi.category.name}</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-secondary/30 space-y-1">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Kelas / Semester</div>
                    <div className="text-sm font-bold">Kelas {materi.kelas} - Semester {materi.semester}</div>
                 </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                    <Target className="h-4 w-4" /> Capaian Pembelajaran
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed italic">
                   "{materi.cpRelation?.deskripsi || "Belum ditentukan"}"
                 </p>
              </div>
           </div>

           <div className="glass p-6 rounded-[2rem] border border-border/50 space-y-4 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 text-primary">
                 <Lightbulb className="h-5 w-5" />
                 <h2 className="font-bold">Tips Penyusunan</h2>
              </div>
              <p className="text-xs text-primary/70 leading-relaxed">
                Pastikan RPP mencakup identitas modul, langkah-langkah pembelajaran yang aktif, dan instrumen penilaian yang sesuai dengan tujuan pembelajaran (TP).
              </p>
           </div>
        </div>

        {/* Right - Editor Container */}
        <div className="lg:col-span-8">
           <RPPEditor materi={materi} initialRPP={rpp} />
        </div>
      </div>
    </div>
  );
}
