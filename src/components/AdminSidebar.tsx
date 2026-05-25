"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FileQuestion, 
  Settings, 
  LogOut, 
  ChevronRight, 
  BookOpen,
  Database,
  Users,
  Menu,
  X,
  Target,
  GraduationCap,
  FileSpreadsheet,
  ScrollText,
  Lock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { APP_CONFIG } from "@/lib/config";

const adminNavItems = [
  { group: "Utama", items: [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
  ]},
  { group: "Konten", items: [
    { name: `Materi ${APP_CONFIG.subjectShort}`, href: "/admin/materi", icon: FileText },
    { name: "Bank Asesmen", href: "/admin/asesmen", icon: FileQuestion },
    { name: "RPP Digital", href: "/admin/rpp", icon: ScrollText },
    { name: "CP & TP", href: "/admin/cp-tp", icon: Target },
    { name: "Kategori", href: "/admin/kategori", icon: Database },
  ]},
  { group: "Administrasi", items: [
    { name: "Daftar Nilai", href: "/admin/nilai", icon: FileSpreadsheet, isLiteRestricted: true },
    { name: "Data Kelas", href: "/admin/kelas", icon: GraduationCap, isLiteRestricted: true },
    { name: "Data Siswa", href: "/admin/siswa", icon: Users, isLiteRestricted: true },
  ]},
  { group: "Sistem", items: [
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ]},
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState("");
  const { data: session } = useSession();

  return (
    <>
      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#141233] text-white transition-all duration-300 transform border-r border-indigo-500/10",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 border-b border-indigo-500/10 flex items-center justify-between">
            <Link href="/" onClick={onClose} className="flex items-center space-x-3">
              <div className="p-2 rounded bg-primary text-white shadow-lg shadow-primary/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight leading-none text-white">{APP_CONFIG.appName}</span>
                <span className="text-[10px] font-medium text-indigo-300/40 uppercase tracking-widest mt-1">{APP_CONFIG.appTagline}</span>
              </div>
            </Link>

            {/* Mobile Close Button inside Sidebar header */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-indigo-300/50 hover:text-white hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center"
              title="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-6 space-y-8 overflow-y-auto scrollbar-none">
            {adminNavItems.map((group) => (
              <div key={group.group} className="space-y-3">
                <h3 className="text-[10px] font-bold text-indigo-300/20 uppercase tracking-[0.2em] px-3">
                  {group.group}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const isRestricted = 'isLiteRestricted' in item && item.isLiteRestricted;

                    const handleClick = (e: React.MouseEvent) => {
                      if (isRestricted) {
                        e.preventDefault();
                        setSelectedFeature(item.name);
                        setShowUpgradeModal(true);
                      } else {
                        // Automatically collapse the sidebar drawer on mobile/tablet after navigating
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }
                    };

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleClick}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium relative group",
                          isActive 
                            ? "bg-primary text-white shadow-md shadow-primary/20" 
                            : "text-indigo-100/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={cn("h-4 w-4", isActive ? "text-white" : "text-indigo-300/40")} />
                          <span>{item.name}</span>
                        </div>
                        {isRestricted && (
                          <Lock className="h-3 w-3 text-indigo-300/20 group-hover:text-primary transition-colors" />
                        )}
                        {isActive && !isRestricted && <ChevronRight className="h-3 w-3" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Upgrade Modal for Lite Version */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border/80 max-w-md w-full rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col items-center text-center relative gap-6 animate-in zoom-in-95 duration-200">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner animate-pulse">
              <Lock className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Fitur Premium Versi Lengkap</h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold text-primary">Modul: {selectedFeature}</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Mohon maaf, fitur ini saat ini belum tersedia pada versi Lite. Silakan hubungi tim pengembang kami untuk melakukan peningkatan (upgrade) ke versi Lengkap guna mengakses seluruh modul administrasi sekolah, rekapitulasi nilai otomatis, serta berbagai fitur premium lainnya secara penuh.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-5 py-2.5 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 font-bold text-xs border border-border/50 transition-all active:scale-95"
              >
                Kembali
              </button>
              <a 
                href="https://wa.me/6285777191967?text=Halo%20rekan%20sejawat,%20saya%20tertarik%20untuk%20melakukan%20peningkatan%20ke%20versi%20lengkap%20aplikasi%20Modul%20Ajar%20Digital."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
              >
                Hubungi Pengembang
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
