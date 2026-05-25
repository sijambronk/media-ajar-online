import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuizView from "@/components/QuizView";

export default async function StudentAsesmenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const asesmen = await prisma.asesmen.findUnique({
    where: { id },
    include: {
      questions: true,
      materi: true
    }
  });

  if (!asesmen) {
    notFound();
  }

  const students = await prisma.student.findMany({
    where: {
      kelas: { tingkat: asesmen.materi.kelas }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <QuizView asesmen={asesmen} students={students} />
    </div>
  );
}
