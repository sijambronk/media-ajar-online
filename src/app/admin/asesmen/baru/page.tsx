import { prisma } from "@/lib/prisma";
import QuizBuilder from "@/components/QuizBuilder";

export default async function NewAsesmenPage() {
  const materis = await prisma.materi.findMany({
    select: { id: true, title: true },
    orderBy: { title: "asc" }
  });

  return <QuizBuilder materis={materis} />;
}
