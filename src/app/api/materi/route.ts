import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, kelas, semester, categoryId, cp, tp, cpId, tpIds } = await req.json();

    if (!title || !categoryId) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    const materi = await prisma.materi.create({
      data: {
        title,
        content,
        kelas,
        semester,
        categoryId,
        cp, // Keep legacy field
        tp, // Keep legacy field
        cpId: cpId || null,
        tpRelations: tpIds ? {
          connect: tpIds.map((id: string) => ({ id }))
        } : undefined
      },
      include: {
        cpRelation: true,
        tpRelations: true
      }
    });

    return NextResponse.json(materi);
  } catch (error) {
    console.error("Error creating materi:", error);
    return NextResponse.json({ error: "Failed to create materi" }, { status: 500 });
  }
}
