"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitAsesmenResult({
  studentId,
  asesmenId,
  score,
  answers
}: {
  studentId: string,
  asesmenId: string,
  score: number,
  answers: any
}) {
  try {
    const result = await (prisma as any).result.upsert({
      where: {
        studentId_asesmenId: {
          studentId,
          asesmenId
        }
      },
      update: {
        score,
        answers: JSON.stringify(answers),
        updatedAt: new Date()
      },
      create: {
        studentId,
        asesmenId,
        score,
        answers: JSON.stringify(answers)
      }
    });

    revalidatePath(`/admin/nilai`);
    revalidatePath(`/admin/nilai/[id]`, 'page');
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to save result:", error);
    return { success: false, error: "Gagal menyimpan hasil asesmen." };
  }
}

export async function getStudentsByKelas(kelasId: string) {
  return await prisma.student.findMany({
    where: { kelasId },
    orderBy: { name: 'asc' }
  });
}
