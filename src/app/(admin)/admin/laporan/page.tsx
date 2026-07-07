"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download, FileText, Loader2, TrendingUp, TrendingDown,
  Users, Wallet, CheckCircle, XCircle, BarChart3, Calendar,
  FileDown, Eye
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StaggerContainer, StaggerItem } from "@/components/ui/animated-container";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import { useApp } from "@/context/AppContext";

const MONTH_OPTIONS = [
  { label: "Juni 2026", value: "Jun" },
  { label: "Mei 2026", value: "Mei" },
  { label: "April 2026", value: "Apr" },
];

// Static summary data per month
const MONTHLY_SUMMARY: Record<string, {
  pemasukan: number; pengeluaran: number;
  suratKeluar: number; wargaBaru: number;
  lunas: number; belum: number;
  pengumuman: number;
}> = {
  Jun: { pemasukan: 4500000, pengeluaran: 1200000, suratKeluar: 15, wargaBaru: 4, lunas: 2, belum: 2, pengumuman: 3 },
  Mei: { pemasukan: 4890000, pengeluaran: 2800000, suratKeluar: 20, wargaBaru: 2, lunas: 3, belum: 1, pengumuman: 2 },
  Apr: { pemasukan: 5100000, pengeluaran: 3200000, suratKeluar: 18, wargaBaru: 1, lunas: 4, belum: 0, pengumuman: 4 },
};

