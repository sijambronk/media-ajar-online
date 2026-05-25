"use client";

import { useState, useRef } from "react";
import { Eye, X, FileText, Printer, Download, BookOpen, Target, Layout, PenTool, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";

interface ViewRPPProps {
  materi: any;
  rpp: any;
  schoolProfile?: any;
  teacherProfile?: any;
}

export default function ViewRPP({ materi, rpp, schoolProfile, teacherProfile }: ViewRPPProps) {
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `RPP_${materi.title.replace(/\s+/g, '_')}`,
  });

  if (!rpp) return null;

  const content = JSON.parse(rpp.content);

  // Backward compatibility check for Tujuan
  const isOldFormat = typeof content.tujuan === 'string';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-300"
        title="Lihat RPP"
      >
        <Eye className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 text-left">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
          
          <div className="relative glass w-full max-w-4xl h-[85vh] rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Preview RPP Digital</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{materi.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePrint()}
                  className="flex items-center gap-2 p-2 px-3 rounded-xl hover:bg-secondary text-muted-foreground transition-all border border-transparent hover:border-border"
                  title="Cetak Dokumen"
                >
                  <Printer className="h-4 w-4" /> <span className="text-xs font-bold hidden md:inline">Cetak</span>
                </button>
                <button 
                  onClick={() => {
                    alert("Tips: Untuk menyimpan sebagai PDF, klik tombol Cetak lalu ubah opsi 'Destination' / 'Tujuan' menjadi 'Save as PDF'.");
                    handlePrint();
                  }}
                  className="flex items-center gap-2 p-2 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                  title="Ekspor ke PDF"
                >
                  <Download className="h-4 w-4" /> <span className="text-xs font-bold hidden md:inline">PDF</span>
                </button>
                <div className="w-px h-6 bg-border mx-1"></div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Area - Formal Document Style */}
            <div className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
               {/* A4 Paper Container */}
               <div ref={printRef} className="bg-white text-black font-serif mx-auto p-10 md:p-16 max-w-[210mm] min-h-[297mm] shadow-lg border border-border/50 space-y-6 text-[15px] leading-relaxed">
                  
                  {/* Kop Surat */}
                  <div className="border-b-4 border-double border-black pb-4 mb-8 flex items-center gap-6">
                    {schoolProfile?.logoUrl && (
                      <img src={schoolProfile.logoUrl} alt="Logo Sekolah" className="h-24 w-24 object-contain" />
                    )}
                    <div className="flex-1 text-center space-y-1">
                      <h2 className="text-xl font-bold uppercase tracking-widest">{schoolProfile?.name || "NAMA SEKOLAH"}</h2>
                      <p className="text-sm font-medium">NPSN: {schoolProfile?.npsn || "-"}</p>
                      <p className="text-sm">{schoolProfile?.address || "Alamat Sekolah"}</p>
                      <p className="text-sm">Email: {schoolProfile?.email || "-"} | Telp: {schoolProfile?.phone || "-"}</p>
                    </div>
                    {schoolProfile?.logoUrl && (
                      <div className="h-24 w-24 opacity-0 hidden md:block"></div> /* Spacer to center align text if logo exists */
                    )}
                  </div>

                  {/* Document Title */}
                  <div className="text-center mb-8">
                    <h1 className="text-lg font-bold uppercase tracking-wide">Rencana Pelaksanaan Pembelajaran</h1>
                  </div>

                  {/* 1. Identitas */}
                  <div className="space-y-2 mb-6">
                    <h2 className="font-bold">A. Identitas Modul</h2>
                    <div className="pl-4 whitespace-pre-wrap">
                      {content.identitas}
                    </div>
                  </div>

                  {/* 2. Identifikasi */}
                  {content.identifikasi && (
                    <div className="space-y-2 mb-6">
                      <h2 className="font-bold">B. Identifikasi</h2>
                      <div className="pl-4 whitespace-pre-wrap">
                        {content.identifikasi}
                      </div>
                    </div>
                  )}

                  {/* 3. Desain Pembelajaran */}
                  <div className="space-y-4 mb-6">
                    <h2 className="font-bold">{content.identifikasi ? 'C' : 'B'}. Desain Pembelajaran</h2>
                    
                    <div className="pl-4 space-y-4">
                      {isOldFormat ? (
                        <div>
                          <h3 className="font-semibold italic">1. Tujuan Pembelajaran</h3>
                          <div className="pl-4 whitespace-pre-wrap">{content.tujuan}</div>
                        </div>
                      ) : (
                        <>
                          {/* Tujuan Pembelajaran Array */}
                          {content.desainPembelajaran?.tujuan && content.desainPembelajaran.tujuan.length > 0 && (
                            <div>
                              <h3 className="font-semibold italic">1. Tujuan Pembelajaran</h3>
                              <ul className="pl-6 list-decimal space-y-1 mt-1">
                                {content.desainPembelajaran.tujuan.map((tp: string, idx: number) => (
                                  <li key={idx}>{tp}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Praktik Pedagogis */}
                          {content.desainPembelajaran?.praktikPedagogis && (
                            <div>
                              <h3 className="font-semibold italic">2. Praktik Pedagogis</h3>
                              <div className="pl-4 whitespace-pre-wrap mt-1">{content.desainPembelajaran.praktikPedagogis}</div>
                            </div>
                          )}

                          {/* Kemitraan Pembelajaran */}
                          {content.desainPembelajaran?.kemitraanPembelajaran && (
                            <div>
                              <h3 className="font-semibold italic">3. Kemitraan Pembelajaran</h3>
                              <div className="pl-4 whitespace-pre-wrap mt-1">{content.desainPembelajaran.kemitraanPembelajaran}</div>
                            </div>
                          )}

                          {/* Lingkungan Pembelajaran */}
                          {content.desainPembelajaran?.lingkunganPembelajaran && (
                            <div>
                              <h3 className="font-semibold italic">4. Lingkungan Pembelajaran</h3>
                              <div className="pl-4 whitespace-pre-wrap mt-1">{content.desainPembelajaran.lingkunganPembelajaran}</div>
                            </div>
                          )}

                          {/* Pemanfaatan Digital */}
                          {content.desainPembelajaran?.pemanfaatanDigital && (
                            <div>
                              <h3 className="font-semibold italic">5. Pemanfaatan Digital</h3>
                              <div className="pl-4 whitespace-pre-wrap mt-1">{content.desainPembelajaran.pemanfaatanDigital}</div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* 4. Kegiatan Pembelajaran */}
                  <div className="space-y-2 mb-6">
                    <h2 className="font-bold">{content.identifikasi ? 'D' : 'C'}. Kegiatan Pembelajaran</h2>
                    <div className="pl-4 whitespace-pre-wrap">
                      {content.kegiatan}
                    </div>
                  </div>

                  {/* 5. Penilaian */}
                  <div className="space-y-2 mb-6">
                    <h2 className="font-bold">{content.identifikasi ? 'E' : 'D'}. Penilaian</h2>
                    <div className="pl-4 whitespace-pre-wrap">
                      {content.penilaian}
                    </div>
                  </div>

                  {/* Signature Block */}
                  <div className="mt-16 pt-8 flex justify-between">
                    <div className="text-center">
                      <p>Mengetahui,</p>
                      <p>Kepala Sekolah</p>
                      <br /><br /><br /><br />
                      <p className="border-b border-black min-w-48 mx-auto inline-block pb-0.5 font-bold">
                        {schoolProfile?.principal || "......................."}
                      </p>
                      <p className="text-left pl-6 mt-1">NIP. .......................</p>
                    </div>
                    <div className="text-center">
                      <p>{content.kota || "................."}, {content.tanggal || "........................"}</p>
                      <p>Guru Mata Pelajaran</p>
                      <br /><br /><br /><br />
                      <p className="border-b border-black min-w-48 mx-auto inline-block pb-0.5 font-bold">
                        {teacherProfile?.teacherName || teacherProfile?.user?.name || "......................."}
                      </p>
                      <p className="text-left pl-6 mt-1">NIP. {teacherProfile?.nip || "......................."}</p>
                    </div>
                  </div>

               </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-muted/30 border-t border-border/50 flex justify-end print:hidden">
               <button 
                 onClick={() => setIsOpen(false)}
                 className="px-8 py-3 rounded-xl bg-secondary text-foreground font-bold text-sm border border-border"
               >
                 Tutup Preview
               </button>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
}
