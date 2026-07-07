"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, TrendingUp, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-container";
import { toast } from "sonner";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function AdminDashboard() {
  const { daftarWarga, transaksiBulanan, suratList, tagihanList } = useApp();

  const handleDownload = () => {
    toast.promise(
      new Promise((res) => setTimeout(res, 2000)),
      {
        loading: "Membuat laporan PDF...",
        success: "Laporan berhasil diunduh!",
        error: "Gagal membuat laporan.",
      }
    );
  };

  // Dynamic calculations
  const totalWargaCount = 138 + daftarWarga.length; // Realistic mapping from dummy data

  const juniPemasukan = transaksiBulanan.find((t) => t.name === "Jun")?.pemasukan || 0;

  const pendingSuratCount = suratList.filter(
    (s) => s.status === "Menunggu" || s.status === "Diproses RT"
  ).length;

  const pendingPaymentsCount = tagihanList.filter(
    (t) => t.status === "Menunggu Verifikasi"
  ).length;

  const stats = [
    { title: "Total Warga", value: totalWargaCount.toString(), trend: "+4 bulan ini", icon: Users, href: "/admin/warga" },
    { title: "Kas Bulan Ini", value: `Rp ${juniPemasukan.toLocaleString("id-ID")}`, trend: "Kas Juni 2026", icon: Wallet, href: "/admin/keuangan" },
    { title: "Surat Pending", value: pendingSuratCount.toString(), trend: "Butuh approval", icon: FileText, href: "/admin/surat" },
    { title: "Laporan Aktif", value: pendingPaymentsCount.toString(), trend: "Verifikasi Iuran", icon: AlertCircle, href: "/admin/keuangan" },
  ];

  const suratTerbaru = suratList.slice(0, 3);

  // Dynamic activity stream
  const aktivitas = [
    ...suratList.slice(0, 2).map((s) => ({
      time: "Baru saja",
      desc: `${s.pemohon} mengajukan ${s.jenis} (Status: ${s.status === "Menunggu" ? "Diproses RT" : s.status})`,
    })),
    ...tagihanList
      .filter((t) => t.status === "Menunggu Verifikasi")
      .slice(0, 1)
      .map((t) => ({
        time: "Baru saja",
        desc: `${t.kk} melakukan konfirmasi bayar iuran`,
      })),
    { time: "Kemarin", desc: "Ketua RT memperbarui pengumuman lingkungan" },
  ];

  return (
    <StaggerContainer className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Ringkasan Lingkungan</h2>
          <p className="text-slate-500 font-medium">Pantau aktivitas warga dan keuangan secara real-time.</p>
        </div>
        <Button
          className="bg-primary hover:bg-blue-700 shadow-lg shadow-blue-600/20 rounded-xl px-6 py-2 transition-all active:scale-95"
          onClick={handleDownload}
        >
          Download Laporan PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StaggerItem key={stat.title}>
              <Link href={stat.href}>
                <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 bg-slate-50/50">
                    <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-xl ${stat.title.includes('Surat') ? 'bg-amber-100 text-amber-600' : stat.title.includes('Kas') ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-extrabold text-slate-800">{stat.value}</div>
                    <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StaggerItem>
          <Card className="h-full border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
            <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl flex flex-row items-center justify-between">
              <CardTitle className="font-bold text-slate-800">Pengajuan Surat Terbaru</CardTitle>
              <Link href="/admin/surat" className="text-xs text-primary font-bold hover:underline">Lihat Semua →</Link>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {suratTerbaru.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">Tidak ada pengajuan surat.</p>
                ) : (
                  suratTerbaru.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{s.jenis}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.pemohon} - RT 01</p>
                      </div>
                      <Link href="/admin/surat">
                        <Button variant="outline" size="sm" className="rounded-lg shadow-sm border-slate-200 hover:bg-slate-50 hover:text-primary transition-all">
                          Review
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="h-full border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
            <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
              <CardTitle className="font-bold text-slate-800">Aktivitas Terkini</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {aktivitas.map((act, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 text-sm">{act.desc}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </div>
    </StaggerContainer>
  );
}

