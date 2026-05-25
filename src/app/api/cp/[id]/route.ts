import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cp = await prisma.capaianPembelajaran.findUnique({
      where: { id },
      include: { tujuan: true }
    });
    
    if (!cp) return NextResponse.json({ error: "CP not found" }, { status: 404 });
    
    return NextResponse.json(cp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CP" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { kode, deskripsi, kelas } = await req.json();

    const cp = await prisma.capaianPembelajaran.update({
      where: { id },
      data: { 
        kode, 
        deskripsi, 
        kelas: kelas ? parseInt(kelas) : null 
      }
    });

    return NextResponse.json(cp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update CP" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.capaianPembelajaran.delete({ where: { id } });
    return NextResponse.json({ message: "CP deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete CP" }, { status: 500 });
  }
}
