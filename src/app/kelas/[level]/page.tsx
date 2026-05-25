import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Beaker, Book, ChevronRight, Leaf, Zap, FlaskConical, Globe, Orbit, CheckCircle2, ClipboardCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/config";

import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function KelasPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ level: string }>,
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { level: levelStr } = await params;
  const { view } = await searchParams;
  const level = parseInt(levelStr);
  const isAsesmenView = view === 'asesmen';
  
  const categories = await prisma.category.findMany({
    where: {
      materi: {
        some: { kelas: level }
      }
    },
    include: {
      materi: {
        where: { kelas: level },
        include: { asesmen: { select: { id: true } } }
      }
    }
  });

  // Filter materi if in assessment view
  if (isAsesmenView) {
    categories.forEach(cat => {
      cat.materi = cat.materi.filter(m => m.asesmen.length > 0);
    });
  }

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Biologi': return <Leaf className="h-6 w-6 text-green-400" />;
      case 'Fisika': return <Zap className="h-6 w-6 text-blue-400" />;
      case 'Kimia': return <FlaskConical className="h-6 w-6 text-purple-400" />;
      case 'Bumi & Antariksa': return <Orbit className="h-6 w-6 text-orange-400" />;
      default: return <Beaker className="h-6 w-6 text-primary" />;
    }
  };

  const getCategoryColor = (name: string) => {
    switch (name) {
      case 'Biologi': return 'bg-green-500/20';
      case 'Fisika': return 'bg-blue-500/20';
      case 'Kimia': return 'bg-purple-500/20';
      case 'Bumi & Antariksa': return 'bg-orange-500/20';
      default: return 'bg-primary/20';
    }
  };

  return (
    <div className="bs-container py-12">
      <div className="mb-10">
        <nav className="flex space-x-2 text-sm text-muted-foreground mb-4">
           <Link href="/" className="hover:text-primary">Beranda</Link>
           <span>/</span>
           <span className="text-foreground">Kelas {level}</span>
           {isAsesmenView && (
             <>
               <span>/</span>
               <span className="text-primary font-medium">Asesmen</span>
             </>
           )}
        </nav>
        <div className="flex items-center gap-4 mb-2">
          {isAsesmenView && (
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ClipboardCheck className="h-8 w-8" />
            </div>
          )}
          <h1 className="text-4xl font-bold py-1 leading-tight">
            {isAsesmenView ? `Latihan & Asesmen Kelas ${level}` : `Kurikulum ${APP_CONFIG.subject} Kelas ${level}`}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isAsesmenView 
            ? `Daftar kuis dan uji pemahaman untuk materi ${APP_CONFIG.subject} tingkat Kelas ${level}.`
            : `Pilih subyek untuk mulai mempelajari materi ${APP_CONFIG.subject} secara mendalam.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-card p-6 rounded-lg border border-border hover:border-primary/30 transition-all flex flex-col h-full group/card shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`${getCategoryColor(category.name)} p-2 rounded-lg group-hover/card:scale-110 transition-transform`}>
                {getCategoryIcon(category.name)}
              </div>
              <h2 className="text-2xl font-bold">{category.name}</h2>
            </div>
            
            <div className="space-y-3 flex-grow">
              {category.materi.length > 0 ? (
                category.materi.map((m) => (
                  <Link
                    key={m.id}
                    href={isAsesmenView && m.asesmen.length > 0 ? `/asesmen/${m.asesmen[0].id}` : `/materi/${m.id}`}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg group transition-all border",
                      isAsesmenView 
                        ? "bg-primary/5 hover:bg-primary border-primary/20 hover:border-primary text-foreground hover:text-white"
                        : "bg-muted/50 hover:bg-primary/10 border-transparent hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {isAsesmenView ? (
                        <CheckCircle2 className={cn("h-5 w-5", isAsesmenView ? "group-hover:text-white" : "text-primary")} />
                      ) : (
                        <Book className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-[17px]">{m.title}</span>
                        {!isAsesmenView && m.asesmen.length > 0 && (
                          <span className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Kuis Tersedia
                          </span>
                        )}
                        {isAsesmenView && (
                          <span className="text-[10px] opacity-70">Uji Pemahaman Sekarang</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <span className={cn(
                         "text-[10px] uppercase font-bold border px-1.5 py-0.5 rounded-md",
                         isAsesmenView ? "border-white/20 bg-white/10" : "border-border text-muted-foreground/50"
                       )}>S{m.semester}</span>
                       <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">Belum ada materi untuk subyek ini di Kelas {level}.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
