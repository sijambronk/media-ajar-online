import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, ClipboardCheck, FileQuestion, ChevronRight, BookOpen, GraduationCap, Beaker, Edit2, Eye, FileText, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DeleteMateri from "@/components/DeleteMateri";

export const dynamic = 'force-dynamic';

export default async function AdminMateriPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Manajemen Materi</h1>
          <p className="text-muted-foreground">Kelola konten kurikulum dan capaian pembelajaran.</p>
        </div>
        <Link href="/admin/materi/baru" className="bs-button-primary flex items-center gap-2 shadow-indigo-200/50">
          <Plus className="h-5 w-5" /> Materi Baru
        </Link>
      </div>

      {/* Systematic Materi List */}
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
                      <th className="px-6 py-5">Nama Modul</th>
                      <th className="px-6 py-5 text-center">Semester</th>
                      <th className="px-6 py-5">Kategori</th>
                      <th className="px-6 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allMateri.filter(m => m.kelas === kelas).map((m) => (
                      <tr key={m.id} className="hover:bg-muted/30 transition-colors group border-b border-border/50 last:border-0">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-muted text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
                               <FileText className="h-5 w-5" />
                            </div>
                            <div>
                               <div className="font-medium text-[17px] tracking-tight">{m.title}</div>
                               <div className="text-[12px] text-muted-foreground line-clamp-1 opacity-70 mt-0.5">
                                 {m.cp?.substring(0, 90)}...
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md font-bold border",
                            m.semester === 1 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}>
                            S{m.semester}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-muted-foreground border border-border px-2 py-1 rounded-md bg-muted/50">
                            {m.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <Link 
                                 href={`/materi/${m.id}`}
                                 className="inline-flex items-center gap-2 bg-muted text-muted-foreground border border-border px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                                 title="Lihat Materi"
                              >
                                 <Eye className="h-3 w-3" /> Lihat
                              </Link>
                             <Link 
                               href={`/admin/materi/edit/${m.id}`}
                               className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-border px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-primary hover:text-white transition-all"
                             >
                               <Edit2 className="h-3 w-3" /> Edit
                             </Link>
                             <DeleteMateri id={m.id} title={m.title} />
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
                    <div className="flex justify-between items-start gap-3">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex items-center justify-center rounded-md bg-muted text-primary border border-border">
                             <FileText className="h-5 w-5" />
                          </div>
                          <div className="space-y-0.5">
                             <div className="font-medium text-[17px] leading-tight text-foreground">{m.title}</div>
                             <div className="flex items-center gap-2">
                                <span className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-bold uppercase",
                                  m.semester === 1 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                                )}>S{m.semester}</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.category.name}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <Link 
                          href={`/materi/${m.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-muted text-muted-foreground border border-border py-2 rounded-lg text-[10px] font-bold"
                       >
                          <Eye className="h-3 w-3" /> Lihat
                       </Link>
                       <Link 
                          href={`/admin/materi/edit/${m.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary border border-border py-2 rounded-lg text-[10px] font-bold"
                       >
                          <Edit2 className="h-3 w-3" /> Edit
                       </Link>
                       <DeleteMateri id={m.id} title={m.title} className="flex-1" />
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
