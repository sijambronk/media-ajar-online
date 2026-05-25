import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const materi = await prisma.materi.findUnique({
      where: { id },
      include: { 
        category: true,
        cpRelation: true,
        tpRelations: true
      }
    });
    if (!materi) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(materi);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = await req.json();
    const updated = await prisma.materi.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        kelas: data.kelas,
        semester: data.semester,
        categoryId: data.categoryId,
        cp: data.cp, // Legacy
        tp: data.tp, // Legacy
        cpId: data.cpId || null,
        tpRelations: {
          set: data.tpIds ? data.tpIds.map((id: string) => ({ id })) : []
        }
      },
      include: {
        cpRelation: true,
        tpRelations: true
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Materi update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.materi.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
