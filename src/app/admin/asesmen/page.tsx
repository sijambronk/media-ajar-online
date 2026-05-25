import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ClipboardCheck, FileQuestion, ChevronRight, BookOpen, GraduationCap, Beaker, Edit2, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

import DeleteAsesmen from "@/components/DeleteAsesmen";

export const dynamic = 'force-dynamic';

export default async function AsesmenPage() {
  const allMateri = await prisma.materi.findMany({
    orderBy: [
      { kelas: 'asc' },
      { semester: 'asc' },
      { title: 'asc' }
    ],
    include: { 
      category: true,
      asesmen: { 
        include: { _count: { select: { questions: true } } }
      }
    }
  });

  const getKelasIcon = (kelas: number) => {
    switch (kelas) {
      case 7: return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 8: return <Beaker className="h-5 w-5 text-purple-400" />;
      case 9: return <GraduationCap className="h-5 w-5 text-orange-400" />;
      default: return <ClipboardCheck className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manajemen Asesmen</h1>
          <p className="text-muted-foreground">Kelola kuis dan ujian pemahaman secara terstruktur.</p>
        </div>
        <Link href="/admin/asesmen/baru" className="bs-button-primary flex items-center gap-2 shadow-indigo-200/50">
          <Plus className="h-5 w-5" /> Kuis Baru
        </Link>
      </div>

      {/* Systematic Asesmen List */}
      <div className="space-y-12">
        {[7, 8, 9].map((kelas) => (
          <section key={kelas} className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg">
                  {getKelasIcon(kelas)}
               </div>
               <h2 className="text-2xl font-bold">Kelas {kelas}</h2>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                      <th className="px-6 py-5">Modul / Materi</th>
                      <th className="px-6 py-5 text-center">Semester</th>
                      <th className="px-6 py-5 text-center">Status Asesmen</th>
                      <th className="px-6 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allMateri.filter(m => m.kelas === kelas).map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors group border-b border-border/50 last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
                              <FileQuestion className="h-5 w-5" />
                            </div>
                            <div>
                               <div className="font-medium text-[17px] tracking-tight">{m.title}</div>
                               <div className="text-[12px] text-muted-foreground line-clamp-1 opacity-70 mt-0.5 tracking-wider">{m.category.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border",
                            m.semester === 1 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}>
                            SM {m.semester}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {m.asesmen.length > 0 ? (
                             <div className="inline-flex flex-col items-center">
                               <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                                 <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                 AKTIF
                               </span>
                               <span className="text-[9px] text-muted-foreground">{m.asesmen[0]._count.questions} Soal</span>
                             </div>
                           ) : (
                             <span className="text-[10px] font-bold text-muted-foreground italic">BELUM ADA</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                             <Link 
                                 href={m.asesmen.length > 0 ? `/asesmen/${m.asesmen[0].id}` : `/materi/${m.id}`}
                                 className="inline-flex items-center gap-2 bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                                 title={m.asesmen.length > 0 ? "Lihat Soal Kuis" : "Lihat Materi"}
                              >
                                 <Eye className="h-3 w-3" /> Lihat
                              </Link>
                             {m.asesmen.length > 0 ? (
                               <div className="flex items-center gap-1">
                                 <Link 
                                   href={`/admin/asesmen/edit/${m.asesmen[0].id}`}
                                   className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold shadow-sm shadow-primary/20 hover:opacity-90 transition-all"
                                 >
                                   Edit Kuis
                                 </Link>
                                 <DeleteAsesmen id={m.asesmen[0].id} title={m.title} />
                               </div>
                             ) : (
                               <Link 
                                 href={`/admin/asesmen/baru?materiId=${m.id}`}
                                 className="px-3 py-1.5 rounded-md bg-muted text-muted-foreground border border-border text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                               >
                                 Buat Kuis
                               </Link>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-border">
                {allMateri.filter(m => m.kelas === kelas).map((m) => (
                  <div key={m.id} className="p-5 space-y-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 flex items-center justify-center rounded-md bg-muted text-primary border border-border">
                            <FileQuestion className="h-4 w-4" />
                          </div>
                          <div className="space-y-0.5">
                             <div className="font-medium text-[17px] leading-tight text-foreground">{m.title}</div>
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-[8px] px-1 py-0.5 rounded font-bold",
                                  m.semester === 1 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                                )}>S{m.semester}</span>
                                {m.asesmen.length > 0 ? (
                                  <span className="text-[8px] font-bold text-green-400 uppercase tracking-tighter">● {m.asesmen[0]._count.questions} Soal</span>
                                ) : (
                                  <span className="text-[8px] text-muted-foreground italic uppercase">Kosong</span>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <Link 
                          href={m.asesmen.length > 0 ? `/asesmen/${m.asesmen[0].id}` : `/materi/${m.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground border border-border py-2 rounded-lg text-[10px] font-bold"
                          title={m.asesmen.length > 0 ? "Lihat Soal Kuis" : "Lihat Materi"}
                       >
                          <Eye className="h-3 w-3" /> Lihat
                       </Link>
                       {m.asesmen.length > 0 ? (
                         <>
                           <Link 
                             href={`/admin/asesmen/edit/${m.asesmen[0].id}`}
                             className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/30 py-2 rounded-lg text-[10px] font-bold"
                           >
                             Edit Kuis
                           </Link>
                           <DeleteAsesmen id={m.asesmen[0].id} title={m.title} className="flex-1 h-auto py-2" />
                         </>
                       ) : (
                         <Link 
                           href={`/admin/asesmen/baru?materiId=${m.id}`}
                           className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground border border-border py-2 rounded-lg text-[10px] font-bold"
                         >
                           Buat Kuis
                         </Link>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
