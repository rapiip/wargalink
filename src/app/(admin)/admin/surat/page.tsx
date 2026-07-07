"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminSurat() {
  const router = useRouter();
  const { suratList, updateStatusSurat } = useApp();

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedSuratId, setSelectedSuratId] = useState<number | null>(null);
  const [alasanInput, setAlasanInput] = useState("");

  const handleApprove = (id: number) => {
    updateStatusSurat(id, "Disetujui");
    toast.success("Surat berhasil disetujui!");
  };

  const triggerReject = (id: number) => {
    setSelectedSuratId(id);
    setAlasanInput("");
    setOpenRejectDialog(true);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuratId === null || !alasanInput.trim()) return;

    updateStatusSurat(selectedSuratId, "Ditolak", alasanInput);
    setOpenRejectDialog(false);
    setSelectedSuratId(null);
    setAlasanInput("");
    toast.error("Surat ditolak.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Surat Menyurat</h2>
        <p className="text-slate-500">Daftar pengajuan surat dari warga yang membutuhkan persetujuan.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Pemohon</TableHead>
                <TableHead>Jenis Surat</TableHead>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suratList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">Belum ada pengajuan surat dari warga.</TableCell>
                </TableRow>
              )}
              {suratList.map((surat) => (
                <TableRow key={surat.id}>
                  <TableCell className="font-medium">{surat.pemohon}</TableCell>
                  <TableCell>{surat.jenis}</TableCell>
                  <TableCell className="text-slate-500">{surat.tanggal}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        surat.status === "Menunggu" || surat.status === "Diproses RT" ? "bg-amber-100 text-amber-800 border-transparent" :
                          surat.status === "Disetujui" || surat.status === "Selesai" ? "bg-emerald-100 text-emerald-800 border-transparent" :
                            "bg-red-100 text-red-800 border-transparent"
                      }
                    >
                      {surat.status === "Menunggu" ? "Diproses RT" : surat.status}
                    </Badge>
                    {surat.status === "Ditolak" && surat.alasanPenolakan && (
                      <p className="text-[11px] text-red-600 mt-1 max-w-[200px] break-words" title={surat.alasanPenolakan}>
                        Alasan: <strong className="font-semibold">{surat.alasanPenolakan}</strong>
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="outline" size="icon" title="Preview PDF" onClick={() => router.push(`/surat-preview?jenis=${encodeURIComponent(surat.jenis)}&nama=${encodeURIComponent(surat.pemohon)}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(surat.status === "Menunggu" || surat.status === "Diproses RT") && (
                      <>
                        <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" size="icon" onClick={() => handleApprove(surat.id)} title="Setujui">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => triggerReject(surat.id)} title="Tolak">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Rejection Reason */}
      <Dialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Alasan Penolakan Surat</DialogTitle>
            <DialogDescription>
              Silakan tuliskan alasan kenapa pengajuan surat ini ditolak agar warga dapat memahaminya.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmReject} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="alasan">Alasan Penolakan</Label>
              <Input
                id="alasan"
                required
                placeholder="Contoh: Lampiran berkas KK kurang jelas / NIK salah"
                value={alasanInput}
                onChange={(e) => setAlasanInput(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={() => setOpenRejectDialog(false)}>Batal</Button>
              <Button type="submit" variant="destructive" className="rounded-xl">Tolak Surat</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
