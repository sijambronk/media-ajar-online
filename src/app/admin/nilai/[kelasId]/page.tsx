import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ChevronLeft, Search, Filter, Download, ArrowUpDown, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export default async function DetailNilaiPage({ params }: { params: Promise<{ kelasId: string }> }) {
  const { kelasId } = await params;

  if (!(prisma as any).kelas || !(prisma as any).asesmen) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Database Syncing</h2>
        <p className="text-muted-foreground">Mohon tunggu sebentar atau restart server...</p>
      </div>
    );
  }

  const kelas = await (prisma as any).kelas.findUnique({
    where: { id: kelasId },
    include: {
      students: {
        include: {
          results: {
            include: { asesmen: true }
          }
        } as any,
        orderBy: { name: 'asc' }
      }
    } as any
  }) as any;

  if (!kelas) notFound();

  const allAsesmen = await (prisma as any).asesmen.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true }
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Link href="/admin/nilai" className="flex items-center text-xs font-bold text-primary uppercase tracking-widest mb-2 hover:gap-2 transition-all">
            <ChevronLeft className="h-3 w-3" /> Kembali
          </Link>
          <h1 className="text-3xl font-bold">Nilai Kelas {kelas.name}</h1>
          <p className="text-muted-foreground text-sm">Rekapitulasi nilai seluruh siswa untuk setiap asesmen.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari nama siswa..." 
              className="bg-card border border-border pl-10 pr-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all w-64"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary transition-colors">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass rounded-[2rem] border border-border/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-6 py-5 min-w-[250px]">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <User className="h-3 w-3" /> Nama Siswa
                  </div>
                </th>
                {allAsesmen.map((a: any) => (
                  <th key={a.id} className="px-6 py-5 text-center min-w-[150px]">
                    <div className="flex flex-col items-center gap-1 group">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-clamp-1 max-w-[120px]">{a.title}</span>
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors cursor-pointer" />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-center font-bold bg-primary/5 text-primary text-[10px] uppercase tracking-widest">
                  Rata-rata
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {kelas.students.map((s: any) => {
                const results = s.results || [];
                const totalScore = results.reduce((acc: number, r: any) => acc + r.score, 0);
                const avgScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

                return (
                  <tr key={s.id} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border border-border shadow-inner">
                          {s.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-foreground">{s.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.nisn || "Tanpa NISN"}</div>
                        </div>
                      </div>
                    </td>
                    {allAsesmen.map((a: any) => {
                      const result = results.find((r: any) => r.asesmenId === a.id);
                      return (
                        <td key={a.id} className="px-6 py-4 text-center">
                          {result ? (
                            <span className={cn(
                              "text-sm font-black tabular-nums",
                              result.score >= 75 ? "text-green-500" : result.score >= 60 ? "text-orange-500" : "text-destructive"
                            )}>
                              {result.score}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/30 italic">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center bg-primary/5">
                      <span className={cn(
                        "text-base font-black tabular-nums",
                        avgScore >= 75 ? "text-primary" : "text-muted-foreground"
                      )}>
                        {avgScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
