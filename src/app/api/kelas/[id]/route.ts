import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, tingkat } = await req.json();

    console.log(`[API] Updating Kelas ${id} to:`, { name, tingkat });

    const updated = await (prisma as any).kelas.update({
      where: { id },
      data: {
        name: name,
        tingkat: parseInt(tingkat.toString())
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[API ERROR] PATCH:", error);
    return NextResponse.json({ error: "Gagal memperbarui data kelas" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[API] Deleting Kelas ${id}`);

    // Check for students
    const studentsCount = await (prisma as any).student.count({
      where: { kelasId: id }
    });

    if (studentsCount > 0) {
      return NextResponse.json({ 
        error: `Tidak bisa menghapus: Masih ada ${studentsCount} siswa di kelas ini.` 
      }, { status: 400 });
    }

    await (prisma as any).kelas.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API ERROR] DELETE:", error);
    return NextResponse.json({ error: "Gagal menghapus data kelas" }, { status: 500 });
  }
}
