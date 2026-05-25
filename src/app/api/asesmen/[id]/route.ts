import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asesmen = await prisma.asesmen.findUnique({
      where: { id },
      include: { 
        questions: true,
        materi: { select: { id: true, title: true } }
      }
    });

    if (!asesmen) {
      return NextResponse.json({ error: "Asesmen not found" }, { status: 404 });
    }

    return NextResponse.json(asesmen);
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

  try {
    const { id } = await params;
    const { title, materiId, type, questions } = await req.json();

    // Use a transaction to update the asesmen and its questions
    const updatedAsesmen = await prisma.$transaction(async (tx) => {
      // 1. Delete all existing questions for this asesmen
      await tx.question.deleteMany({
        where: { asesmenId: id }
      });

      // 2. Update the asesmen itself and create new questions
      return await tx.asesmen.update({
        where: { id },
        data: {
          title,
          materiId,
          type,
          questions: {
            create: questions.map((q: any) => ({
              text: q.text,
              type: q.type,
              options: q.options,
              answer: q.answer,
            })),
          },
        },
        include: { questions: true }
      });
    });

    return NextResponse.json(updatedAsesmen);
  } catch (error) {
    console.error("Error updating asesmen:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
   const session = await getServerSession(authOptions);
   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   try {
     const { id } = await params;
     await prisma.$transaction([
       prisma.question.deleteMany({ where: { asesmenId: id } }),
       prisma.asesmen.delete({ where: { id } })
     ]);
     return NextResponse.json({ success: true });
   } catch (error) {
     return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
   }
}
