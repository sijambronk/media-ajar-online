"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ChevronLeft, Layout, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Editor from "./Editor";

interface Question {
  id?: string;
  text: string;
  type: "PILGAN" | "ESSAY";
  options: string[];
  answer: string;
}

interface QuizBuilderProps {
  materis: { id: string; title: string }[];
  initialData?: {
    id: string;
    title: string;
    materiId: string;
    type: string;
    questions: any[];
  };
}

export default function QuizBuilder({ materis, initialData }: QuizBuilderProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [materiId, setMateriId] = useState(initialData?.materiId || materis[0]?.id || "");
  const [type, setType] = useState(initialData?.type || "QUIZ");
  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    })) || [{ text: "", type: "PILGAN", options: ["", "", "", ""], answer: "" }]
  );
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "PILGAN", options: ["", "", "", ""], answer: "" }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!title || !materiId) {
      setError("Judul dan Materi harus diisi.");
      return;
    }

    if (questions.some(q => !q.text || (q.type === "PILGAN" && !q.answer))) {
      setError("Semua pertanyaan dan kunci jawaban harus diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    
    const isEdit = !!initialData?.id;
    const url = isEdit ? `/api/asesmen/${initialData.id}` : "/api/asesmen";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          materiId,
          type,
          questions: questions.map(q => ({
            ...q,
            options: JSON.stringify(q.options)
          }))
        }),
      });

      if (res.ok) {
        router.push("/admin/asesmen");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menyimpan asesmen.");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-20 px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/asesmen" className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-all border border-border shadow-sm">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">
              {initialData ? "Edit Asesmen" : "Buat Asesmen"}
            </h1>
            <p className="text-xs text-muted-foreground uppercase font-medium tracking-widest mt-1 opacity-60">Pusat Manajemen Kuis</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-4 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="mr-3 h-5 w-5" /> {saving ? "Menyimpan..." : "Simpan Asesmen"}
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-card p-6 md:p-12 rounded-lg border border-border space-y-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Layout className="h-32 w-32" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Judul Asesmen</label>
            <input
              type="text"
              placeholder="Contoh: Kuis Sel dan Mikroskop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg py-4 px-6 focus:ring-2 focus:ring-primary/50 transition-all outline-none font-semibold text-lg"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Terhubung ke Materi</label>
            <select
              value={materiId}
              onChange={(e) => setMateriId(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg py-4 px-6 focus:ring-2 focus:ring-primary/50 transition-all outline-none font-semibold text-lg appearance-none cursor-pointer text-foreground"
            >
              {materis.map(m => (
                <option key={m.id} value={m.id} className="bg-card text-foreground">{m.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold flex items-center gap-3 uppercase tracking-tight">
            <Layout className="h-6 w-6 text-primary" /> Daftar Pertanyaan
          </h2>
          <span className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border">
            {questions.length} Items
          </span>
        </div>

        <div className="grid gap-8">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-card p-5 md:p-10 rounded-lg border border-border space-y-8 relative group transition-all hover:border-primary/20 shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
              
              {/* Background Number */}
              <div className="absolute -top-10 -left-10 text-[10rem] font-bold text-white/5 select-none pointer-events-none">
                 {qIndex + 1}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                    {qIndex + 1}
                  </div>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                    className="bg-muted border border-border rounded-lg py-2 px-4 text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:bg-muted/80 transition-all text-foreground"
                  >
                    <option value="PILGAN" className="bg-card text-foreground font-sans">Pilihan Ganda</option>
                    <option value="ESSAY" className="bg-card text-foreground font-sans">Esai</option>
                  </select>
                </div>
                
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="p-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-90"
                  title="Hapus Pertanyaan"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Deskripsi Pertanyaan</label>
                <Editor 
                  placeholder="Tuliskan pertanyaan di sini... (Gunakan tombol Sub/Sup untuk rumus kimia/matematika)"
                  content={q.text}
                  minHeight="180px"
                  onChange={(html) => updateQuestion(qIndex, "text", html)}
                />
              </div>

              {q.type === "PILGAN" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="relative group/opt">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-primary/40 text-xs">
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <input
                        type="text"
                        placeholder={`Masukkan Opsi ${String.fromCharCode(65 + oIndex)}`}
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...q.options];
                          newOptions[oIndex] = e.target.value;
                          updateQuestion(qIndex, "options", newOptions);
                        }}
                        className={cn(
                          "w-full bg-muted border rounded-lg py-4 pl-12 pr-14 transition-all outline-none font-semibold",
                          q.answer === opt && opt !== "" ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "border-border"
                        )}
                      />
                      <button
                        onClick={() => updateQuestion(qIndex, "answer", opt)}
                        className={cn(
                          "absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                          q.answer === opt && opt !== "" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {q.answer === opt && opt !== "" ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {q.type === "ESSAY" && (
                <div className="space-y-3 relative z-10">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Panduan Jawaban Benar</label>
                  <textarea
                    placeholder="Tuliskan kata kunci atau contoh jawaban yang benar..."
                    value={q.answer}
                    onChange={(e) => updateQuestion(qIndex, "answer", e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg py-4 px-6 focus:ring-2 focus:ring-primary/50 transition-all outline-none font-medium"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="w-full py-12 rounded-lg border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 group mt-10 shadow-sm"
        >
          <div className="p-4 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all shadow-sm">
            <Plus className="h-8 w-8" />
          </div>
          <div className="text-center">
             <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-all">Tambah Pertanyaan Baru</span>
             <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest mt-1">Pilihan Ganda atau Esai</p>
          </div>
        </button>
      </div>
    </div>
  );
}