const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function AdminLaporan() {
  const { transaksiBulanan, suratList, tagihanList } = useApp();
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("Jun");
  const [activeTab, setActiveTab] = useState("ringkasan");

  const summary = MONTHLY_SUMMARY[selectedMonth];
  const saldo = summary.pemasukan - summary.pengeluaran;
  const selectedLabel = MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label || "";

  // Live data from context (Juni only)
  const liveLunas = tagihanList.filter(t => t.status === "Lunas").length;
  const liveBelum = tagihanList.filter(t => t.status === "Belum" || t.status === "Menunggu Verifikasi").length;
  const liveSuratDisetujui = suratList.filter(s => s.status === "Disetujui" || s.status === "Selesai").length;
  const liveSuratDitolak = suratList.filter(s => s.status === "Ditolak").length;
  const liveSuratPending = suratList.filter(s => s.status === "Menunggu" || s.status === "Diproses RT").length;

  const suratPieData = [
    { name: "Disetujui", value: liveSuratDisetujui || summary.suratKeluar - 3 },
    { name: "Ditolak", value: liveSuratDitolak || 2 },
    { name: "Pending", value: liveSuratPending || 1 },
  ];

  const iuranPieData = [
    { name: "Lunas", value: liveLunas || summary.lunas },
    { name: "Belum Bayar", value: liveBelum || summary.belum },
  ];

  const handleUnduh = (bulan: string, idx: number) => {
    setLoadingIdx(idx);
    toast.promise(
      new Promise((res) => setTimeout(res, 2000)),
      {
        loading: `Membuat laporan ${bulan}...`,
        success: `Laporan ${bulan} berhasil diunduh!`,
        error: "Gagal mengunduh laporan.",
      }
    );
    setTimeout(() => setLoadingIdx(null), 2000);
  };

  const handleGeneratePDF = () => {
    toast.promise(
      new Promise((res) => setTimeout(res, 2500)),
      {
        loading: "Memproses laporan bulanan...",
        success: "Laporan PDF berhasil dibuat!",
        error: "Gagal membuat laporan.",
      }
    );
  };

  return (
    <StaggerContainer className="space-y-6">
      {/* Header */}
      <StaggerItem>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Laporan Bulanan</h2>
            <p className="text-slate-500 text-sm mt-1">Ringkasan aktivitas, keuangan, dan kependudukan RT secara periodik.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Month Selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-10 px-3 py-2 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {MONTH_OPTIONS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <Button
              className="bg-primary hover:bg-blue-700 shadow-lg shadow-blue-600/20 rounded-xl gap-2"
              onClick={handleGeneratePDF}
            >
              <FileDown className="w-4 h-4" />
              Unduh PDF
            </Button>
          </div>
        </div>
      </StaggerItem>

      {/* KPI Summary Cards */}
      <StaggerItem>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Pemasukan",
              value: `Rp ${summary.pemasukan.toLocaleString("id-ID")}`,
              icon: TrendingUp, color: "emerald", bg: "bg-emerald-50", text: "text-emerald-700", icon_bg: "bg-emerald-100"
            },
            {
              label: "Total Pengeluaran",
              value: `Rp ${summary.pengeluaran.toLocaleString("id-ID")}`,
              icon: TrendingDown, color: "red", bg: "bg-red-50", text: "text-red-700", icon_bg: "bg-red-100"
            },
            {
              label: "Surat Diterbitkan",
              value: `${summary.suratKeluar} Dokumen`,
              icon: FileText, color: "blue", bg: "bg-blue-50", text: "text-blue-700", icon_bg: "bg-blue-100"
            },
            {
              label: "Warga Baru",
              value: `${summary.wargaBaru} Orang`,
              icon: Users, color: "violet", bg: "bg-violet-50", text: "text-violet-700", icon_bg: "bg-violet-100"
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className={`border-0 ${kpi.bg} shadow-sm`}>
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-xs font-semibold ${kpi.text} uppercase tracking-wider`}>{kpi.label}</p>
                      <p className="text-xl font-extrabold text-slate-800 mt-1 leading-tight">{kpi.value}</p>
                    </div>
                    <div className={`${kpi.icon_bg} p-2.5 rounded-xl`}>
                      <Icon className={`w-5 h-5 ${kpi.text}`} />
                    </div>
                  </div>
                  <p className={`text-xs ${kpi.text} mt-2 font-medium`}>{selectedLabel}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </StaggerItem>

      {/* Tabs */}
      <StaggerItem>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100/80 rounded-xl p-1">
            <TabsTrigger value="ringkasan" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-2" />Ringkasan
            </TabsTrigger>
            <TabsTrigger value="keuangan" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Wallet className="w-4 h-4 mr-2" />Keuangan
            </TabsTrigger>
            <TabsTrigger value="surat" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <FileText className="w-4 h-4 mr-2" />Surat & Iuran
            </TabsTrigger>
          </TabsList>

          {/* Tab: Ringkasan */}
          <TabsContent value="ringkasan" className="mt-6 space-y-6">
            {/* Arus Kas Chart */}
            <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Arus Kas 6 Bulan Terakhir
                </CardTitle>
                <CardDescription>Perbandingan pemasukan dan pengeluaran kas RT per bulan</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transaksiBulanan} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                    <Bar dataKey="pemasukan" name="Pemasukan" fill="#10b981" radius={[5, 5, 0, 0]} />
                    <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#ef4444" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tren Pemasukan Line Chart */}
            <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Tren Pemasukan Bulanan
                </CardTitle>
                <CardDescription>Perkembangan kas masuk selama 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transaksiBulanan}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
                      formatter={(value: any) => [`Rp ${Number(value).toLocaleString("id-ID")}`, "Pemasukan"]}
                    />
                    <Line
                      type="monotone" dataKey="pemasukan" stroke="#10b981"
                      strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }}
                      activeDot={{ r: 6, fill: "#059669" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Keuangan */}
          <TabsContent value="keuangan" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Saldo Summary */}
              <Card className={`border-0 ${saldo >= 0 ? "bg-emerald-50" : "bg-red-50"} rounded-2xl`}>
                <CardContent className="pt-6 pb-6 px-6">
                  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Saldo Bersih {selectedLabel}</p>
                  <p className={`text-4xl font-black ${saldo >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                    {saldo >= 0 ? "+" : "-"}Rp {Math.abs(saldo).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Pemasukan − Pengeluaran = Saldo bulan {selectedLabel}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Pemasukan</span>
                      <span className="font-bold text-emerald-700">+Rp {summary.pemasukan.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Pengeluaran</span>
                      <span className="font-bold text-red-700">−Rp {summary.pengeluaran.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="border-t border-slate-200/60 pt-2 flex justify-between text-sm font-bold">
                      <span className="text-slate-700">Selisih</span>
                      <span className={saldo >= 0 ? "text-emerald-700" : "text-red-700"}>
                        Rp {Math.abs(saldo).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Iuran Pie Chart */}
              <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-800">Status Iuran Warga</CardTitle>
                  <CardDescription className="text-xs">Komposisi warga yang telah/belum membayar iuran</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={iuranPieData} cx="50%" cy="50%"
                        innerRadius={50} outerRadius={80}
                        paddingAngle={4} dataKey="value"
                      >
                        {iuranPieData.map((_, idx) => (
                          <Cell key={idx} fill={idx === 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Rekap Keuangan Tabel */}
            <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
              <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
                <CardTitle className="font-bold text-slate-800">Rekap Keuangan {selectedLabel}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    { label: "Iuran Bulanan Terkumpul", value: `Rp ${(summary.lunas * 50000).toLocaleString("id-ID")}`, badge: "Lunas", badgeColor: "bg-emerald-100 text-emerald-800" },
                    { label: "Donasi & Pemasukan Lain", value: `Rp ${(summary.pemasukan - summary.lunas * 50000).toLocaleString("id-ID")}`, badge: "Non-Iuran", badgeColor: "bg-blue-100 text-blue-800" },
                    { label: "Pemeliharaan & Kebersihan", value: `Rp ${Math.round(summary.pengeluaran * 0.6).toLocaleString("id-ID")}`, badge: "Keluar", badgeColor: "bg-red-100 text-red-800" },
                    { label: "Kegiatan Sosial RT", value: `Rp ${Math.round(summary.pengeluaran * 0.4).toLocaleString("id-ID")}`, badge: "Keluar", badgeColor: "bg-amber-100 text-amber-800" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600 font-medium">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`${row.badgeColor} border-0 text-[10px] font-bold`}>{row.badge}</Badge>
                        <span className="text-sm font-bold text-slate-800">{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Surat & Iuran */}
          <TabsContent value="surat" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Surat Pie Chart */}
              <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-800">Status Pengajuan Surat</CardTitle>
                  <CardDescription className="text-xs">Distribusi pengajuan surat {selectedLabel}</CardDescription>
                </CardHeader>
                <CardContent className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={suratPieData} cx="50%" cy="50%"
                        innerRadius={55} outerRadius={85}
                        paddingAngle={4} dataKey="value"
                      >
                        {suratPieData.map((_, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                {[
                  { label: "Surat Disetujui", value: liveSuratDisetujui || summary.suratKeluar - 3, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Surat Ditolak", value: liveSuratDitolak || 2, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
                  { label: "Masih Diproses", value: liveSuratPending || 1, icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Warga Lunas Iuran", value: `${liveLunas || summary.lunas} KK`, icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className={`flex items-center gap-4 p-4 rounded-2xl ${stat.bg}`}>
                      <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
                        <p className="text-2xl font-extrabold text-slate-800">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </StaggerItem>

      {/* Archive Section */}
      <StaggerItem>
        <Card className="border border-white/60 bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/40 rounded-2xl">
          <CardHeader className="border-b bg-slate-50/50 rounded-t-2xl">
            <CardTitle className="font-bold text-slate-800">Arsip Laporan</CardTitle>
            <CardDescription>Unduh laporan bulanan yang sudah tersimpan dalam sistem</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              {MONTH_OPTIONS.map((m, idx) => {
                const s = MONTHLY_SUMMARY[m.value];
                return (
                  <div key={m.value} className="border border-slate-200 rounded-2xl p-4 hover:border-primary/40 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Laporan {m.label}</p>
                        <p className="text-xs text-slate-500">{idx === 0 ? "Bulan berjalan" : idx === 1 ? "Bulan lalu" : `${idx + 1} bulan lalu`}</p>
                      </div>
                    </div>
                    <ul className="text-xs space-y-1.5 text-slate-600 mb-4">
                      <li className="flex justify-between"><span className="text-slate-400">Pemasukan:</span> <span className="font-semibold text-slate-700">Rp {s.pemasukan.toLocaleString("id-ID")}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Pengeluaran:</span> <span className="font-semibold text-slate-700">Rp {s.pengeluaran.toLocaleString("id-ID")}</span></li>
                      <li className="flex justify-between"><span className="text-slate-400">Surat diterbitkan:</span> <span className="font-semibold text-slate-700">{s.suratKeluar} dok</span></li>
                    </ul>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5 text-xs rounded-xl hover:bg-slate-50 hover:text-primary border-slate-200"
                        onClick={() => toast.info(`Preview laporan ${m.label}`)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5 text-xs bg-primary hover:bg-blue-700 rounded-xl shadow-md shadow-primary/20"
                        onClick={() => handleUnduh(m.label, idx)}
                        disabled={loadingIdx === idx}
                      >
                        {loadingIdx === idx ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {loadingIdx === idx ? "..." : "Unduh"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
