"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useApp, Warga, Aduan } from "@/context/AppContext";
import { toast } from "sonner";
import { MessageSquare, AlertCircle, CheckCircle, Clock, Eye, XOctagon } from "lucide-react";

export default function AdminAduan() {
  const { aduanList, updateStatusAduan } = useApp();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterKategori, setFilterKategori] = useState("all");
  const [selectedAduan, setSelectedAduan] = useState<{ open: boolean; aduan: Aduan | null }>({ open: false, aduan: null });
  
  // Tanggapan form state
  const [tanggapanText, setTanggapanText] = useState("");

  const filtered = aduanList ? aduanList.filter(
    (a) =>
      (filterStatus === "all" || a.status === filterStatus) &&
      (filterKategori === "all" || a.kategori === filterKategori)
  ) : [];

  const handleOpenDetail = (aduan: Aduan) => {
    setTanggapanText(aduan.tanggapan || "");
    setSelectedAduan({ open: true, aduan });
  };

  const handleUpdateStatus = (id: number, status: "Diproses" | "Selesai" | "Ditolak") => {
    if ((status === "Selesai" || status === "Ditolak") && !tanggapanText.trim()) {
      toast.error("Silakan berikan tanggapan tertulis terlebih dahulu.");
      return;
    }
    updateStatusAduan(id, status, tanggapanText);
    setSelectedAduan({ open: false, aduan: null });
    setTanggapanText("");
    
    if (status === "Diproses") {
      toast.success("Aduan warga mulai diproses.");
    } else if (status === "Selesai") {
      toast.success("Aduan warga berhasil diselesaikan.");
    } else {
      toast.error("Aduan warga ditolak.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Diajukan":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200" variant="outline">Diajukan</Badge>;
      case "Diproses":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200" variant="outline">Diproses RT</Badge>;
      case "Selesai":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200" variant="outline">Selesai</Badge>;
      case "Ditolak":
        return <Badge className="bg-red-50 text-red-700 border-red-200" variant="outline">Ditolak</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Aduan Warga</h2>
        <p className="text-slate-500">Tinjau keluhan, laporan kerusakan fasilitas, dan aspirasi dari warga RT.</p>
      </div>

      <Card>
        <CardHeader className="py-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
            <h3 className="text-base font-bold text-slate-800">Daftar Laporan Masuk</h3>
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-slate-800 flex-1 sm:flex-none"
              >
                <option value="all">Semua Status</option>
                <option value="Diajukan">Diajukan</option>
                <option value="Diproses">Diproses</option>
                <option value="Selesai">Selesai</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="flex h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-slate-800 flex-1 sm:flex-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Keamanan">Keamanan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pengirim</TableHead>
                <TableHead>Judul Laporan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((aduan) => (
                <TableRow key={aduan.id} className="hover:bg-slate-50/50">
                  <TableCell className="text-xs font-semibold text-slate-500">{aduan.tanggal}</TableCell>
                  <TableCell className="font-semibold text-slate-700">{aduan.pemohon}</TableCell>
                  <TableCell className="font-bold text-slate-800 max-w-[200px] truncate">{aduan.judul}</TableCell>
                  <TableCell className="text-slate-600">{aduan.kategori}</TableCell>
                  <TableCell>{getStatusBadge(aduan.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80 flex items-center gap-1 ml-auto font-bold"
                      onClick={() => handleOpenDetail(aduan)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Tinjau
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">Tidak ada aduan warga ditemukan.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tinjau Aduan */}
      <Dialog open={selectedAduan.open} onOpenChange={(open) => setSelectedAduan({ ...selectedAduan, open })}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Tinjau Laporan Warga</DialogTitle>
            <DialogDescription>Keluhan lingkungan warga yang memerlukan respon RT.</DialogDescription>
          </DialogHeader>
          
          {selectedAduan.aduan && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  {selectedAduan.aduan.kategori}
                </span>
                <span className="text-xs text-slate-500 font-semibold">{selectedAduan.aduan.tanggal}</span>
              </div>
              
              <div>
                <h4 className="text-lg font-black text-slate-800 leading-snug">{selectedAduan.aduan.judul}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dilaporkan oleh: <strong className="text-slate-700">{selectedAduan.aduan.pemohon}</strong></p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border text-sm text-slate-600 leading-relaxed font-medium">
                {selectedAduan.aduan.deskripsi}
              </div>

              {/* Mock Image Attachment */}
              <div className="bg-slate-100 rounded-2xl p-4 border border-dashed flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-8 h-8 text-slate-300 mb-1" />
                <span className="text-xs font-semibold">Lampiran Gambar Terverifikasi</span>
                <span className="text-[10px] text-slate-400 mt-0.5">foto_aduan_kamera_warga.png (Simulated)</span>
              </div>

              {/* Status & Tanggapan input */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Laporan</span>
                  {getStatusBadge(selectedAduan.aduan.status)}
                </div>

                {selectedAduan.aduan.status !== "Selesai" && selectedAduan.aduan.status !== "Ditolak" ? (
                  <div className="space-y-2">
                    <Label htmlFor="tanggapan" className="text-xs font-bold text-slate-500">Tanggapan Ketua RT</Label>
                    <textarea
                      id="tanggapan"
                      placeholder="Tuliskan respon, solusi, atau alasan penolakan aduan di sini..."
                      value={tanggapanText}
                      onChange={(e) => setTanggapanText(e.target.value)}
                      className="flex min-h-[80px] w-full rounded-md border border-slate-250 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-800"
                    />
                  </div>
                ) : (
                  selectedAduan.aduan.tanggapan && (
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl text-xs">
                      <p className="font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Tanggapan RT ({selectedAduan.aduan.status})
                      </p>
                      <p className="text-slate-600 leading-relaxed font-medium">{selectedAduan.aduan.tanggapan}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 flex-wrap">
            {selectedAduan.aduan && (
              <>
                <Button variant="outline" className="rounded-xl flex-1" onClick={() => setSelectedAduan({ open: false, aduan: null })}>
                  Tutup
                </Button>
                {selectedAduan.aduan.status === "Diajukan" && (
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 rounded-xl flex-1 font-bold text-white shadow shadow-amber-500/10"
                    onClick={() => handleUpdateStatus(selectedAduan.aduan!.id, "Diproses")}
                  >
                    <Clock className="w-4 h-4 mr-1.5" />
                    Proses Laporan
                  </Button>
                )}
                {selectedAduan.aduan.status === "Diproses" && (
                  <div className="flex gap-2 w-full mt-2 sm:mt-0 sm:w-auto">
                    <Button 
                      variant="destructive"
                      className="rounded-xl flex-1 font-bold text-white shadow shadow-red-500/10"
                      onClick={() => handleUpdateStatus(selectedAduan.aduan!.id, "Ditolak")}
                    >
                      <XOctagon className="w-4 h-4 mr-1.5" />
                      Tolak
                    </Button>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 rounded-xl flex-1 font-bold text-white shadow shadow-emerald-500/10"
                      onClick={() => handleUpdateStatus(selectedAduan.aduan!.id, "Selesai")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Selesaikan
                    </Button>
                  </div>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
