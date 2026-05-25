"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { deleteRPP } from "@/app/actions/rpp";

interface DeleteRPPProps {
  materiId: string;
  title: string;
  className?: string;
}

export default function DeleteRPP({ materiId, title, className }: DeleteRPPProps) {
  const [step, setStep] = useState(0); // 0: closed, 1-3: modal stages
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    if (!loading) setStep(0);
  };

  const handleLevelUp = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await executeDelete();
    }
  };

  const executeDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteRPP(materiId);
      if (res.success) {
        setStep(0);
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus RPP.");
        setStep(0);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setStep(1)}
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all duration-300",
          className
        )}
        title={`Hapus RPP ${title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {step > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
            onClick={handleClose}
          />
          
          <div className="relative glass w-full max-w-md rounded-[2.5rem] border border-border/50 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className={cn(
                "p-4 rounded-3xl transition-all duration-500",
                step === 1 ? "bg-yellow-500/20 text-yellow-500" : 
                step === 2 ? "bg-orange-500/20 text-orange-500 scale-110" : 
                "bg-red-600 text-white animate-bounce shadow-lg shadow-red-500/50"
              )}>
                {step === 3 ? <AlertCircle className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">
                  {step === 1 && "Hapus RPP?"}
                  {step === 2 && "APAKAH ANDA YAKIN?"}
                  {step === 3 && "KONFIRMASI TERAKHIR!"}
                </h3>
                <p className="text-muted-foreground font-medium px-4 text-sm leading-relaxed">
                  {step === 1 && `Konfirmasi penghapusan RPP untuk materi: "${title}". Status akan kembali menjadi Draft.`}
                  {step === 2 && "Data RPP yang telah disusun akan hilang sepenuhnya. Anda harus membuatnya dari awal lagi. Lanjutkan?"}
                  {step === 3 && "Data akan menghilang selamanya dari database. Hati-hati!"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                {step === 1 && (
                  <button
                    onClick={handleLevelUp}
                    className="order-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    Hapus
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={handleClose}
                    className="order-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    Batal
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleClose}
                    className="order-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    JANGAN!
                  </button>
                )}

                {step === 1 && (
                  <button
                    onClick={handleClose}
                    className="order-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold py-4 rounded-2xl transition-all border border-border"
                  >
                    Batal
                  </button>
                )}
                {step === 2 && (
                  <button
                    onClick={handleLevelUp}
                    className="order-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold py-4 rounded-2xl transition-all border border-border"
                  >
                    Lanjutkan
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={handleLevelUp}
                    disabled={loading}
                    className="order-2 bg-transparent text-muted-foreground/50 border border-border/30 hover:bg-foreground/5 hover:text-foreground font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "SAYA YAKIN, HAPUS"}
                  </button>
                )}
              </div>
              
              <div className="pt-2">
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
                   Tahap Konfirmasi: {step} dari 3
                 </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
