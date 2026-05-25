"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

export default function CategoryActions({ mode = "ADD", category }: { mode?: "ADD" | "EDIT" | "DELETE", category?: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState(category?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = mode === "ADD" ? "/api/categories" : `/api/categories/${category?.id}`;
      const method = mode === "ADD" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan kategori");
      }

      setIsOpen(false);
      setName(mode === "ADD" ? "" : name);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/categories/${category?.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal menghapus kategori");
        setShowErrorModal(true);
        return;
      }

      router.refresh();
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan sistem saat menghapus.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "DELETE") {
    return (
      <>
        <button 
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
          title="Hapus Kategori"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-card rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Trash2 className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-bold text-foreground mb-2">Hapus Kategori?</h3>
                   <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8">
                      Apakah Anda yakin ingin menghapus kategori <strong>{category?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                   </p>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                         Batal
                      </button>
                      <button 
                        onClick={executeDelete}
                        className="flex-1 py-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors"
                      >
                         Ya, Hapus
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Error/Warning Modal */}
        {showErrorModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-card rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="h-8 w-8" />
                   </div>
                   <h3 className="text-xl font-black text-foreground mb-4 tracking-tight leading-tight px-4">
                      {errorMessage || "Kategori tidak bisa dihapus, karena masih terdapat modul materi yang terhubung"}
                   </h3>
                   <button 
                     onClick={() => setShowErrorModal(false)}
                     className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors"
                   >
                      Saya Mengerti
                   </button>
                </div>
             </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 transition-all",
          mode === "ADD" 
            ? "bs-button-primary" 
            : "p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg"
        )}
      >
        {mode === "ADD" ? (
          <>
            <Plus className="h-5 w-5" /> Tambah Kategori
          </>
        ) : (
          <Edit2 className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold italic text-foreground">
                  {mode === "ADD" ? "Tambah Kategori Baru" : "Edit Nama Kategori"}
                </h3>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 text-red-500 text-xs font-bold border border-red-100 italic">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest ml-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-muted border border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-foreground"
                    placeholder="Contoh: Klasifikasi Makhluk Hidup"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !name}
                    className="flex-1 bs-button-primary py-4 text-sm disabled:opacity-50"
                  >
                    {loading ? "Menyimpan..." : "Simpan Kategori"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
