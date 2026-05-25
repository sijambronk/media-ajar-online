import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kelas = searchParams.get("kelas");
    
    const where: any = {};
    if (kelas) where.kelas = parseInt(kelas);

    const cp = await prisma.capaianPembelajaran.findMany({
      where,
      include: {
        tujuan: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(cp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch CP" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { kode, deskripsi, kelas } = await req.json();
    
    if (!deskripsi) {
      return NextResponse.json({ error: "Deskripsi is required" }, { status: 400 });
    }

    const cp = await prisma.capaianPembelajaran.create({
      data: { 
        kode, 
        deskripsi, 
        kelas: kelas ? parseInt(kelas) : null 
      }
    });

    return NextResponse.json(cp);
  } catch (error) {
    console.error("CP creation error:", error);
    return NextResponse.json({ error: "Failed to create CP" }, { status: 500 });
  }
}
