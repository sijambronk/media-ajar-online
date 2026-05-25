import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const school = await prisma.schoolProfile.findUnique({
      where: { id: "global-settings" }
    });
    return NextResponse.json(school || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch school profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const updated = await prisma.schoolProfile.upsert({
      where: { id: "global-settings" },
      update: {
        name: data.name,
        npsn: data.npsn,
        address: data.address,
        phone: data.phone,
        email: data.email,
        principal: data.principal,
        logoUrl: data.logoUrl,
      },
      create: {
        id: "global-settings",
        name: data.name,
        npsn: data.npsn,
        address: data.address,
        phone: data.phone,
        email: data.email,
        principal: data.principal,
        logoUrl: data.logoUrl,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update school profile" }, { status: 500 });
  }
}
