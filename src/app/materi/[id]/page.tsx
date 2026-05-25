import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Beaker, BookOpen, ChevronLeft, Lightbulb, GraduationCap, ArrowRight } from "lucide-react";

export default async function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const materi = await prisma.materi.findUnique({
    where: { id: id },
    include: { 
      category: true,
      asesmen: {
        select: { id: true }
      }
    }
  });

  if (!materi) {
    notFound();
  }

  const hasAsesmen = materi.asesmen.length > 0;
  const asesmenId = hasAsesmen ? materi.asesmen[0].id : null;

  return (
    <div className="bs-container py-12">
      {/* Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
        <span>/</span>
        <Link href={`/kelas/${materi.kelas}`} className="hover:text-primary transition-colors">Kelas {materi.kelas}</Link>
        <span>/</span>
        <span className="text-foreground truncate">{materi.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Beaker className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-primary">
            {materi.category.name} • Semester {materi.semester}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 py-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-950 to-blue-800 dark:from-white dark:to-gray-400">
          {materi.title}
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Horizontal Navigation & Info Bar */}
      <div className="grid grid-cols-1 gap-6 mb-12">
        <div className="glass p-6 rounded-3xl border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {hasAsesmen ? (
              <Link 
                href={`/asesmen/${asesmenId}`}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 group"
              >
                <span>Mulai Uji Pemahaman</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="bg-secondary/50 text-muted-foreground px-6 py-3 rounded-2xl text-sm font-medium opacity-50 border border-border/50">
                Asesmen Belum Tersedia
              </div>
            )}
            <button className="glass px-6 py-3 rounded-2xl text-sm font-medium hover:bg-secondary transition-all flex items-center gap-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Unduh Modul PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-8 border-l border-border pl-8 h-12 hidden md:flex">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Kelas</span>
              <span className="font-bold">{materi.kelas}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Semester</span>
              <span className="font-bold">{materi.semester}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Kategori</span>
              <span className="text-primary font-bold">{materi.category.name}</span>
            </div>
          </div>
        </div>

        {(materi.cp || materi.tp) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {materi.cp && (
              <div className="glass p-6 rounded-2xl border border-primary/20 bg-primary/5">
                <h3 className="text-xs font-bold text-primary uppercase mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> Capaian Pembelajaran
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{materi.cp}"
                </p>
              </div>
            )}
            {materi.tp && (
              <div className="glass p-6 rounded-2xl border border-border">
                <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Tujuan Pembelajaran
                </h3>
                <ul className="space-y-2">
                  {JSON.parse(materi.tp).map((point: string, i: number) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-3">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full Width Content Area */}
      <div className="space-y-12">
        {(() => {
          try {
            const blocks = JSON.parse(materi.content);
            if (Array.isArray(blocks)) {
              return blocks.map((block: any, index: number) => (
                <article key={index} className="glass py-7 px-6 md:px-16 rounded-[40px] border border-border/50 overflow-hidden group hover:border-border transition-all shadow-xl">
                  {block.title && (
                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border/50">
                       <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                         {index + 1}
                       </div>
                       <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                         {block.title}
                       </h2>
                    </div>
                  )}
                  <div 
                    className="prose prose-invert max-w-none prose-headings:text-primary prose-strong:text-foreground prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-li:text-muted-foreground/80 text-lg space-y-5"
                    dangerouslySetInnerHTML={{ __html: block.content }} 
                  />
                </article>
              ));
            }
          } catch (e) {
            return (
              <article className="glass p-8 md:p-16 rounded-[40px] border border-border/50 prose prose-invert max-w-none prose-headings:text-primary prose-strong:text-foreground prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-li:text-muted-foreground/80">
                <div 
                   className="text-lg space-y-8"
                   dangerouslySetInnerHTML={{ __html: materi.content }} 
                />
              </article>
            );
          }
          return null;
        })()}
      </div>

      {/* Footer Nav */}
      <div className="mt-12 flex justify-between items-center border-t border-border/50 pt-8">
        <Link 
          href={`/kelas/${materi.kelas}`}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Materi
        </Link>
        
        <div className="flex space-x-4">
            <button className="glass px-4 py-2 rounded-lg text-sm hover:border-primary/50 transition-all">
                Cetak Materi
            </button>
        </div>
      </div>
    </div>
  );
}
