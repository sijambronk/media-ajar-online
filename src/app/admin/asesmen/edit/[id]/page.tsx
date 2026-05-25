import { prisma } from "@/lib/prisma";
import QuizBuilder from "@/components/QuizBuilder";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditAsesmenPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAsesmenPage({ params }: EditAsesmenPageProps) {
  const { id } = await params;
  const [asesmen, materis] = await Promise.all([
    prisma.asesmen.findUnique({
      where: { id },
      include: { questions: true }
    }),
    prisma.materi.findMany({
      select: { id: true, title: true }
    })
  ]);

  if (!asesmen) {
    notFound();
  }

  return (
    <div className="py-10">
      <QuizBuilder 
        materis={materis} 
        initialData={asesmen}
      />
    </div>
  );
}
