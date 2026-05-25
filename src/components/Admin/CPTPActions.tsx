"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CPTPActionsProps {
  mode: "ADD_CP" | "EDIT_CP" | "DELETE_CP" | "ADD_TP" | "EDIT_TP" | "DELETE_TP";
  item?: any;
  cpId?: string; // For ADD_TP
}

export default function CPTPActions({ mode, item, cpId }: CPTPActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    kode: item?.kode || "",
    deskripsi: item?.deskripsi || "",
    kelas: item?.kelas || 7,
  });
  const router = useRouter();

  const handleAction = async () => {
    setLoading(true);
    try {
      let url = "/api/cp";
      let method = "POST";
      let body: any = formData;

      if (mode.includes("TP")) {
        url = "/api/tp";
        body = { ...formData, cpId: cpId || item?.cpId };
      }

      if (mode.includes("EDIT")) {
        url = `${url}/${item.id}`;
        method = "PATCH";
      } else if (mode.includes("DELETE")) {
        url = `${url}/${item.id}`;
        method = "DELETE";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "DELETE" ? null : JSON.stringify(body),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal melakukan aksi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    if (mode === "ADD_CP") {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah CP Baru</span>
        </button>
      );
    }
    if (mode === "ADD_TP") {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          <span>Tambah TP</span>
        </button>
      );
    }
    if (mode.includes("EDIT")) {
      return (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Edit2 className="h-4 w-4" />
        </button>
      );
    }
    if (mode.includes("DELETE")) {
      return (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      );
    }
  }

  const isDelete = mode.includes("DELETE");
  const isTP = mode.includes("TP");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className={cn(
        "relative bg-card w-full max-w-lg rounded-3xl p-8 border border-border shadow-2xl animate-in zoom-in-95 duration-200",
        isDelete ? "border-red-500/20" : ""
      )}>
        <div className="flex justify-between items-start mb-6">
          <div>
             <h2 className="text-2xl font-bold text-foreground">
               {isDelete ? "Konfirmasi Hapus" : mode.includes("EDIT") ? "Edit Item" : "Tambah Item Baru"}
             </h2>
             <p className="text-sm text-muted-foreground mt-1">
               {isTP ? "Tujuan Pembelajaran (TP)" : "Capaian Pembelajaran (CP)"}
             </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {isDelete ? (
           <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600">
                 <AlertCircle className="h-6 w-6 shrink-0" />
                 <p className="text-sm font-medium">Hapus <strong>{item?.kode || item?.deskripsi?.substring(0, 30)}...</strong>? Tindakan ini tidak dapat dibatalkan.</p>
              </div>
              <div className="flex justify-end gap-3">
                 <button onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-colors">Batal</button>
                 <button 
                    onClick={handleAction} 
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
                 >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Hapus Permanen
                 </button>
              </div>
           </div>
        ) : (
           <div className="space-y-6">
              {!isTP && (
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Level Kelas (Grade)</label>
                   <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(k => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setFormData({...formData, kelas: k})}
                          className={cn(
                            "py-3 rounded-xl font-bold text-xs border transition-all",
                            formData.kelas === k 
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20" 
                              : "bg-muted border-border text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {k}
                        </button>
                      ))}
                   </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Kode (Opsional)</label>
                   <input 
                      type="text" 
                      value={formData.kode}
                      onChange={(e) => setFormData({...formData, kode: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/40 outline-none transition-all font-bold"
                      placeholder="Contoh: CP.1 atau TP.1.1"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Deskripsi</label>
                   <textarea 
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      className="w-full bg-muted border border-border rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/40 outline-none transition-all min-h-[120px] text-sm"
                      placeholder="Masukkan deskripsi capaian/tujuan..."
                   />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                 <button 
                    onClick={handleAction} 
                    disabled={loading || !formData.deskripsi}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    {mode.includes("EDIT") ? "Simpan Perubahan" : "Simpan Data"}
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
