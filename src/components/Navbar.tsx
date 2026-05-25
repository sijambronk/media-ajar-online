"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, Home, Menu, X, ChevronDown, LayoutDashboard, LogOut, Search, ClipboardCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { APP_CONFIG } from "@/lib/config";

const navItems = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Katalog", href: "/katalog", icon: Search },
];

// Fallback items if DB is empty
const defaultGradeItems = [
  { name: "Kelas 7", href: "/kelas/7", icon: BookOpen, desc: APP_CONFIG.classDescriptions[7] },
  { name: "Kelas 8", href: "/kelas/8", icon: BookOpen, desc: APP_CONFIG.classDescriptions[8] },
  { name: "Kelas 9", href: "/kelas/9", icon: GraduationCap, desc: APP_CONFIG.classDescriptions[9] },
];

const defaultAssessmentItems = [
  { name: "Asesmen Kelas 7", href: "/kelas/7?view=asesmen", icon: ClipboardCheck, desc: "Latihan Soal Kelas VII" },
  { name: "Asesmen Kelas 8", href: "/kelas/8?view=asesmen", icon: ClipboardCheck, desc: "Latihan Soal Kelas VIII" },
  { name: "Asesmen Kelas 9", href: "/kelas/9?view=asesmen", icon: ClipboardCheck, desc: "Latihan Soal Kelas IX" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  const [gradeItems, setGradeItems] = useState(defaultGradeItems);
  const [assessmentItems, setAssessmentItems] = useState(defaultAssessmentItems);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic classes
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/kelas");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Get unique tingkat
          const uniqueTingkat = Array.from(new Set(data.map((k: any) => k.tingkat))).sort((a, b) => a - b);
          
          const dynamicGrades = uniqueTingkat.map((t: number) => ({
            name: `Kelas ${t}`,
            href: `/kelas/${t}`,
            icon: t >= 9 ? GraduationCap : BookOpen,
            desc: APP_CONFIG.classDescriptions[t] || `Materi untuk Kelas ${t}`
          }));

          const dynamicAssessments = uniqueTingkat.map((t: number) => ({
            name: `Asesmen Kelas ${t}`,
            href: `/kelas/${t}?view=asesmen`,
            icon: ClipboardCheck,
            desc: `Latihan Soal Kelas ${t}`
          }));

          setGradeItems(dynamicGrades);
          setAssessmentItems(dynamicAssessments);
        }
      } catch (err) {
        console.error("Failed to fetch classes for navbar:", err);
      }
    };

    fetchClasses();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border shadow-sm py-2" 
          : "bg-background border-transparent py-4"
      )}
    >
      <div className="bs-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <div className="p-2 rounded-lg bg-primary text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold tracking-tight leading-none text-foreground">{APP_CONFIG.appName}</span>
                <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">{APP_CONFIG.appTagline}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Materi Dropdown */}
            <div className="relative group/materi">
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-1",
                  pathname.startsWith("/kelas")
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span>Materi</span>
                <ChevronDown className="h-4 w-4 opacity-50 group-hover/materi:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute left-0 mt-2 w-64 bg-card border border-border shadow-xl rounded-xl opacity-0 invisible translate-y-2 group-hover/materi:opacity-100 group-hover/materi:visible group-hover/materi:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {gradeItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item",
                        pathname === item.href ? "bg-muted" : ""
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Asesmen Dropdown */}
            <div className="relative group/asesmen">
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-1",
                  pathname.includes("asesmen")
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                <span>Asesmen</span>
                <ChevronDown className="h-4 w-4 opacity-50 group-hover/asesmen:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute left-0 mt-2 w-64 bg-card border border-border shadow-xl rounded-xl opacity-0 invisible translate-y-2 group-hover/asesmen:opacity-100 group-hover/asesmen:visible group-hover/asesmen:translate-y-0 transition-all duration-300 z-50 overflow-hidden">
                <div className="p-2 space-y-1">
                  {assessmentItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group/item",
                        pathname === item.href ? "bg-muted" : ""
                      )}
                    >
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-px h-4 bg-border mx-4" />

            {session ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="bs-button-primary py-1.5 text-xs flex items-center gap-2 shadow-indigo-200/50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-transparent"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bs-button-primary bg-foreground text-background py-1.5 text-xs"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded hover:bg-muted text-foreground transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background border-b border-border p-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
           <div className="flex flex-col space-y-6">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded font-medium",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">Materi Kelas</div>
                <div className="grid gap-2">
                  {gradeItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-col px-4 py-3 rounded",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}
                    >
                      <span className="font-bold">{item.name}</span>
                      <span className="text-xs opacity-70">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4">Latihan Soal</div>
                <div className="grid gap-2">
                  {assessmentItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex flex-col px-4 py-3 rounded",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}
                    >
                      <span className="font-bold">{item.name}</span>
                      <span className="text-xs opacity-70">{item.desc}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                {session ? (
                  <div className="grid gap-2">
                    <Link href="/admin" className="bs-button-primary text-center">Dashboard</Link>
                    <button onClick={() => signOut()} className="px-4 py-2 text-center text-destructive font-bold">Logout</button>
                  </div>
                ) : (
                  <Link href="/login" className="bs-button-primary text-center">Masuk ke LMS</Link>
                )}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
}

