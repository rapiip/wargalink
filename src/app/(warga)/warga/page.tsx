"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Bell, Clock, FileText, ArrowRight, MessageSquare, Check, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-container";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function WargaHome() {
  const router = useRouter();
  const { nominalIuran, iuranAktif, tagihanList, suratList, currentUser, pengumumanList } = useApp();

  const pemohonNama = currentUser ? currentUser.desc.split(",")[0].trim() : "Budi Santoso";
  const myTagihan = tagihanList.find((t) => t.kk === pemohonNama && t.tagihan === "Iuran Juni 2026") || {
    id: 0,
    kk: pemohonNama,
    tagihan: "Iuran Juni 2026",
    nominal: nominalIuran,
    status: "Belum",
  };

  const mySurat = suratList.filter((s) => s.pemohon === pemohonNama);
  const latestSurat = mySurat[0] || null;
  const latestPengumuman = pengumumanList.slice(0, 2);

  const handleBayar = () => {
    router.push("/warga/iuran");
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent pb-8">
      {/* Premium Greeting Banner */}
      <div className="bg-gradient-to-br from-blue-700 via-primary to-blue-900 text-white p-8 pb-16 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Halo, {pemohonNama}!</h2>
          <p className="text-primary-foreground/90 text-sm font-medium">RT 01 / RW 05, Blok A2 No 15</p>
          <p className="text-primary-foreground/70 text-xs mt-1">Selamat datang di WargaLink</p>
        </div>
      </div>


      <StaggerContainer className="px-5 -mt-8 space-y-6">
        {/* Quick Action Card (Iuran) */}
        <StaggerItem>
          <Card className="border border-white/40 shadow-xl shadow-blue-900/5 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`${!iuranAktif ? "bg-sky-100 text-sky-600" : myTagihan.status === "Lunas" ? "bg-emerald-100 text-emerald-600" : myTagihan.status === "Menunggu Verifikasi" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"} p-3 rounded-2xl shadow-inner`}>
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Tagihan Bulan Ini</p>
                  <p className="text-xl font-extrabold text-slate-800">
                    {iuranAktif ? `Rp ${myTagihan.nominal.toLocaleString("id-ID")}` : "Bebas / Ditiadakan"}
                  </p>
                </div>
              </div>
              {iuranAktif ? (
                <>
                  {myTagihan.status === "Belum" && (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 rounded-xl transition-transform active:scale-95 font-bold"
                      onClick={handleBayar}
                    >
                      Bayar
                    </Button>
                  )}
                  {myTagihan.status === "Menunggu Verifikasi" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-amber-700 rounded-xl cursor-not-allowed font-bold"
                      disabled
                    >
                      Pending
                    </Button>
                  )}
                  {myTagihan.status === "Lunas" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-emerald-700 rounded-xl cursor-not-allowed font-bold"
                      disabled
                    >
                      <span className="flex items-center">Lunas <Check className="w-4 h-4 ml-1" /></span>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-sky-200 bg-sky-50 text-sky-700 rounded-xl font-bold"
                  onClick={handleBayar}
                >
                  Detail
                </Button>
              )}
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <div className="flex items-center justify-between pt-2 pb-2">
            <h3 className="font-bold text-slate-800 tracking-tight">Layanan Warga</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/warga/surat" className="group bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:bg-white transition-all duration-300 text-center">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">Pengajuan Surat</span>
            </Link>
            <Link href="/warga/aduan" className="group bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:bg-white transition-all duration-300 text-center">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">Aduan Warga</span>
            </Link>
            <Link href="/warga/pengumuman" className="group bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-white/60 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-xl hover:bg-white transition-all duration-300 text-center">
              <div className="bg-amber-50 p-2.5 rounded-xl text-amber-600 group-hover:scale-110 transition-transform duration-300">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">Info & Agenda</span>
            </Link>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="flex items-center justify-between pt-2 pb-2">
            <h3 className="font-bold text-slate-800 tracking-tight">Aktivitas Terakhir</h3>
            <Link href="/warga/surat" className="text-xs text-primary font-bold flex items-center hover:underline">
              Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          {latestSurat ? (
            <Card className="border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl bg-white/90 backdrop-blur-sm hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer" onClick={() => router.push("/warga/surat")}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-2.5 rounded-xl mt-0.5 ${latestSurat.status === "Disetujui" || latestSurat.status === "Selesai" ? "bg-emerald-100 text-emerald-600" : latestSurat.status === "Ditolak" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">{latestSurat.jenis}</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {latestSurat.status === "Menunggu" || latestSurat.status === "Diproses RT"
                      ? "Sedang diproses oleh Ketua RT"
                      : latestSurat.status === "Disetujui" || latestSurat.status === "Selesai"
                      ? "Telah disetujui, siap diunduh"
                      : "Pengajuan ditolak"}
                  </p>
                  <div className="mt-3 bg-slate-100 rounded-full h-2 w-full overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full relative transition-all duration-500 ${
                      latestSurat.status === "Menunggu" || latestSurat.status === "Diproses RT"
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 w-1/2"
                        : latestSurat.status === "Disetujui" || latestSurat.status === "Selesai"
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-500 w-full"
                        : "bg-gradient-to-r from-red-400 to-red-500 w-full"
                    }`}>
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-slate-400 border border-dashed rounded-2xl p-6 text-center bg-white/60">Belum ada aktivitas surat-menyurat.</p>
          )}
        </StaggerItem>

        <StaggerItem>
          <div className="flex items-center justify-between pt-2 pb-2">
            <h3 className="font-bold text-slate-800 tracking-tight">Info Terbaru RT</h3>
            <Link href="/warga/pengumuman" className="text-xs text-primary font-bold flex items-center hover:underline">
              Lihat Semua <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {latestPengumuman.map((p) => {
              const tipeColor = p.tipe === "Penting"
                ? "bg-red-50 text-red-600 border-red-100"
                : p.tipe === "Agenda"
                ? "bg-blue-50 text-blue-600 border-blue-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100";
              return (
                <Link
                  key={p.id}
                  href="/warga/pengumuman"
                  className="block bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${tipeColor} shrink-0`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${tipeColor} border`}>
                          {p.tipe}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{p.tanggal}</span>
                      </div>
                      <p className="font-bold text-slate-800 text-sm mt-1.5 leading-tight">{p.judul}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{p.isi}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {latestPengumuman.length === 0 && (
              <p className="text-sm text-slate-400 border border-dashed rounded-2xl p-6 text-center bg-white/60">Belum ada pengumuman dari RT.</p>
            )}
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

