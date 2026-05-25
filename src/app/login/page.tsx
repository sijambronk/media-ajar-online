"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email atau password salah.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-card rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-border">
        {/* Visual Side */}
        <div className="lg:w-1/2 bg-muted/50 flex flex-col items-center justify-center p-12 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
           
           <div className="relative z-10 text-center space-y-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-50" />
                <Image 
                  src="/hero_illustration.png"
                  alt="Laptop"
                  width={350}
                  height={350}
                  className="relative z-10 w-full max-w-[320px] h-auto drop-shadow-2xl animate-in zoom-in-50 duration-700 hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{APP_CONFIG.appName}</h3>
                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Digital Learning Ecosystem</p>
              </div>
           </div>
        </div>

        {/* Login Form Side */}
        <div className="lg:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-card relative">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight mb-1 text-foreground">Selamat Datang</h1>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Silahkan login ke panel admin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold text-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail / Username</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl py-3.5 pl-11 pr-4 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-medium text-sm text-foreground placeholder:text-muted-foreground/40"
                    placeholder="admin@sekolah.id"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Password Keamanan</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted/30 border border-border rounded-xl py-3.5 pl-11 pr-12 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-medium text-sm text-foreground placeholder:text-muted-foreground/40"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-primary transition-all focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide"
                >
                  {loading ? "Menyinkronkan..." : "Masuk ke Panel Admin"}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-border text-center">
               <Link href="/" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2">
                 &larr; Kembali ke Beranda
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
