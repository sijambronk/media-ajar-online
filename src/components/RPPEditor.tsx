"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, PenTool, Layout, FileText, ListChecks, Target, Users, Globe, Smartphone, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveRPP } from "@/app/actions/rpp";
import { useRouter } from "next/navigation";

interface RPPEditorProps {
  materi: any;
  initialRPP?: any;
}

export default function RPPEditor({ materi, initialRPP }: RPPEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const parsedContent = initialRPP ? JSON.parse(initialRPP.content) : null;
  const defaultTp = materi.tpRelations?.map((tp: any) => tp.deskripsi) || [];

  let initialTujuan = defaultTp;
  if (parsedContent) {
    if (parsedContent.desainPembelajaran && Array.isArray(parsedContent.desainPembelajaran.tujuan)) {
      initialTujuan = parsedContent.desainPembelajaran.tujuan;
    } else if (typeof parsedContent.tujuan === 'string') {
      // Backward compatibility for old RPP format
      initialTujuan = parsedContent.tujuan.split('\n').map((s: string) => s.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
    }
  }

  const [sections, setSections] = useState({
    kota: parsedContent?.kota || "",
    tanggal: parsedContent?.tanggal || "",
    identitas: parsedContent?.identitas || `Sekolah: ${process.env.NEXT_PUBLIC_SCHOOL_NAME || "Nama Sekolah"}\nMata Pelajaran: Ilmu Pengetahuan Alam\nMedia Ajar: ${materi.title}\nKelas/Semester: ${materi.kelas} / ${materi.semester}\nAlokasi Waktu: 2 x 40 Menit`,
    identifikasi: parsedContent?.identifikasi || "",
    desainPembelajaran: {
      tujuan: initialTujuan,
      praktikPedagogis: parsedContent?.desainPembelajaran?.praktikPedagogis || "",
      kemitraanPembelajaran: parsedContent?.desainPembelajaran?.kemitraanPembelajaran || "",
      lingkunganPembelajaran: parsedContent?.desainPembelajaran?.lingkunganPembelajaran || "",
      pemanfaatanDigital: parsedContent?.desainPembelajaran?.pemanfaatanDigital || "",
    },
    kegiatan: parsedContent?.kegiatan || "Pendahuluan (15 Menit)\n1. Guru membuka kegiatan dengan salam dan doa.\n2. ...\n\nKegiatan Inti (60 Menit)\n1. ...\n\nKegiatan Penutup (15 Menit)\n1. ...",
    penilaian: parsedContent?.penilaian || "1. Penilaian Sikap: Observasi\n2. Penilaian Pengetahuan: Tes Tertulis\n3. Penilaian Keterampilan: Praktik",
  });

  const handleSave = async (isBaku = false) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await saveRPP({
      materiId: materi.id,
      title: materi.title,
      content: JSON.stringify(sections)
    });

    if (result.success) {
      setSuccess(true);
      if (isBaku) {
        setTimeout(() => router.push("/admin/rpp"), 1500);
      }
    } else {
      setError(result.error || "Gagal menyimpan");
    }
    setIsSubmitting(false);
  };

  const handleTpToggle = (tpDeskripsi: string) => {
    setSections(prev => {
      const currentTujuan = prev.desainPembelajaran.tujuan;
      const isChecked = currentTujuan.includes(tpDeskripsi);
      const newTujuan = isChecked 
        ? currentTujuan.filter((t: string) => t !== tpDeskripsi)
        : [...currentTujuan, tpDeskripsi];
      
      return {
        ...prev,
        desainPembelajaran: {
          ...prev.desainPembelajaran,
          tujuan: newTujuan
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-[2.5rem] border border-border/50 overflow-hidden bg-card">
         <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-8">
               {/* Tempat & Tanggal */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/10 p-6 rounded-3xl border border-border/30">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Kota / Tempat Penulisan</label>
                     <input 
                       type="text" 
                       value={sections.kota}
                       onChange={(e) => setSections({...sections, kota: e.target.value})}
                       placeholder="Misal: Jakarta"
                       className="w-full bg-card border border-border/40 rounded-xl p-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                     />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Tanggal Penulisan</label>
                     <input 
                       type="text" 
                       value={sections.tanggal}
                       onChange={(e) => setSections({...sections, tanggal: e.target.value})}
                       placeholder="Misal: 12 Agustus 2026"
                       className="w-full bg-card border border-border/40 rounded-xl p-3 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                     />
                  </div>
               </div>

               {/* 1. Identitas Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <Layout className="h-4 w-4" /> 1. Identitas Modul
                  </div>
                  <textarea 
                    value={sections.identitas}
                    onChange={(e) => setSections({...sections, identitas: e.target.value})}
                    rows={4}
                    className="w-full bg-secondary/20 border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                    placeholder="Tuliskan identitas modul..."
                  />
               </div>

               {/* 2. Identifikasi Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <Search className="h-4 w-4" /> 2. Identifikasi
                  </div>
                  <textarea 
                    value={sections.identifikasi}
                    onChange={(e) => setSections({...sections, identifikasi: e.target.value})}
                    rows={4}
                    className="w-full bg-secondary/20 border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                    placeholder="Tuliskan identifikasi..."
                  />
               </div>

               {/* 3. Desain Pembelajaran Section */}
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <FileText className="h-4 w-4" /> 3. Desain Pembelajaran
                  </div>
                  
                  <div className="bg-secondary/10 border border-border/30 rounded-3xl p-6 space-y-6">
                    {/* Tujuan Pembelajaran (Checkboxes) */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Target className="h-4 w-4 text-primary" /> Tujuan Pembelajaran
                      </label>
                      <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3">
                        {materi.tpRelations && materi.tpRelations.length > 0 ? (
                          materi.tpRelations.map((tp: any, idx: number) => (
                            <label key={tp.id} className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input 
                                  type="checkbox" 
                                  className="peer sr-only"
                                  checked={sections.desainPembelajaran.tujuan.includes(tp.deskripsi)}
                                  onChange={() => handleTpToggle(tp.deskripsi)}
                                />
                                <div className="h-5 w-5 rounded-md border-2 border-primary/50 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                              </div>
                              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                                {tp.deskripsi}
                              </span>
                            </label>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Belum ada Tujuan Pembelajaran yang ditambahkan untuk materi ini. Silakan tambah di menu CP & TP.</p>
                        )}
                      </div>
                    </div>

                    {/* Praktik Pedagogis */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Layout className="h-4 w-4 text-primary" /> Praktik Pedagogis
                      </label>
                      <textarea 
                        value={sections.desainPembelajaran.praktikPedagogis}
                        onChange={(e) => setSections({...sections, desainPembelajaran: {...sections.desainPembelajaran, praktikPedagogis: e.target.value}})}
                        rows={3}
                        className="w-full bg-card border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                        placeholder="Contoh: Pembelajaran kontekstual dan kooperatif..."
                      />
                    </div>

                    {/* Kemitraan Pembelajaran */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Users className="h-4 w-4 text-primary" /> Kemitraan Pembelajaran
                      </label>
                      <textarea 
                        value={sections.desainPembelajaran.kemitraanPembelajaran}
                        onChange={(e) => setSections({...sections, desainPembelajaran: {...sections.desainPembelajaran, kemitraanPembelajaran: e.target.value}})}
                        rows={3}
                        className="w-full bg-card border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                        placeholder="Contoh: Pembelajaran mengembangkan kolaborasi murid..."
                      />
                    </div>

                    {/* Lingkungan Pembelajaran */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Globe className="h-4 w-4 text-primary" /> Lingkungan Pembelajaran
                      </label>
                      <textarea 
                        value={sections.desainPembelajaran.lingkunganPembelajaran}
                        onChange={(e) => setSections({...sections, desainPembelajaran: {...sections.desainPembelajaran, lingkunganPembelajaran: e.target.value}})}
                        rows={3}
                        className="w-full bg-card border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                        placeholder="Contoh: Memberikan kesempatan kepada murid secara berkelompok..."
                      />
                    </div>

                    {/* Pemanfaatan Digital */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <Smartphone className="h-4 w-4 text-primary" /> Pemanfaatan Digital
                      </label>
                      <textarea 
                        value={sections.desainPembelajaran.pemanfaatanDigital}
                        onChange={(e) => setSections({...sections, desainPembelajaran: {...sections.desainPembelajaran, pemanfaatanDigital: e.target.value}})}
                        rows={3}
                        className="w-full bg-card border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                        placeholder="Contoh: Menggali informasi melalui memanfaatkan internet..."
                      />
                    </div>
                  </div>
               </div>

               {/* 4. Kegiatan Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <PenTool className="h-4 w-4" /> 4. Langkah-langkah Kegiatan
                  </div>
                  <textarea 
                    value={sections.kegiatan}
                    onChange={(e) => setSections({...sections, kegiatan: e.target.value})}
                    rows={8}
                    className="w-full bg-secondary/20 border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                    placeholder="Susun langkah-langkah pembelajaran..."
                  />
               </div>

               {/* 5. Penilaian Section */}
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <ListChecks className="h-4 w-4" /> 5. Asesmen / Penilaian
                  </div>
                  <textarea 
                    value={sections.penilaian}
                    onChange={(e) => setSections({...sections, penilaian: e.target.value})}
                    rows={4}
                    className="w-full bg-secondary/20 border border-border/40 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none font-medium"
                    placeholder="Tuliskan metode penilaian..."
                  />
               </div>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
                 <AlertCircle className="h-5 w-5" /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                 <CheckCircle2 className="h-5 w-5" /> RPP Berhasil disimpan!
              </div>
            )}
         </div>

         {/* Action Footer */}
         <div className="p-6 bg-muted/30 border-t border-border/50 flex flex-col sm:flex-row items-center justify-end gap-4">
            <button 
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card hover:bg-secondary/50 transition-all text-sm font-bold flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Simpan Draft
            </button>
            <button 
              onClick={() => handleSave(true)}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm font-bold flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Jadikan Baku (Lengkap)
            </button>
         </div>
      </div>
    </div>
  );
}
