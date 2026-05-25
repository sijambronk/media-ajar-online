"use client";

import Link from "next/link";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface MateriTableProps {
  materis: any[];
}

export default function MateriTable({ materis: initialMateris }: MateriTableProps) {
  const [materis, setMateris] = useState(initialMateris);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus materi "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/materi/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMateris(materis.filter((m) => m.id !== id));
        router.refresh();
      } else {
        alert("Gagal menghapus materi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-secondary/50 text-muted-foreground text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-bold">Judul</th>
            <th className="px-6 py-4 font-bold">Kelas</th>
            <th className="px-6 py-4 font-bold">Kategori</th>
            <th className="px-6 py-4 font-bold">Semester</th>
            <th className="px-6 py-4 font-bold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {materis.map((m) => (
            <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4 font-medium">{m.title}</td>
              <td className="px-6 py-4 text-muted-foreground">Kelas {m.kelas}</td>
              <td className="px-6 py-4">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                  {m.category.name}
                </span>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{m.semester}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link
                    href={`/admin/materi/edit/${m.id}`}
                    className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-primary transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(m.id, m.title)}
                    disabled={deletingId === m.id}
                    className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-destructive transition-all disabled:opacity-50"
                  >
                    {deletingId === m.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {materis.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          Belum ada materi. Klik [Tambah Materi] untuk mulai.
        </div>
      )}
    </div>
  );
}
