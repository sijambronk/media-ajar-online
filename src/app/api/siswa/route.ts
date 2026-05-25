import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kelasId = searchParams.get("kelasId");
    
    const siswa = await (prisma as any).student.findMany({
      where: kelasId ? { kelasId } : {},
      include: { kelas: true },
      orderBy: { name: "asc" }
    });

    console.log("DEBUG: Students from Prisma:", siswa);
    return NextResponse.json(siswa || []);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data siswa" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newSiswa = await (prisma as any).student.create({
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
    return NextResponse.json(newSiswa);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambah siswa" }, { status: 500 });
  }
}
