import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;
    const updated = await (prisma as any).student.update({
      where: { id },
      data: {
        name: data.name,
        nisn: data.nisn || null,
        nis: data.nis || null,
        gender: data.gender,
        pob: data.pob || null,
        dob: data.dob ? new Date(data.dob) : null,
        address: data.address || null,
        waNumber: data.waNumber || null,
        kelasId: data.kelasId
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui data siswa" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await (prisma as any).student.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data siswa" }, { status: 500 });
  }
}
