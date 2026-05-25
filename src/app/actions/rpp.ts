"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveRPP({
  materiId,
  title,
  content
}: {
  materiId: string,
  title: string,
  content: string
}) {
  try {
    if (!(prisma as any).rpp) {
       return { success: false, error: "Database belum siap. Mohon restart server." };
    }
    const rpp = await (prisma as any).rpp.upsert({
      where: { materiId },
      update: {
        title,
        content,
        updatedAt: new Date()
      },
      create: {
        materiId,
        title,
        content
      }
    });

    revalidatePath(`/admin/rpp`);
    revalidatePath(`/admin/rpp/${materiId}`);
    
    return { success: true, data: rpp };
  } catch (error) {
    console.error("Failed to save RPP:", error);
    return { success: false, error: "Gagal menyimpan RPP Digital." };
  }
}

export async function deleteRPP(materiId: string) {
  try {
    if (!(prisma as any).rpp) {
      return { success: false, error: "Database belum siap. Mohon restart server." };
    }
    await (prisma as any).rpp.delete({
      where: { materiId }
    });

    revalidatePath(`/admin/rpp`);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete RPP:", error);
    return { success: false, error: "Gagal menghapus RPP Digital." };
  }
}