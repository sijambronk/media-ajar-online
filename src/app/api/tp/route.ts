import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cpId = searchParams.get("cpId");
    
    const where: any = {};
    if (cpId) where.cpId = cpId;

    const tp = await prisma.tujuanPembelajaran.findMany({
      where,
      orderBy: { kode: "asc" }
    });
    return NextResponse.json(tp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch TP" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { kode, deskripsi, cpId } = await req.json();
    
    if (!deskripsi || !cpId) {
      return NextResponse.json({ error: "Deskripsi and CP ID are required" }, { status: 400 });
    }

    const tp = await prisma.tujuanPembelajaran.create({
      data: { kode, deskripsi, cpId }
    });

    return NextResponse.json(tp);
  } catch (error) {
    console.error("TP creation error:", error);
    return NextResponse.json({ error: "Failed to create TP" }, { status: 500 });
  }
}
