import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const students = await (prisma as any).student.findMany({
      include: { kelas: true },
      orderBy: { kelas: { name: "asc" } }
    }) as any[];

    const data = students.map((s: any) => ({
      "Nama Lengkap": s.name,
      "NISN": s.nisn,
      "NIS": s.nis,
      "Kelas": s.kelas.name,
      "Jenis Kelamin": s.gender,
      "Tempat Lahir": s.pob,
      "Tanggal Lahir": s.dob ? new Date(s.dob).toLocaleDateString("id-ID") : "",
      "Alamat": s.address,
      "No WhatsApp": s.waNumber
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="data-siswa.xlsx"'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal ekspor data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Batch process classes first to map names to IDs
    const classes = await (prisma as any).kelas.findMany() as any[];
    const classMap = new Map(classes.map((c: any) => [c.name.toLowerCase(), c.id]));

    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (const row of data) {
      const name = row["Nama Lengkap"] || row["name"];
      const className = row["Kelas"] || row["kelas"];
      
      if (!name || !className) {
        results.failed++;
        results.errors.push(`Baris tanpa nama atau kelas: ${JSON.stringify(row)}`);
        continue;
      }

      const kelasId = classMap.get(className.toString().toLowerCase());
      if (!kelasId) {
        results.failed++;
        results.errors.push(`Kelas '${className}' tidak ditemukan di sistem.`);
        continue;
      }

      try {
        await (prisma as any).student.upsert({
          where: { nisn: row["NISN"]?.toString() || row["nisn"]?.toString() || "placeholder-" + Math.random() },
          update: {
            name,
            nis: row["NIS"]?.toString() || row["nis"]?.toString(),
            gender: row["Jenis Kelamin"] || row["gender"] || "Laki-laki",
            pob: row["Tempat Lahir"] || row["pob"],
            dob: row["Tanggal Lahir"] ? new Date(row["Tanggal Lahir"]) : null,
            address: row["Alamat"] || row["address"],
            waNumber: row["No WhatsApp"]?.toString() || row["waNumber"]?.toString(),
            kelasId
          },
          create: {
            name,
            nisn: row["NISN"]?.toString() || row["nisn"]?.toString(),
            nis: row["NIS"]?.toString() || row["nis"]?.toString(),
            gender: row["Jenis Kelamin"] || row["gender"] || "Laki-laki",
            pob: row["Tempat Lahir"] || row["pob"],
            dob: row["Tanggal Lahir"] ? new Date(row["Tanggal Lahir"]) : null,
            address: row["Alamat"] || row["address"],
            waNumber: row["No WhatsApp"]?.toString() || row["waNumber"]?.toString(),
            kelasId
          }
        });
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Gagal mengimpor '${name}': ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal impor data" }, { status: 500 });
  }
}
