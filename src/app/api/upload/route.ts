import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create base64 string with proper mime type
    const mimeType = file.type || 'application/octet-stream';
    const base64String = `data:${mimeType};base64,${buffer.toString('base64')}`;
    
    // Return base64 string as URL so it can be saved in the database
    return NextResponse.json({ url: base64String });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
