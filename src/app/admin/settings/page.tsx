"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, School, UserCircle, Save, Loader2, MapPin, Phone, Mail, IdCard, BookOpen, Plus } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // States for School Profile
  const [school, setSchool] = useState({
    name: "",
    npsn: "",
    address: "",
    phone: "",
    email: "",
    principal: "",
    logoUrl: ""
  });
  
  // States for Personal Profile (Guru)
  const [profile, setProfile] = useState({
    nip: "",
    teacherName: "",
    subject: APP_CONFIG.subject,
    bio: "",
    photoUrl: ""
  });

  const [loading, setLoading] = useState(true);
  const [savingSchool, setSavingSchool] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [schoolRes, profileRes] = await Promise.all([
          fetch("/api/settings/school"),
          fetch("/api/settings/profile")
        ]);
        
        const schoolData = await schoolRes.json();
        const profileData = await profileRes.json();
        
        if (Object.keys(schoolData).length > 0) setSchool(prev => ({ ...prev, ...schoolData }));
        if (Object.keys(profileData).length > 0) setProfile(prev => ({ ...prev, ...profileData }));
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSchool = async () => {
    setSavingSchool(true);
    try {
      const res = await fetch("/api/settings/school", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school)
      });
      if (!res.ok) throw new Error();
      alert("Profil Sekolah berhasil diperbarui.");
    } catch (err) {
      alert("Gagal memperbarui profil sekolah.");
    } finally {
      setSavingSchool(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
      if (!res.ok) throw new Error();
      alert("Profil Pribadi berhasil diperbarui.");
    } catch (err) {
      alert("Gagal memperbarui profil pribadi.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setProfile({ ...profile, photoUrl: data.url });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Gagal mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setSchool({ ...school, logoUrl: data.url });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Gagal mengunggah logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">Pengaturan Platform</h1>
        <p className="text-xs text-muted-foreground uppercase font-medium tracking-widest mt-2 opacity-60">Konfigurasi Identitas & Tampilan</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Kolom Kiri: Profil Sekolah & Tema (7 Cols) */}
        <div className="xl:col-span-7 space-y-10">
          {/* Profil Sekolah */}
          <div className="glass p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <School className="h-32 w-32" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <School className="h-6 w-6" />
                  </div>
                  Identitas Sekolah
                </h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Informasi Utama Satuan Pendidikan</p>
              </div>
              <button 
                onClick={handleSaveSchool}
                disabled={savingSchool}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {savingSchool ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                SIMPAN PERUBAHAN
              </button>
            </div>

            <div className="flex flex-col items-center space-y-4 mb-4 relative z-10">
               <input 
                 type="file" 
                 ref={logoInputRef} 
                 onChange={handleLogoUpload} 
                 accept="image/*" 
                 className="hidden" 
               />
               <div 
                 onClick={() => logoInputRef.current?.click()}
                 className="h-24 w-24 rounded-3xl bg-primary/10 border-4 border-primary/20 flex items-center justify-center text-primary relative overflow-hidden group cursor-pointer"
               >
                  {school.logoUrl ? (
                    <img 
                      src={school.logoUrl} 
                      alt="Logo" 
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <School className="h-12 w-12 opacity-30 group-hover:scale-110 transition-all duration-500" />
                  )}
                  
                  <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    {uploadingLogo ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6 text-white" />
                    )}
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-sm font-bold">Logo Sekolah</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{uploadingLogo ? "Mengunggah..." : "Klik untuk Ubah"}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nama Lengkap Sekolah</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={school.name || ""}
                    onChange={e => setSchool({...school, name: e.target.value})}
                    placeholder="Contoh: SMP Negeri 1 Antigravity"
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">NPSN</label>
                <input 
                  type="text" 
                  value={school.npsn || ""}
                  onChange={e => setSchool({...school, npsn: e.target.value})}
                  placeholder="Kode NPSN Sekolah"
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm font-semibold"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea 
                    rows={2}
                    value={school.address || ""}
                    onChange={e => setSchool({...school, address: e.target.value})}
                    placeholder="Alamat operasional sekolah..."
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nama Kepala Sekolah</label>
                <input 
                  type="text" 
                  value={school.principal || ""}
                  onChange={e => setSchool({...school, principal: e.target.value})}
                  placeholder="Nama & Gelar Lengkap"
                  className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Sekolah</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <input 
                    type="email" 
                    value={school.email || ""}
                    onChange={e => setSchool({...school, email: e.target.value})}
                    placeholder="admin@sekolah.sch.id"
                    className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary/40 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tema & Tampilan */}
          <div className="glass p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                   <Sun className="h-6 w-6" />
                </div>
                Tema & Antarmuka
              </h2>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Kustomisasi Visual DASHBOARD</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all group",
                  theme === "light" 
                    ? "bg-primary/5 border-primary ring-2 ring-primary/20" 
                    : "bg-muted/30 border-border hover:bg-muted/50"
                )}
              >
                <div className={cn("p-4 rounded-2xl shadow-sm transition-all", theme === "light" ? "bg-white text-orange-500 scale-110" : "bg-card text-muted-foreground group-hover:scale-105")}>
                  <Sun className="h-8 w-8" />
                </div>
                <div className="text-center">
                   <div className="text-sm font-bold uppercase tracking-tight">Light Mode</div>
                   <div className={cn("text-[9px] font-medium uppercase tracking-[0.2em] mt-1", theme === "light" ? "text-primary" : "text-muted-foreground opacity-40")}>Siang Hari</div>
                </div>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all group",
                  theme === "dark" 
                    ? "bg-primary/5 border-indigo-500 ring-2 ring-indigo-500/20" 
                    : "bg-muted/30 border-border hover:bg-muted/50"
                )}
              >
                <div className={cn("p-4 rounded-2xl shadow-sm transition-all", theme === "dark" ? "bg-slate-900 text-blue-400 scale-110" : "bg-card text-muted-foreground group-hover:scale-105")}>
                  <Moon className="h-8 w-8" />
                </div>
                <div className="text-center">
                   <div className="text-sm font-bold uppercase tracking-tight">Dark Mode</div>
                   <div className={cn("text-[9px] font-medium uppercase tracking-[0.2em] mt-1", theme === "dark" ? "text-indigo-400" : "text-muted-foreground opacity-40")}>Mode Malam</div>
                </div>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all group",
                  theme === "system" 
                    ? "bg-primary/5 border-zinc-500 ring-2 ring-zinc-500/20" 
                    : "bg-muted/30 border-border hover:bg-muted/50"
                )}
              >
                <div className={cn("p-4 rounded-2xl shadow-sm transition-all", theme === "system" ? "bg-muted text-zinc-600 scale-110" : "bg-card text-muted-foreground group-hover:scale-105")}>
                  <Monitor className="h-8 w-8" />
                </div>
                <div className="text-center">
                   <div className="text-sm font-bold uppercase tracking-tight">Auto System</div>
                   <div className={cn("text-[9px] font-medium uppercase tracking-[0.2em] mt-1", theme === "system" ? "text-zinc-500" : "text-muted-foreground opacity-40")}>Setelan Perangkat</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Profil Guru (5 Cols) */}
        <div className="xl:col-span-5">
           <div className="glass p-8 rounded-[2.5rem] border border-border bg-card shadow-2xl space-y-8 relative overflow-hidden h-full">
              <div className="absolute -bottom-10 -right-10 p-8 opacity-5">
                <UserCircle className="h-48 w-48" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    Profil Pribadi
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Atur Identitas Anda sebagai Guru</p>
                </div>
                <button 
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  SIMPAN
                </button>
              </div>

              <div className="flex flex-col items-center space-y-4 mb-8">
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileUpload} 
                   accept="image/*" 
                   className="hidden" 
                 />
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="h-28 w-28 rounded-3xl bg-emerald-100 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-600 relative overflow-hidden group cursor-pointer"
                 >
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt="Profile" 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <UserCircle className="h-16 w-16 opacity-30 group-hover:scale-110 transition-all duration-500" />
                    )}
                    
                    <div className="absolute inset-0 bg-emerald-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      {uploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Plus className="h-8 w-8 text-white" />
                      )}
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-sm font-bold">Foto Profil</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{uploading ? "Mengunggah..." : "Klik untuk Ubah"}</p>
                 </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Nama Lengkap Guru</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={profile.teacherName || ""}
                      onChange={e => setProfile({...profile, teacherName: e.target.value})}
                      placeholder="Masukkan nama lengkap & gelar"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">NIP / Kode Guru</label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={profile.nip || ""}
                      onChange={e => setProfile({...profile, nip: e.target.value})}
                      placeholder="Masukkan NIP atau ID unik"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Mata Pelajaran Diampu</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <select
                      value={profile.subject || ""}
                      onChange={e => setProfile({...profile, subject: e.target.value})}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all text-sm font-semibold appearance-none"
                    >
                      {APP_CONFIG.availableSubjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Biografi Singkat</label>
                  <textarea 
                    rows={4}
                    value={profile.bio || ""}
                    onChange={e => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tuliskan pengalaman mengajar atau deskripsi diri..."
                    className="w-full bg-muted/50 border border-border rounded-xl py-4 px-4 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all text-sm font-semibold resize-none"
                  />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
