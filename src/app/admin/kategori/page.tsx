import { prisma } from "@/lib/prisma";
import { Database, FileText, ClipboardCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryActions from "@/components/Admin/CategoryActions";

export const dynamic = 'force-dynamic';

export default async function AdminKategoriPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { materi: true }
      },
      materi: {
        select: {
          _count: {
            select: { asesmen: true }
          }
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  const enrichedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    materiCount: cat._count.materi,
    asesmenCount: cat.materi.reduce((sum, m) => sum + m._count.asesmen, 0)
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Manajemen Kategori</h1>
          <p className="text-muted-foreground">Klasifikasi materi kurikulum dan bank soal terintegrasi.</p>
        </div>
        <CategoryActions mode="ADD" />
      </div>

      {/* Grid Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 text-primary">
               <Database className="h-5 w-5" />
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Kategori</span>
            </div>
            <div className="text-4xl font-bold text-foreground">{enrichedCategories.length}</div>
         </div>
         <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 text-emerald-500">
               <FileText className="h-5 w-5" />
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Materi</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
               {enrichedCategories.reduce((sum, c) => sum + c.materiCount, 0)}
            </div>
         </div>
         <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center gap-3 text-indigo-500">
               <ClipboardCheck className="h-5 w-5" />
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Asesmen</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
               {enrichedCategories.reduce((sum, c) => sum + c.asesmenCount, 0)}
            </div>
         </div>
      </div>

      {/* Categories Table */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                <th className="px-8 py-6">Nama Kategori</th>
                <th className="px-8 py-6 text-center">Materi</th>
                <th className="px-8 py-6 text-center">Asesmen</th>
                <th className="px-8 py-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrichedCategories.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <Database className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="font-bold text-[17px] text-foreground">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground font-medium opacity-60">ID: {c.id}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-500/20">
                       {c.materiCount} Modul
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full text-[11px] font-black border border-indigo-500/20">
                       {c.asesmenCount} Soal
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-1">
                       <CategoryActions mode="EDIT" category={{ id: c.id, name: c.name }} />
                       <CategoryActions mode="DELETE" category={{ id: c.id, name: c.name }} />
                       <div className="p-2 text-muted-foreground/30">
                          <ChevronRight className="h-4 w-4" />
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
              {enrichedCategories.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground italic">
                      Belum ada kategori. Silahkan tambah kategori baru.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
