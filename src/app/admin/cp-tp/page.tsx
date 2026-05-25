import { prisma } from "@/lib/prisma";
import { Target, FileText, ChevronRight, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import CPTPActions from "@/components/Admin/CPTPActions";

export const dynamic = 'force-dynamic';

export default async function AdminCPTPPage() {
  const allCP = await prisma.capaianPembelajaran.findMany({
    include: {
      tujuan: true,
      _count: {
        select: { materi: true }
      }
    },
    orderBy: [
      { kelas: "asc" },
      { kode: "asc" }
    ]
  });

  const totalTP = allCP.reduce((sum, cp) => sum + cp.tujuan.length, 0);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight uppercase">Curriculum Framework</h1>
          <p className="text-muted-foreground font-medium mt-1">Manajemen Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP).</p>
        </div>
        <CPTPActions mode="ADD_CP" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total CP */}
         <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-primary/20 transition-all group">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
               <Target className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total CP</p>
               <h4 className="text-2xl font-bold text-foreground">{allCP.length}</h4>
            </div>
         </div>

         {/* Total TP */}
         <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-emerald-500/20 transition-all group">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
               <Layers className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Total TP</p>
               <h4 className="text-2xl font-bold text-foreground">{totalTP}</h4>
            </div>
         </div>

         {/* Terhubung Materi */}
         <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-indigo-500/20 transition-all group">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all shrink-0">
               <BookOpen className="h-6 w-6" />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Terhubung Materi</p>
               <h4 className="text-2xl font-bold text-foreground">
                  {allCP.reduce((sum, cp) => sum + cp._count.materi, 0)}
               </h4>
            </div>
         </div>
      </div>

      {/* CP List by Classes */}
      <div className="space-y-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((kelas) => {
          const cpInKelas = allCP.filter(cp => (cp.kelas || 7) === kelas);
          
          return (
            <div key={kelas} className="space-y-4">
              {/* Class Header */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary font-black text-xs">
                  {kelas}
                </div>
                <h2 className="text-xl font-bold text-foreground">Kelas {kelas}</h2>
              </div>

              {allCP.length === 0 ? (
                <div className="bg-card border-2 border-dashed border-border rounded-3xl p-16 text-center">
                  <p className="text-muted-foreground font-medium">Belum ada data kurikulum untuk Kelas {kelas}</p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] border-b border-border">
                          <th className="px-8 py-5 w-32">Kode</th>
                          <th className="px-8 py-5">Capaian Pembelajaran (CP) & Tujuan (TP)</th>
                          <th className="px-8 py-5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {cpInKelas.map((cp) => (
                          <tr key={cp.id} className="group hover:bg-muted/20 transition-all">
                            <td className="px-8 py-6 align-top">
                              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest border border-primary/10">
                                {cp.kode || "CP"}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <div className="space-y-6">
                                {/* CP Info */}
                                <div className="space-y-1">
                                  <p className="text-[17px] font-bold text-foreground leading-snug">{cp.deskripsi}</p>
                                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">
                                    <span>{cp._count.materi} Materi Terhubung</span>
                                  </div>
                                </div>

                                {/* Nested TP List */}
                                <div className="pl-6 border-l-2 border-primary/20 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/40">Tujuan Pembelajaran ({cp.tujuan.length})</h4>
                                    <CPTPActions mode="ADD_TP" cpId={cp.id} />
                                  </div>
                                  
                                  <div className="space-y-3">
                                    {cp.tujuan.map(tp => (
                                      <div key={tp.id} className="flex items-start justify-between group/tp p-3 -mx-2 rounded-xl hover:bg-card hover:shadow-sm border border-transparent hover:border-border transition-all">
                                        <div className="flex gap-3">
                                          <span className="text-[9px] font-black text-primary/40 mt-1 uppercase tracking-tighter">
                                            {tp.kode || "TP"}
                                          </span>
                                          <p className="text-sm font-semibold text-foreground/70 leading-relaxed">{tp.deskripsi}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/tp:opacity-100 transition-all">
                                          <CPTPActions mode="EDIT_TP" item={tp} />
                                          <CPTPActions mode="DELETE_TP" item={tp} />
                                        </div>
                                      </div>
                                    ))}
                                    {cp.tujuan.length === 0 && (
                                      <p className="text-[11px] font-medium text-muted-foreground/40 italic">Belum ada TP untuk CP ini.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 align-top">
                              <div className="flex items-center justify-end gap-2">
                                <CPTPActions mode="EDIT_CP" item={cp} />
                                <CPTPActions mode="DELETE_CP" item={cp} />
                              </div>
                            </td>
                          </tr>
                        ))}
                        {cpInKelas.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-8 py-10 text-center text-xs font-bold text-muted-foreground uppercase opacity-40">
                              Tidak ada data untuk kelas ini
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
