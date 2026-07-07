"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SuratTemplate } from "@/components/SuratTemplate";
import { ArrowLeft, FileDown, Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import { generateAndOpenPDF } from "@/lib/generatePDF";
import { toast } from "sonner";

function PreviewSuratContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jenis = searchParams.get("jenis") || "Surat Keterangan";
  const nama = searchParams.get("nama") || "Budi Santoso";
  const [loading, setLoading] = useState(false);

  const handleBukaPDF = async () => {
    setLoading(true);
    try {
      toast.loading("Membuat file PDF...", { id: "pdf-gen" });
      await generateAndOpenPDF(`${jenis.replace(/\s+/g, "_")}_WargaLink.pdf`);
      toast.success("PDF berhasil dibuat! Cek tab baru.", { id: "pdf-gen" });
    } catch {
      toast.error("Gagal membuat PDF. Coba lagi.", { id: "pdf-gen" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm flex items-center justify-between px-4 py-3 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex-1 text-center hidden sm:block">
          <p className="text-sm font-bold text-slate-700 truncate">{jenis.toUpperCase()}</p>
          <p className="text-xs text-slate-500">No. 145/RT01/VI/2026</p>
        </div>

        <button
          onClick={handleBukaPDF}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
          ) : (
            <><FileDown className="w-4 h-4" /> Buka / Unduh PDF</>
          )}
        </button>
      </div>

      {/* Surat — rendered at actual A4 width, scrollable */}
      <div className="flex justify-center py-8 px-2 sm:px-8">
        <div className="shadow-2xl rounded-sm overflow-hidden">
          <SuratTemplate
            jenisSurat={jenis.toUpperCase()}
            nama={nama}
            nik="3174001234567890"
            tempatTanggalLahir="Jakarta, 17 Agustus 1980"
            alamat="Jl. Warga Mufakat No. 45, RT 01 / RW 05, Kel. Simulasi"
            keperluan="Persyaratan Administratif"
            tanggalSurat="15 Juni 2026"
            nomorSurat="145/RT01/VI/2026"
          />
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 pb-6">
        Klik <strong>Buka / Unduh PDF</strong> untuk mendapatkan file PDF yang bisa disimpan atau dibagikan.
      </p>
    </div>
  );
}

export default function PreviewSuratPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Memuat surat...</p>
        </div>
      </div>
    }>
      <PreviewSuratContent />
    </Suspense>
  );
}
