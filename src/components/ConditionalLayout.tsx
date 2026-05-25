"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/config";

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.852.002-2.63-1.023-5.101-2.887-6.963C16.585 1.978 14.12 .953 11.5 .951c-5.44 0-9.865 4.42-9.869 9.856-.001 1.702.453 3.361 1.317 4.8l-.996 3.633 3.722-.975zm10.741-6.924c-.292-.146-1.729-.853-1.992-.949-.264-.096-.456-.146-.648.146-.192.292-.744.949-.912 1.14-.168.192-.336.216-.628.07-2.91-1.455-4.789-3.847-5.466-5.014-.178-.306-.019-.472.131-.621.135-.134.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.048-.365-.024-.511-.073-.146-.648-1.562-.888-2.147-.234-.563-.473-.487-.648-.496l-.552-.007c-.192 0-.504.072-.768.36-.264.288-1.008.984-1.008 2.4 0 1.416 1.032 2.784 1.176 2.976.144.192 2.032 3.102 4.921 4.347.687.296 1.224.473 1.643.606.692.22 1.322.19 1.82.115.554-.083 1.729-.706 1.972-1.39.243-.684.243-1.27.17-1.39-.072-.12-.264-.192-.556-.339z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalLayout = 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/login") || 
    pathname?.startsWith("/asesmen/");

  if (isMinimalLayout) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      
      <footer className="mt-auto border-t border-border bg-white py-12 px-6">
        <div className="bs-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-1.5 rounded bg-primary text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <span className="text-base font-bold tracking-tight text-foreground">
                  {APP_CONFIG.appName}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Platform pembelajaran digital untuk guru dan siswa{" "}
                {APP_CONFIG.schoolLevel}. Media ajar terintegrasi, asesmen interaktif, dan pantauan progres.
              </p>
            </div>
            
            {/* Navigasi */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="font-semibold mb-4 text-sm text-foreground">Navigasi</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Beranda</Link></li>
                <li><Link href="/katalog" className="hover:text-primary transition-colors">Katalog Materi</Link></li>
                <li><Link href="/asesmen" className="hover:text-primary transition-colors">Bank Soal</Link></li>
              </ul>
            </div>
            
            {/* Kelas */}
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-4 text-sm text-foreground">Kelas</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {APP_CONFIG.classes.map((kelas) => (
                  <li key={kelas}>
                    <Link href={`/kelas/${kelas}`} className="hover:text-primary transition-colors">
                      Kelas {kelas} {APP_CONFIG.schoolLevel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hubungi Kami */}
            <div className="md:col-span-3">
              <h4 className="font-semibold mb-4 text-sm text-foreground">Hubungi:</h4>
              <div className="flex items-center gap-3">
                <a 
                  href="https://wa.me/6285777191967" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-emerald-100 hover:border-emerald-500 hover:scale-110"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </a>
                <a 
                  href="https://instagram.com/kios.media.digital" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-pink-50 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-600 text-pink-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-pink-100 hover:border-transparent hover:scale-110"
                  title="Instagram"
                >
                  <InstagramIcon className="h-4.5 w-4.5" />
                </a>
                <a 
                  href="https://www.youtube.com/@kiosmediadigital" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="h-9 w-9 rounded-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-red-100 hover:border-red-600 hover:scale-110"
                  title="YouTube"
                >
                  <YoutubeIcon className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {APP_CONFIG.appName}. All Rights Reserved.
            </p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              Mencerdaskan Kehidupan Bangsa
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
