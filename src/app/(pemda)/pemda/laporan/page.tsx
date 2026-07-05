"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, Loader2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function PemdaLaporan() {
  const [tipeLaporan, setTipeLaporan] = useState("demografi");
  const [wilayah, setWilayah] = useState("semua");
  const [periode, setPeriode] = useState("ytd");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [cetakLoading, setCetakLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const tipeLabel: Record<string, string> = { demografi: "Demografi Penduduk", aktivitas: "Aktivitas Surat Menyurat" };
  const wilayahLabel: Record<string, string> = { semua: "Seluruh Kota", kec1: "Kec. Gambir", kec2: "Kec. Menteng" };
  const periodeLabel: Record<string, string> = { ytd: "Tahun ini (YTD)", q2: "Kuartal 2 - 2026", q1: "Kuartal 1 - 2026" };

  // Mock data for preview charts & tables
  const dataDemografi = [
    { name: "Kec. Gambir", penduduk: 112002 },
    { name: "Kec. Menteng", penduduk: 98000 },
    { name: "Kec. Senen", penduduk: 105000 },
  ];

  const dataAktivitas = [
    { name: "KTP", jumlah: 1240 },
    { name: "Domisili", jumlah: 950 },
    { name: "SKCK", jumlah: 480 },
    { name: "SKU", jumlah: 380 },
  ];

  const dataIuran = [
    { name: "Kec. Gambir", rate: 92 },
    { name: "Kec. Menteng", rate: 88 },
    { name: "Kec. Senen", rate: 85 },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    toast.promise(
      new Promise((res) => setTimeout(res, 2000)),
      {
        loading: `Memproses laporan ${tipeLabel[tipeLaporan]}...`,
        success: () => {
          setGenerated(true);
          setGenerating(false);
          return "Laporan berhasil digenerate! Silakan cetak atau ekspor.";
        },
        error: () => {
          setGenerating(false);
          return "Gagal membuat laporan.";
        },
      }
    );
  };

  const handleCetak = () => {
    if (!generated) { toast.warning("Generate laporan terlebih dahulu."); return; }
    setCetakLoading(true);
    toast.promise(
      new Promise((res) => setTimeout(res, 1500)),
      { loading: "Menyiapkan halaman cetak...", success: "Siap dicetak!", error: "Gagal." }
    );
    setTimeout(() => { setCetakLoading(false); window.print(); }, 1500);
  };

  const handleExport = () => {
    if (!generated) { toast.warning("Generate laporan terlebih dahulu."); return; }
    setExportLoading(true);
    toast.promise(
      new Promise((res) => setTimeout(res, 2000)),
      { loading: "Mengekspor ke Excel...", success: "Berhasil diekspor ke Excel / CSV!", error: "Gagal ekspor." }
    );
    setTimeout(() => setExportLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Report Builder</h2>
        <p className="text-slate-500">Buat laporan kustom untuk wilayah tertentu.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kriteria Laporan</CardTitle>
          <CardDescription>Pilih parameter untuk menghasilkan laporan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipe Laporan</Label>
              <Select value={tipeLaporan} onValueChange={(v) => v && setTipeLaporan(v)}>
                <SelectTrigger><SelectValue placeholder="Pilih tipe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="demografi">Demografi Penduduk</SelectItem>
                  <SelectItem value="aktivitas">Aktivitas Surat Menyurat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cakupan Wilayah</Label>
              <Select value={wilayah} onValueChange={(v) => v && setWilayah(v)}>
                <SelectTrigger><SelectValue placeholder="Pilih wilayah" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Seluruh Kota</SelectItem>
                  <SelectItem value="kec1">Kec. Gambir</SelectItem>
                  <SelectItem value="kec2">Kec. Menteng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Periode</Label>
              <Select value={periode} onValueChange={(v) => v && setPeriode(v)}>
                <SelectTrigger><SelectValue placeholder="Pilih periode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ytd">Tahun ini (YTD)</SelectItem>
                  <SelectItem value="q2">Kuartal 2 - 2026</SelectItem>
                  <SelectItem value="q1">Kuartal 1 - 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 flex-wrap border-t pt-4">
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="flex gap-2 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow shadow-blue-500/20"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            {generating ? "Memproses..." : "Generate Laporan"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2 rounded-xl" onClick={handleCetak} disabled={cetakLoading || !generated}>
              {cetakLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              Cetak
            </Button>
            <Button className="flex gap-2 bg-slate-800 hover:bg-slate-700 rounded-xl" onClick={handleExport} disabled={exportLoading || !generated}>
              {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Export CSV / Excel
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className={`min-h-[400px] flex items-center justify-center border-dashed transition-all ${generated ? "bg-white border-blue-200" : "bg-slate-50"}`}>
        {generating ? (
          <div className="w-full p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="border-b pb-4 flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-6 bg-slate-350 rounded w-48 bg-slate-200"></div>
                <div className="h-4 bg-slate-300 rounded w-64 bg-slate-200"></div>
              </div>
              <div className="h-5 bg-slate-300 rounded w-20 bg-slate-200"></div>
            </div>
            
            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-100/50 rounded-2xl p-4 text-center border space-y-2">
                  <div className="h-3 bg-slate-300 rounded w-16 mx-auto bg-slate-200"></div>
                  <div className="h-5 bg-slate-350 rounded w-24 mx-auto bg-slate-200"></div>
                </div>
              ))}
            </div>

            {/* Visualisations Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <div className="h-10 bg-slate-50 border-b px-4 py-2 flex items-center">
                  <div className="h-4 bg-slate-300 rounded w-28 bg-slate-200"></div>
                </div>
                <div className="p-4 h-[220px] flex flex-col justify-end gap-2 bg-slate-50/20">
                  <div className="flex items-end justify-between h-[150px] w-full px-4 border-b pb-1">
                    <div className="w-8 bg-slate-200 rounded-t h-[40px]"></div>
                    <div className="w-8 bg-slate-200 rounded-t h-[80px]"></div>
                    <div className="w-8 bg-slate-200 rounded-t h-[120px]"></div>
                    <div className="w-8 bg-slate-200 rounded-t h-[60px]"></div>
                  </div>
                  <div className="flex justify-between w-full px-2">
                    <div className="h-3 bg-slate-200 rounded w-10"></div>
                    <div className="h-3 bg-slate-200 rounded w-10"></div>
                    <div className="h-3 bg-slate-200 rounded w-10"></div>
                    <div className="h-3 bg-slate-200 rounded w-10"></div>
                  </div>
                </div>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                <div className="h-10 bg-slate-50 border-b px-4 py-2 flex items-center">
                  <div className="h-4 bg-slate-300 rounded w-28 bg-slate-200"></div>
                </div>
                <div className="p-4 space-y-3 bg-slate-50/20">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex justify-between items-center border-b pb-2">
                      <div className="h-4 bg-slate-205 rounded w-32 bg-slate-200"></div>
                      <div className="h-4 bg-slate-300 rounded w-16 bg-slate-200"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : generated ? (
          <div className="w-full p-6 space-y-6">
            <div className="border-b pb-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Laporan {tipeLabel[tipeLaporan]}</h3>
                <p className="text-xs font-semibold text-slate-400 mt-1">{wilayahLabel[wilayah]} — {periodeLabel[periode]}</p>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold uppercase text-[9px] tracking-wider">
                Berhasil Dibuat
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Sampel", val: tipeLaporan === "demografi" ? "315.002 Jiwa" : "3.050 Dokumen" },
                { label: "Tingkat Validitas", val: "99.8%" },
                { label: "Format File", val: "PDF / Excel" },
                { label: "Keamanan", val: "CONFIDENTIAL" },
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 rounded-2xl p-4 text-center border">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{item.val}</p>
                </div>
              ))}
            </div>
 
            {/* Real Chart & Table Preview Section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Chart Preview */}
              <Card className="border border-slate-100 shadow shadow-slate-200/50 rounded-2xl">
                <CardHeader className="pb-2 bg-slate-50/50 border-b">
                  <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-wider">Grafik Visualisasi</CardTitle>
                </CardHeader>
                <CardContent className="h-[220px] pt-4">
                  {tipeLaporan === "demografi" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataDemografi}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('id-ID')} Jiwa`} />
                        <Bar dataKey="penduduk" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                  {tipeLaporan === "aktivitas" && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataAktivitas}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('id-ID')} Dokumen`} />
                        <Bar dataKey="jumlah" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
 
                </CardContent>
              </Card>
 
              {/* Table Preview */}
              <Card className="border border-slate-100 shadow shadow-slate-200/50 rounded-2xl overflow-hidden">
                <CardHeader className="pb-2 bg-slate-50/50 border-b">
                  <CardTitle className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rincian Data Wilayah</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-50/20">
                      <TableRow>
                        <TableHead className="font-bold text-slate-600">Wilayah / Kriteria</TableHead>
                        <TableHead className="text-right font-bold text-slate-600">
                          {tipeLaporan === "demografi" ? "Penduduk (Jiwa)" : "Frekuensi (Dokumen)"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tipeLaporan === "demografi" && dataDemografi.map((item) => (
                        <TableRow key={item.name} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-800">{item.name}</TableCell>
                          <TableCell className="text-right font-bold text-slate-700">{item.penduduk.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))}
                      {tipeLaporan === "aktivitas" && dataAktivitas.map((item) => (
                        <TableRow key={item.name} className="hover:bg-slate-50/50">
                          <TableCell className="font-bold text-slate-800">Surat Pengantar {item.name}</TableCell>
                          <TableCell className="text-right font-bold text-slate-700">{item.jumlah.toLocaleString('id-ID')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
             
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Dokumen Terenkripsi WargaLink · Konfidensial Pemerintah Kota
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Preview Laporan</p>
            <p className="text-xs text-slate-400 mt-1">Pilih kriteria lalu klik "Generate Laporan"</p>
          </div>
        )}
      </Card>
    </div>
  );
}
