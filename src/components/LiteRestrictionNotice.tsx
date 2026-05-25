"use client";

import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LiteRestrictionNoticeProps {
  featureName: string;
}

export default function LiteRestrictionNotice({ featureName }: LiteRestrictionNoticeProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="glass max-w-xl w-full rounded-[2.5rem] p-8 md:p-12 border border-border bg-card shadow-2xl flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="h-20 w-20 rounded-[2rem] bg-primary/10 text-primary flex items-center justify-center shadow-inner">
          <Lock className="h-10 w-10 animate-bounce duration-[3000ms]" />
        </div>
        
        <div className="space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            Fitur Premium Versi Lengkap
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-foreground">
            {featureName}
          </h1>
        </div>

        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          Mohon maaf, fitur ini saat ini belum tersedia dalam versi Lite. Silakan hubungi tim pengembang kami untuk melakukan peningkatan (upgrade) ke versi Lengkap guna mengakses seluruh modul administrasi sekolah, rekapitulasi nilai otomatis, serta berbagai fitur premium lainnya secara penuh.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <Link
            href="/admin"
            className="flex-1 py-4 px-6 rounded-2xl bg-secondary text-foreground hover:bg-secondary/80 font-bold text-xs uppercase tracking-widest border border-border/50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <a
            href="https://wa.me/6285777191967?text=Halo%20rekan%20sejawat,%20saya%20tertarik%20untuk%20melakukan%20peningkatan%20ke%20versi%20lengkap%20aplikasi%20Modul%20Ajar%20Digital."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center"
          >
            Hubungi Pengembang
          </a>
        </div>
      </div>
    </div>
  );
}
