import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await prisma.kelas.findMany({
      include: {
        _count: {
          select: { students: true }
        }
      },
      orderBy: { tingkat: 'asc' }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("ERROR: Failed to fetch kelas:", error);
    return NextResponse.json({ error: "Gagal mengambil data kelas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, tingkat } = await req.json();
    const newKelas = await (prisma as any).kelas.create({
      data: { name, tingkat: parseInt(tingkat) }
    });
    return NextResponse.json(newKelas);
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat kelas (Mungkin nama kelas sudah ada)" }, { status: 500 });
  }
}
