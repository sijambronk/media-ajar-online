import { prisma } from "@/lib/prisma";
import { ScrollText, Plus, FileText, ChevronRight, BookOpen, Clock, Calendar, Beaker, GraduationCap, ClipboardCheck, Edit2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import DeleteRPP from "@/components/DeleteRPP";
import ViewRPP from "@/components/ViewRPP";

export const dynamic = 'force-dynamic';

export default async function RPPPage() {
  const allMateri = await prisma.materi.findMany({
    orderBy: [
      { kelas: 'asc' },
      { semester: 'asc' },
      { title: 'asc' }
    ],
    include: {
      category: true,
      _count: { select: { asesmen: true } }
    }
  });

  const rpps = (prisma as any).rpp ? await (prisma as any).rpp.findMany() : [];

  const schoolProfile = await prisma.schoolProfile.findUnique({
    where: { id: "global-settings" }
  });

  const teacherProfile = await prisma.profile.findFirst({
    include: { user: true }
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
          <h1 className="text-3xl font-bold text-foreground text-blue-950 dark:text-white">Modul & RPP Digital</h1>
          <p className="text-muted-foreground">Susun Rencana Pelaksanaan Pembelajaran untuk setiap materi.</p>
        </div>
        <Link href="#materi-list" className="bs-button-primary flex items-center gap-2">
          <Plus className="h-5 w-5" /> RPP Baru
        </Link>
      </div>

      {/* Systematic RPP List by Class */}
      <div id="materi-list" className="space-y-12">
        {[7, 8, 9].map((kelas) => (
          <section key={kelas} className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-lg">
                  {getKelasIcon(kelas)}
               </div>
               <h2 className="text-2xl font-bold">Kelas {kelas}</h2>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                      <th className="px-6 py-5">Nama Modul Materi</th>
                      <th className="px-6 py-5 text-center">Semester</th>
                      <th className="px-6 py-5 text-center">Status RPP</th>
                      <th className="px-6 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allMateri.filter((m: any) => m.kelas === kelas).map((m: any) => {
                      const hasRPP = rpps.some((r: any) => r.materiId === m.id);
                      
                      return (
                        <tr key={m.id} className="hover:bg-muted/20 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "h-10 w-10 flex items-center justify-center rounded-lg border transition-all",
                                hasRPP ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"
                              )}>
                                <ScrollText className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-bold text-[16px] tracking-tight">{m.title}</div>
                                <div className="text-[11px] text-muted-foreground uppercase tracking-wider opacity-60">
                                  {m.category.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 rounded-md font-bold border",
                              m.semester === 1 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                            )}>
                              SM {m.semester}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              hasRPP ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                            )}>
                              {hasRPP ? (
                                <><CheckCircle2 className="h-3 w-3" /> Lengkap</>
                              ) : (
                                <><AlertCircle className="h-3 w-3" /> Draft</>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                {hasRPP && (
                                  <>
                                    <ViewRPP 
                                      materi={m} 
                                      rpp={rpps.find((r: any) => r.materiId === m.id)}
                                      schoolProfile={schoolProfile}
                                      teacherProfile={teacherProfile} 
                                    />
                                    <DeleteRPP materiId={m.id} title={m.title} />
                                  </>
                                )}
                              <Link 
                                href={`/admin/rpp/${m.id}`}
                                className={cn(
                                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                  hasRPP 
                                    ? "bg-primary/10 text-primary hover:bg-primary hover:text-white" 
                                    : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105"
                                )}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                {hasRPP ? "Edit" : "Buat RPP"}
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {allMateri.filter((m: any) => m.kelas === kelas).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground italic text-sm">
                          Belum ada materi untuk kelas ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
