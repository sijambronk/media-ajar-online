import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

async function authHandler(req: NextRequest, context: any) {
  try {
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    
    if (host) {
      process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    }

    return await handler(req, context);
  } catch (error: any) {
    console.error("NextAuth Route Interceptor Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error in NextAuth wrapper",
        message: error?.message || String(error),
        stack: error?.stack,
      }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

export { authHandler as GET, authHandler as POST };
