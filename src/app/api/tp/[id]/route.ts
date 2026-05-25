import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tp = await prisma.tujuanPembelajaran.findUnique({
      where: { id }
    });
    
    if (!tp) return NextResponse.json({ error: "TP not found" }, { status: 404 });
    
    return NextResponse.json(tp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch TP" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { kode, deskripsi, cpId } = await req.json();

    const tp = await prisma.tujuanPembelajaran.update({
      where: { id },
      data: { kode, deskripsi, cpId }
    });

    return NextResponse.json(tp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update TP" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.tujuanPembelajaran.delete({ where: { id } });
    return NextResponse.json({ message: "TP deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete TP" }, { status: 500 });
  }
}
