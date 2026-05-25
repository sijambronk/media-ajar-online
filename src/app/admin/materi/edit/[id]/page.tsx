"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2, Plus, Trash2, GripVertical, BookOpen } from "lucide-react";
import Link from "next/link";
import Editor from "@/components/Editor";
import { cn } from "@/lib/utils";

interface ContentBlock {
  id: string;
  title: string;
  content: string;
}

export default function EditMateriPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState("");
  const [kelas, setKelas] = useState(7);
  const [semester, setSemester] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [allCPs, setAllCPs] = useState<any[]>([]);
  const [selectedCpId, setSelectedCpId] = useState("");
  const [selectedTpIds, setSelectedTpIds] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, materiRes, cpRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/materi/${id}`),
          fetch("/api/cp")
        ]);

        const catData = await catsRes.json();
        const materiData = await materiRes.json();
        const cpData = await cpRes.json();

        if (Array.isArray(catData)) setCategories(catData);
        if (Array.isArray(cpData)) setAllCPs(cpData);
        
        if (!materiRes.ok) throw new Error("Materi not found");

        setTitle(materiData.title);
        setKelas(materiData.kelas);
        setSemester(materiData.semester);
        setCategoryId(materiData.categoryId);
        
        // Initial CP/TP Selection Setup
        let currentCpId = materiData.cpId || "";
        let currentTpIds = materiData.tpRelations?.map((tp: any) => tp.id) || [];

        // AUTO-MATCHING LOGIC
        if (!currentCpId && materiData.cp && Array.isArray(cpData)) {
          const matchedCp = cpData.find((c: any) => 
            (c.kelas === materiData.kelas) && 
            (c.deskripsi.trim() === (materiData.cp?.trim() || "") || materiData.cp?.includes(c.deskripsi.trim()))
          );
          if (matchedCp) {
            currentCpId = matchedCp.id;
            
            if (currentTpIds.length === 0 && materiData.tp) {
              try {
                const legacyTps = JSON.parse(materiData.tp);
                if (Array.isArray(legacyTps)) {
                  matchedCp.tujuan.forEach((tpObj: any) => {
                    if (legacyTps.some(lt => lt.trim() === tpObj.deskripsi.trim() || tpObj.deskripsi.includes(lt.trim()))) {
                      currentTpIds.push(tpObj.id);
                    }
                  });
                }
              } catch (e) {}
            }
          }
        }

        setSelectedCpId(currentCpId);
        setSelectedTpIds(currentTpIds);

        // Parse Multi-block Content
        try {
          const parsedContent = JSON.parse(materiData.content);
          if (Array.isArray(parsedContent)) {
            setBlocks(parsedContent);
          } else {
            setBlocks([{ id: "initial", title: "Konten Utama", content: materiData.content }]);
          }
        } catch (e) {
          setBlocks([{ id: "initial", title: "Konten Utama", content: materiData.content }]);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const availableCPs = allCPs.filter(cp => (cp.kelas || 7) === kelas);
  const selectedCP = allCPs.find(cp => cp.id === selectedCpId);

  const handleTpToggle = (tpId: string) => {
    setSelectedTpIds(prev => 
      prev.includes(tpId) ? prev.filter(id => id !== tpId) : [...prev, tpId]
    );
  };

  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Bagian Baru ${blocks.length + 1}`,
      content: ""
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (index: number) => {
    if (confirm("Hapus bagian konten ini?")) {
      setBlocks(blocks.filter((_, i) => i !== index));
    }
  };

  const updateBlock = (index: number, field: keyof ContentBlock, value: string) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setBlocks(newBlocks);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/materi/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          kelas, 
          semester, 
          categoryId, 
          content: JSON.stringify(blocks),
          cpId: selectedCpId || null,
          tpIds: selectedTpIds,
          // Legacy support (optional)
          cp: selectedCP?.deskripsi || "",
          tp: JSON.stringify(selectedCP?.tujuan.filter((t: any) => selectedTpIds.includes(t.id)).map((t: any) => t.deskripsi) || [])
        }),
      });

      if (res.ok) {
        router.push("/admin/materi");
        router.refresh();
      } else {
        alert("Gagal memperbarui materi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/materi" className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-all border border-border shadow-sm">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase">Edit Materi</h1>
            <p className="text-xs text-muted-foreground uppercase font-medium tracking-widest mt-1 opacity-60">Pusat Manajemen Kurikulum</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-4 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="mr-3 h-5 w-5" /> {saving ? "Menyimpan..." : "Update Materi"}
        </button>
      </div>

      {/* Top Settings Bar */}
      <div className="bg-card p-6 rounded-lg border border-border mb-10 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Level Kelas</label>
            <select
              value={kelas}
              onChange={(e) => {
                setKelas(parseInt(e.target.value));
                setSelectedCpId("");
                setSelectedTpIds([]);
              }}
              className="w-full bg-muted border border-border rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold appearance-none cursor-pointer text-foreground"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((lvl) => (
                <option key={lvl} value={lvl} className="bg-card text-foreground">Kelas {lvl}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(parseInt(e.target.value))}
              className="w-full bg-muted border border-border rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold appearance-none cursor-pointer text-foreground"
            >
              <option value={1} className="bg-card text-foreground">Semester 1 (Ganjil)</option>
              <option value={2} className="bg-card text-foreground">Semester 2 (Genap)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Kategori Subyek</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-muted border border-border rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-bold appearance-none cursor-pointer text-foreground"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-card text-foreground">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Info */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Judul Materi Utama</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg py-6 px-8 focus:ring-2 focus:ring-primary/50 transition-all outline-none text-3xl font-bold"
            placeholder="Masukkan judul materi..."
          />
        </div>

        {/* CP & TP Selection */}
        <div className="space-y-8 p-8 bg-muted/30 rounded-3xl border border-border">
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 flex items-center gap-2">
               Capaian Pembelajaran (CP) 
               <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded tracking-normal normal-case">Terintegrasi Kurikulum</span>
            </label>
            <select
              value={selectedCpId}
              onChange={(e) => {
                setSelectedCpId(e.target.value);
                setSelectedTpIds([]);
              }}
              className="w-full bg-card border border-border rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/50 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
            >
              <option value="">-- Pilih Capaian Pembelajaran untuk Kelas {kelas} --</option>
              {availableCPs.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.kode ? `[${cp.kode}] ` : ""}{cp.deskripsi.substring(0, 100)}...
                </option>
              ))}
            </select>
            {selectedCP && (
              <div className="p-4 bg-white/50 border border-border rounded-xl mt-2 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                <span className="font-bold text-primary block mb-1">Deskripsi Lengkap CP:</span>
                {selectedCP.deskripsi}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Tujuan Pembelajaran (TP) 
              {selectedCP && <span className="ml-2 text-[10px] opacity-40 lowercase font-medium">(Pilih satu atau lebih)</span>}
            </label>
            
            {!selectedCpId ? (
              <div className="p-10 border-2 border-dashed border-border rounded-2xl text-center">
                <p className="text-xs text-muted-foreground/60 font-medium italic">Silahkan pilih CP terlebih dahulu untuk melihat daftar Tujuan Pembelajaran.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {selectedCP.tujuan.map((tp: any) => (
                  <label 
                    key={tp.id} 
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                      selectedTpIds.includes(tp.id) 
                        ? "bg-primary/5 border-primary/30 ring-1 ring-primary/10" 
                        : "bg-card border-border hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "mt-1 h-5 w-5 rounded border flex items-center justify-center transition-all",
                      selectedTpIds.includes(tp.id)
                        ? "bg-primary border-primary text-white"
                        : "bg-muted border-border group-hover:border-primary/40"
                    )}>
                      {selectedTpIds.includes(tp.id) && <Plus className="h-3 w-3 rotate-45" style={{ transform: "rotate(0deg)" }} />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={selectedTpIds.includes(tp.id)}
                      onChange={() => handleTpToggle(tp.id)}
                    />
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 leading-none">
                        {tp.kode || "TP"}
                      </span>
                      <p className="text-xs font-bold text-foreground/70 leading-relaxed">
                        {tp.deskripsi}
                      </p>
                    </div>
                  </label>
                ))}
                {selectedCP.tujuan.length === 0 && (
                  <div className="col-span-2 p-8 text-center bg-amber-50 rounded-xl border border-amber-100 text-amber-600 text-xs font-medium">
                    Belum ada Tujuan Pembelajaran yang terdaftar untuk CP ini.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content Blocks */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-3 uppercase tracking-tight">
              <BookOpen className="h-6 w-6 text-primary" /> Struktur Konten Materi
            </h2>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full border border-border">
              {blocks.length} Bagian
            </span>
          </div>

          <div className="space-y-12">
            {blocks.map((block, index) => (
              <div key={block.id} className="relative group animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute -left-12 top-10 hidden xl:flex items-center gap-2 text-white/10">
                   <span className="text-4xl font-bold">{index + 1}</span>
                   <GripVertical className="h-6 w-6" />
                </div>
                
                <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm transition-all hover:border-primary/20">
                  <div className="p-4 md:p-8 border-b border-border/50 bg-white/[0.02] flex items-center justify-between gap-4">
                    <div className="flex-grow flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                         {index + 1}
                      </div>
                      <input 
                        type="text"
                        value={block.title}
                        onChange={(e) => updateBlock(index, "title", e.target.value)}
                        className="bg-transparent border-none outline-none text-lg font-bold w-full focus:text-primary transition-colors"
                        placeholder="Judul Bagian (Contoh: Pertemuan 1 - Pengenalan)"
                      />
                    </div>
                    <button 
                      onClick={() => removeBlock(index)}
                      className="p-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="p-2">
                     <Editor 
                       content={block.content} 
                       onChange={(html) => updateBlock(index, "content", html)} 
                     />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addBlock}
            className="w-full py-12 rounded-[2.5rem] border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 group mt-10 shadow-xl"
          >
            <div className="p-4 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all shadow-sm">
              <Plus className="h-8 w-8" />
            </div>
            <div className="text-center">
               <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-all">Tambah Bagian Konten Baru</span>
               <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest mt-1">Misal: Pertemuan Berikutnya atau Sub-Topik Baru</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
