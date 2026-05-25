import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  Users, 
  FileQuestion, 
  ArrowRight, 
  PieChart, 
  Activity, 
  Plus, 
  FileText, 
  Database,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Search,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import BootstrapCard from "@/components/BootstrapCard";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [materisCount, categoriesCount, asesmenCount, studentsCount, recentMateris, allMateris] = await Promise.all([
    prisma.materi.count(),
    prisma.category.count(),
    prisma.asesmen.count(),
    (prisma as any).student.count(),
    prisma.materi.findMany({ 
      take: 5, 
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, kelas: true, semester: true } 
    }),
    prisma.materi.findMany({ select: { kelas: true, semester: true } })
  ]);
  
  const allMateriTyped = allMateris as { kelas: number | string, semester: number | string }[];

  // Small logic for infographics
  const g7Count = allMateriTyped.filter(m => Number(m.kelas) === 7).length;
  const g8Count = allMateriTyped.filter(m => Number(m.kelas) === 8).length;
  const g9Count = allMateriTyped.filter(m => Number(m.kelas) === 9).length;
  
  const sem1Count = allMateriTyped.filter(m => Number(m.semester) === 1).length;
  const sem2Count = allMateriTyped.filter(m => Number(m.semester) === 2).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
             Dashboard Overview
             <Sparkles className="h-5 w-5 text-yellow-500" />
           </h1>
           <p className="text-sm text-muted-foreground mt-1">
             Selamat datang kembali, Administrator. Berikut adalah ringkasan performa sistem hari ini.
           </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/materi/baru" 
            className="bs-button-primary flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Tambah Materi
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Materi", value: materisCount, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "+2 minggu ini" },
          { label: "Kategori", value: categoriesCount, icon: Database, color: "text-purple-600", bg: "bg-purple-50", trend: "Optimized" },
          { label: "Bank Asesmen", value: asesmenCount, icon: FileQuestion, color: "text-emerald-600", bg: "bg-emerald-50", trend: "Live" },
          { label: "Siswa Aktif", value: studentsCount.toString(), icon: Users, color: "text-orange-600", bg: "bg-orange-50", trend: "+12% Growth" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-lg shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-md flex-shrink-0", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div className="min-w-0">
               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
               <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-bold tracking-tight">{stat.value}</h4>
                  <span className="text-[10px] text-emerald-600 font-bold">{stat.trend}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Distribusi Graph */}
        <BootstrapCard 
          title="Distribusi Modul per Kelas" 
          className="lg:col-span-2"
          header={
            <div className="flex items-center justify-between">
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Analytics</span>
               <Link href="/admin/materi" className="text-xs font-bold text-primary hover:underline">Lihat Semua</Link>
            </div>
          }
        >
          <div className="h-[250px] flex items-end justify-around gap-4 pt-4">
            {[
              { label: "Kelas 7", count: g7Count, color: "bg-blue-500" },
              { label: "Kelas 8", count: g8Count, color: "bg-purple-500" },
              { label: "Kelas 9", count: g9Count, color: "bg-orange-500" },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group h-full">
                <div className="relative w-full flex items-end justify-center h-full bg-muted/20 rounded-t-lg">
                   <div 
                      className={cn("w-full max-w-[60px] rounded-t-lg shadow-sm transition-all group-hover:brightness-110", bar.color)}
                      style={{ height: `${(bar.count / Math.max(materisCount, 1)) * 100}%`, minHeight: '10%' }}
                   />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider">{bar.label}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{bar.count} Modul</p>
                </div>
              </div>
            ))}
          </div>
        </BootstrapCard>

        {/* Recent Activity List */}
        <BootstrapCard title="Materi Terbaru" className="flex flex-col">
          <div className="divide-y divide-border">
            {recentMateris.map((m: any) => (
              <div key={m.id} className="py-3 flex items-start gap-3 group cursor-pointer hover:bg-muted/50 rounded px-2 transition-colors">
                 <div className="p-2 rounded bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                    <BookOpen className="h-4 w-4" />
                 </div>
                 <div className="min-w-0">
                    <p className="text-sm font-bold truncate leading-tight">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Kelas {m.kelas} • Semester {m.semester}</p>
                 </div>
              </div>
            ))}
          </div>
          <Link href="/admin/materi" className="bs-button-secondary w-full text-center py-2 text-xs mt-4 flex items-center justify-center gap-2">
            Kelola Semua Materi <ArrowRight className="h-3 w-3" />
          </Link>
        </BootstrapCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Semester Stats */}
         <BootstrapCard title="Persentase Semester">
            <div className="space-y-6 py-4">
              {[
                { label: "Semester 1 (Ganjil)", count: sem1Count, color: "bg-blue-600" },
                { label: "Semester 2 (Genap)", count: sem2Count, color: "bg-emerald-600" },
              ].map((sem, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end text-xs font-bold uppercase">
                    <span className="text-muted-foreground tracking-tight">{sem.label}</span>
                    <span className="text-foreground">{materisCount > 0 ? Math.round((sem.count / materisCount) * 100) : 0}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", sem.color)} 
                      style={{ width: `${materisCount > 0 ? (sem.count / materisCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground font-medium border-t border-border pt-4">
               <Activity className="h-3 w-3 text-emerald-500 animate-pulse" /> Data sinkronisasi otomatis dengan server utama.
            </div>
         </BootstrapCard>

         {/* Internal Links/Tools */}
         <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Bank Soal", icon: FileQuestion, color: "text-emerald-500", href: "/admin/asesmen" },
              { label: "Database", icon: Database, color: "text-blue-500", href: "/admin/kategori" },
              { label: "Search", icon: Search, color: "text-orange-500", href: "/admin/search" },
            ].map((tool, i) => (
              <Link key={i} href={tool.href} className="bg-card border border-border p-6 rounded-lg hover:shadow-md hover:border-primary/20 transition-all group">
                <tool.icon className={cn("h-6 w-6 mb-3 transition-transform group-hover:scale-110", tool.color)} />
                <h4 className="text-sm font-bold tracking-tight">{tool.label}</h4>
                <div className="mt-2 flex items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-hover:text-primary transition-colors">
                   Open Tool <ArrowUpRight className="h-2 w-2 ml-1" />
                </div>
              </Link>
            ))}
         </div>
      </div>

    </div>
  );
}


