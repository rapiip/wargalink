"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

export default function AdminPengumuman() {
  const { pengumumanList, tambahPengumuman, hapusPengumuman } = useApp();
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [tipe, setTipe] = useState("Info");

  const handleKirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !isi.trim()) return;

    tambahPengumuman(judul, isi, tipe);
    setJudul("");
    setIsi("");
    setTipe("Info");
    toast.success("Pengumuman berhasil dipublikasikan!", {
      description: `"${judul}" sudah tampil di aplikasi warga.`,
    });
  };

  const handleHapus = (id: number, judulP: string) => {
    hapusPengumuman(id);
    toast.success(`Pengumuman "${judulP}" telah dihapus.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pengumuman & Agenda</h2>
        <p className="text-slate-500">Kelola informasi yang akan ditampilkan di aplikasi warga.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Buat Pengumuman Baru
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleKirim}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Pengumuman</Label>
                <Input
                  id="judul"
                  placeholder="Contoh: Rapat RT Bulanan"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe">Tipe Pengumuman</Label>
                <select
                  id="tipe"
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-slate-800"
                >
                  <option value="Info">Info (Warna Hijau)</option>
                  <option value="Agenda">Agenda (Warna Biru)</option>
                  <option value="Penting">Penting (Warna Merah)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isi">Isi Pengumuman</Label>
                <textarea
                  id="isi"
                  className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-slate-800"
                  placeholder="Tuliskan detail pengumuman..."
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full gap-2">
                <CheckCircle className="w-4 h-4" />
                Publikasikan Pengumuman
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          {/* Widget Kalender Agenda */}
          <Card className="overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base text-slate-800 font-bold">Kalender Agenda (Juni 2026)</CardTitle>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase font-bold">Agenda Aktif</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold">
                <span className="text-slate-300 py-1.5">31</span>
                {[...Array(30)].map((_, index) => {
                  const day = index + 1;
                  const hasEvent = day === 7 || day === 14;
                  const eventTitle = day === 7
                    ? "Pemadaman Listrik PLN (09:00 - 12:00 WIB)"
                    : day === 14
                      ? "Kerja Bakti Rutin Lingkungan RT (07:00 WIB)"
                      : "";

                  return (
                    <div
                      key={day}
                      className={`py-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${hasEvent
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 font-bold scale-105"
                          : "hover:bg-slate-100 text-slate-700"
                        }`}
                      title={eventTitle}
                      onClick={() => {
                        if (hasEvent) {
                          toast.info(`Agenda ${day} Juni 2026:`, { description: eventTitle });
                        } else {
                          toast.message(`Tidak ada agenda pada ${day} Juni 2026.`);
                        }
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-medium text-slate-500 border-t pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span>
                  <span>Hari H Agenda Lingkungan</span>
                </div>
                <span className="text-slate-400 italic">Klik tanggal biru untuk detail</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Pengumuman & Agenda Aktif ({pengumumanList.length})</h3>
            {pengumumanList.length === 0 && (
              <p className="text-sm text-slate-400 border border-dashed rounded-xl p-6 text-center">Belum ada pengumuman. Buat pengumuman pertama di sebelah kiri.</p>
            )}
            {pengumumanList.map((p) => (
              <Card key={p.id} className="relative group overflow-hidden">
                {p.tipe === "Penting" && <div className="h-1 bg-red-500 w-full" />}
                {p.tipe === "Agenda" && <div className="h-1 bg-blue-500 w-full" />}
                {p.tipe === "Info" && <div className="h-1 bg-emerald-500 w-full" />}
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start pr-6">
                    <CardTitle className="text-base text-slate-800">{p.judul}</CardTitle>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${p.tipe === "Penting" ? "bg-red-50 text-red-700 border-red-200" :
                        p.tipe === "Agenda" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                      {p.tipe || "Info"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.tanggal}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.isi}</p>
                </CardContent>
                <button
                  onClick={() => handleHapus(p.id, p.judul)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"
                  title="Hapus pengumuman"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

