import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, materiId, type, questions } = await req.json();

    const asesmen = await prisma.asesmen.create({
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

    return NextResponse.json(asesmen);
  } catch (error) {
    console.error("Error creating asesmen:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const asesmen = await prisma.asesmen.findMany({
      include: { materi: true, _count: { select: { questions: true } } },
      orderBy: { updatedAt: "desc" }
    });
    return NextResponse.json(asesmen);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
