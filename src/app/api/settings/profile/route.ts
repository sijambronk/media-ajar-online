import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const profile = await prisma.profile.findFirst({
      where: { user: { email: session.user.email } }
    });
    return NextResponse.json(profile || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updated = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        nip: data.nip,
        teacherName: data.teacherName,
        subject: data.subject,
        bio: data.bio,
        photoUrl: data.photoUrl,
      },
      create: {
        userId: user.id,
        nip: data.nip,
        teacherName: data.teacherName,
        subject: data.subject,
        bio: data.bio,
        photoUrl: data.photoUrl,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
