"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const GENDER_COLORS = ['#3b82f6', '#ec4899'];
const WORK_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function PemdaKependudukan() {
  const { daftarWarga } = useApp();
  const [search, setSearch] = useState("");
  
  // Drill-down States
  const [viewLevel, setViewLevel] = useState<"kecamatan" | "kelurahan" | "rt">("kecamatan");
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(null);
  const [selectedKelurahan, setSelectedKelurahan] = useState<string | null>(null);

  const rt01Count = daftarWarga.filter(w => w.rt === "01").length;
  const rt02Count = daftarWarga.filter(w => w.rt === "02").length;
  
  const dynamicGambirPopulation = 111996 + rt01Count + rt02Count;

  // Mock data Kecamatan
  const dataKecamatan = [
    { id: 1, nama: "Kec. Gambir", kelurahan: 6, rt: 348 + (rt01Count > 0 ? 1 : 0) + (rt02Count > 0 ? 1 : 0), penduduk: dynamicGambirPopulation },
    { id: 2, nama: "Kec. Menteng", kelurahan: 5, rt: 280, penduduk: 98000 },
    { id: 3, nama: "Kec. Senen", kelurahan: 6, rt: 310, penduduk: 105000 },
  ];

  // Mock data Kelurahan under each Kecamatan
  const dataKelurahan: Record<string, { id: number; nama: string; rt: number; penduduk: number }[]> = {
    "Kec. Gambir": [
      { id: 1, nama: "Kel. Gambir", rt: 80, penduduk: 22000 },
      { id: 2, nama: "Kel. Kebon Kelapa", rt: 90, penduduk: 28000 },
      { id: 3, nama: "Kel. Simulasi", rt: 78 + (rt01Count > 0 ? 1 : 0) + (rt02Count > 0 ? 1 : 0), penduduk: 25000 + rt01Count + rt02Count },
      { id: 4, nama: "Kel. Cideng", rt: 100, penduduk: 36996 },
    ],
    "Kec. Menteng": [
      { id: 5, nama: "Kel. Menteng", rt: 90, penduduk: 32000 },
      { id: 6, nama: "Kel. Pegangsaan", rt: 85, penduduk: 28000 },
      { id: 7, nama: "Kel. Cikini", rt: 105, penduduk: 38000 },
    ],
    "Kec. Senen": [
      { id: 8, nama: "Kel. Senen", rt: 110, penduduk: 42000 },
      { id: 9, nama: "Kel. Kwitang", rt: 95, penduduk: 31000 },
      { id: 10, nama: "Kel. Kenari", rt: 105, penduduk: 32000 },
    ]
  };

  // Mock data RT under specific Kelurahan
  const dataRT: Record<string, { id: number; nama: string; RW: string; penduduk: number; status: string }[]> = {
    "Kel. Simulasi": [
      { id: 1, nama: "RT 01", RW: "RW 05", penduduk: 139 + rt01Count, status: "Aktif" },
      { id: 2, nama: "RT 02", RW: "RW 05", penduduk: 88 + rt02Count, status: "Aktif" },
      { id: 3, nama: "RT 03", RW: "RW 05", penduduk: 45, status: "Aktif" },
      { id: 4, nama: "RT 04", RW: "RW 05", penduduk: 62, status: "Pasif" },
    ],
    "Kel. Gambir": [
      { id: 5, nama: "RT 01", RW: "RW 01", penduduk: 95, status: "Aktif" },
      { id: 6, nama: "RT 02", RW: "RW 01", penduduk: 112, status: "Aktif" },
    ]
  };

  // Filter lists based on search
  const getFilteredData = () => {
    if (viewLevel === "kecamatan") {
      return dataKecamatan.filter((k) => k.nama.toLowerCase().includes(search.toLowerCase()));
    } else if (viewLevel === "kelurahan" && selectedKecamatan) {
      const list = dataKelurahan[selectedKecamatan] || [];
      return list.filter((kel) => kel.nama.toLowerCase().includes(search.toLowerCase()));
    } else if (viewLevel === "rt" && selectedKelurahan) {
      const list = dataRT[selectedKelurahan] || [];
      return list.filter((rt) => rt.nama.toLowerCase().includes(search.toLowerCase()) || rt.RW.toLowerCase().includes(search.toLowerCase()));
    }
    return [];
  };

  const currentList = getFilteredData();

  // Demographic Chart Data
  const maleCount = daftarWarga.filter(w => w.nama.includes("Budi") || w.nama.includes("Ahmad")).length;
  const femaleCount = daftarWarga.filter(w => w.nama.includes("Siti") || w.nama.includes("Dewi")).length;

  const dataGender = [
    { name: 'Laki-laki', value: 617000 + maleCount },
    { name: 'Perempuan', value: 617567 + femaleCount },
  ];

  const dataUsia = [
    { name: "0-14 Tahun (Anak)", jumlah: 245000 + (daftarWarga.length * 0.1) },
    { name: "15-64 (Produktif)", jumlah: 840000 + (daftarWarga.length * 0.8) },
    { name: "65+ Tahun (Lansia)", jumlah: 149567 + (daftarWarga.length * 0.1) },
  ];

  const dataPekerjaan = [
    { name: "Swasta", value: 512000 + (daftarWarga.length * 0.5) },
    { name: "PNS / TNI / POLRI", value: 124000 },
    { name: "Wirausaha", value: 245000 + (daftarWarga.length * 0.3) },
    { name: "Pelajar / Mhs", value: 210000 + (daftarWarga.length * 0.2) },
    { name: "Belum Bekerja", value: 143567 },
  ];

  // Drilldown navigations
  const handleKecamatanClick = (nama: string) => {
    setSelectedKecamatan(nama);
    setViewLevel("kelurahan");
    setSearch("");
  };

  const handleKelurahanClick = (nama: string) => {
    setSelectedKelurahan(nama);
    setViewLevel("rt");
    setSearch("");
  };

  const handleBack = () => {
    if (viewLevel === "rt") {
      setViewLevel("kelurahan");
      setSelectedKelurahan(null);
    } else if (viewLevel === "kelurahan") {
      setViewLevel("kecamatan");
      setSelectedKecamatan(null);
    }
    setSearch("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Data Kependudukan</h2>
          <p className="text-slate-500">Agregat demografi wilayah dengan navigasi drill-down.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader className="border-b pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {viewLevel !== "kecamatan" && (
                    <button 
                      onClick={handleBack}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors mr-1"
                      title="Kembali"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  {viewLevel === "kecamatan" && "Daftar Kecamatan"}
                  {viewLevel === "kelurahan" && `Kelurahan di ${selectedKecamatan}`}
                  {viewLevel === "rt" && `Rukun Tetangga (RT) di ${selectedKelurahan}`}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                  <span>Sistem Wilayah</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className={viewLevel === "kecamatan" ? "font-bold text-blue-600" : ""}>Kota</span>
                  {selectedKecamatan && (
                    <>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span className={viewLevel === "kelurahan" ? "font-bold text-blue-600" : ""}>{selectedKecamatan}</span>
                    </>
                  )}
                  {selectedKelurahan && (
                    <>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span className={viewLevel === "rt" ? "font-bold text-blue-600" : ""}>{selectedKelurahan}</span>
                    </>
                  )}
                </CardDescription>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder={`Cari ${viewLevel === "rt" ? "RT/RW" : viewLevel === "kelurahan" ? "kelurahan" : "kecamatan"}...`}
                  className="pl-9 text-xs" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {viewLevel === "kecamatan" && (
                    <>
                      <TableHead>Nama Kecamatan</TableHead>
                      <TableHead className="text-right">Jumlah Kelurahan</TableHead>
                      <TableHead className="text-right">Jumlah RT Terdaftar</TableHead>
                      <TableHead className="text-right">Total Penduduk</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </>
                  )}
                  {viewLevel === "kelurahan" && (
                    <>
                      <TableHead>Nama Kelurahan</TableHead>
                      <TableHead className="text-right">Jumlah RT</TableHead>
                      <TableHead className="text-right">Total Penduduk</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </>
                  )}
                  {viewLevel === "rt" && (
                    <>
                      <TableHead>Nama RT</TableHead>
                      <TableHead>Nama RW</TableHead>
                      <TableHead>Status Keaktifan</TableHead>
                      <TableHead className="text-right">Total Warga</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-400 py-8 text-xs font-semibold">
                      Tidak ada data wilayah yang ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentList.map((item: any) => (
                    <TableRow 
                      key={item.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${viewLevel !== "rt" ? "cursor-pointer" : ""}`}
                      onClick={() => {
                        if (viewLevel === "kecamatan") handleKecamatanClick(item.nama);
                        else if (viewLevel === "kelurahan") handleKelurahanClick(item.nama);
                      }}
                    >
                      {viewLevel === "kecamatan" && (
                        <>
                          <TableCell className="font-bold text-slate-800">{item.nama}</TableCell>
                          <TableCell className="text-right text-slate-500">{item.kelurahan}</TableCell>
                          <TableCell className="text-right text-slate-500">{item.rt}</TableCell>
                          <TableCell className="text-right font-semibold">{item.penduduk.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right">
                            <span className="text-xs text-blue-600 font-bold hover:underline">Buka Kelurahan →</span>
                          </TableCell>
                        </>
                      )}
                      {viewLevel === "kelurahan" && (
                        <>
                          <TableCell className="font-bold text-slate-800">{item.nama}</TableCell>
                          <TableCell className="text-right text-slate-500">{item.rt}</TableCell>
                          <TableCell className="text-right font-semibold">{item.penduduk.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right">
                            {dataRT[item.nama] ? (
                              <span className="text-xs text-blue-600 font-bold hover:underline">Buka RT →</span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">RT Belum Terintegrasi</span>
                            )}
                          </TableCell>
                        </>
                      )}
                      {viewLevel === "rt" && (
                        <>
                          <TableCell className="font-bold text-slate-800 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400" />
                            {item.nama}
                          </TableCell>
                          <TableCell className="text-slate-500 font-semibold">{item.RW}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={item.status === "Aktif" ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-slate-100 text-slate-500 border-slate-200 text-[10px]"}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-extrabold text-slate-800">{item.penduduk.toLocaleString('id-ID')}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Gender Demographics */}
        <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/95">
          <CardHeader className="pb-1">
            <CardTitle className="text-base font-bold text-slate-800">Demografi Gender</CardTitle>
            <CardDescription className="text-xs">Rasio keseluruhan kota</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataGender}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {dataGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('id-ID')} Jiwa`} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Demographics */}
        <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/95">
          <CardHeader className="pb-1">
            <CardTitle className="text-base font-bold text-slate-800">Kelompok Usia</CardTitle>
            <CardDescription className="text-xs">Sebaran umur warga kota</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataUsia} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('id-ID')} Jiwa`} />
                <Bar dataKey="jumlah" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupation Demographics */}
        <Card className="border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/95">
          <CardHeader className="pb-1">
            <CardTitle className="text-base font-bold text-slate-800">Jenis Pekerjaan</CardTitle>
            <CardDescription className="text-xs">Profil mata pencaharian warga kota</CardDescription>
          </CardHeader>
          <CardContent className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPekerjaan}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dataPekerjaan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={WORK_COLORS[index % WORK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${Number(value).toLocaleString('id-ID')} Jiwa`} />
                <Legend iconType="circle" layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: '9px', lineHeight: '14px'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
