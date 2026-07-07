"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronRight, CheckCircle2, Clock, XCircle, Check, X, Inbox } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";

const jenisSurat = [
  "Pengantar KTP",
  "Keterangan Domisili",
  "Keterangan Tidak Mampu",
  "Pengantar SKCK",
  "Surat Keterangan Usaha",
];

export default function WargaSurat() {
  const router = useRouter();
  const { currentUser, suratList, ajukanSurat } = useApp();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [keperluan, setKeperluan] = useState("");
  const [catatan, setCatatan] = useState("");

  const pemohonNama = currentUser ? currentUser.desc.split(",")[0].trim() : "Budi Santoso";
  const mySurat = suratList.filter((s) => s.pemohon === pemohonNama);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    ajukanSurat(selected, keperluan, catatan, pemohonNama);
    setOpen(false);
    setKeperluan("");
    setCatatan("");
    toast.success(`Pengajuan ${selected} berhasil dikirim ke RT.`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pengajuan Surat</h2>
        <p className="text-sm text-slate-500">Pilih jenis surat pengantar yang Anda butuhkan.</p>
      </div>

      <div className="grid gap-3">
        {jenisSurat.map((jenis) => (
          <div key={jenis} className="w-full text-left">
            <Card className="active:scale-95 transition-transform cursor-pointer hover:border-blue-200 transition-colors" onClick={() => { setSelected(jenis); setOpen(true); }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-slate-700">{jenis}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-[90%] rounded-xl">
          <DialogHeader>
            <DialogTitle>Pengajuan {selected}</DialogTitle>
            <DialogDescription>
              Mohon lengkapi keperluan pengajuan surat ini. Data diri akan otomatis diisi dari profil Anda.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keperluan">Keperluan</Label>
              <Input
                id="keperluan"
                required
                placeholder="Contoh: Pembuatan rekening bank"
                value={keperluan}
                onChange={(e) => setKeperluan(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan Tambahan (Opsional)</Label>
              <Input
                id="catatan"
                placeholder="Tulis catatan untuk RT..."
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <Button type="submit" className="w-full">Kirim Pengajuan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="pt-4">
        <h3 className="font-semibold text-slate-800 mb-3">Riwayat Pengajuan</h3>
        <div className="space-y-3 pb-12">
          {mySurat.length === 0 && (
            <div className="text-center py-10 border border-dashed rounded-2xl bg-slate-50/60">
              <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <Inbox className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-sm font-bold text-slate-700">Belum ada riwayat pengajuan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[16rem] mx-auto leading-relaxed">Pilih jenis surat di atas untuk mengajukan surat pengantar pertama Anda ke Ketua RT.</p>
            </div>
          )}
          {mySurat.map((surat) => {
            const isApproved = surat.status === "Selesai" || surat.status === "Disetujui";
            const isRejected = surat.status === "Ditolak";
            return (
              <div 
                key={surat.id} 
                className={`bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-3 ${isApproved ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''}`}
                onClick={() => isApproved && router.push(`/surat-preview?jenis=${encodeURIComponent(surat.jenis)}&nama=${encodeURIComponent(surat.pemohon)}`)}>

                <div className="flex justify-between items-start w-full">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{surat.jenis}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{surat.tanggal}</p>
                    {isApproved && (
                      <p className="text-xs text-blue-600 mt-2 font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Lihat Surat
                      </p>
                    )}
                    {isRejected && surat.alasanPenolakan && (
                      <p className="text-[11px] text-red-600 mt-2 font-medium bg-red-50/50 border border-red-100 p-2 rounded-lg max-w-[240px] break-words">
                        Alasan: <span className="font-semibold text-red-700">{surat.alasanPenolakan}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full border">
                    {isApproved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : isRejected ? (
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="text-[10px] font-semibold text-slate-600">
                      {surat.status === "Menunggu" ? "Diproses RT" : surat.status}
                    </span>
                  </div>
                </div>

                {/* Stepper Timeline Status */}
                <div className="mt-1 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] w-full text-slate-400 font-semibold">
                  <div className="flex items-center gap-1">
                    <span className="w-4.5 h-4.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold"><Check className="w-2.5 h-2.5" /></span>
                    <span className="text-slate-800">Diajukan</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
                  <div className="flex items-center gap-1">
                    <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      surat.status !== "Menunggu" ? "bg-emerald-500 text-white" : "bg-blue-600 text-white animate-pulse"
                    }`}>
                      {surat.status !== "Menunggu" ? <Check className="w-2.5 h-2.5" /> : "2"}
                    </span>
                    <span className={surat.status === "Menunggu" ? "text-blue-600 font-bold" : "text-slate-800"}>Proses RT</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>
                  <div className="flex items-center gap-1">
                    <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isApproved ? "bg-emerald-500 text-white" : isRejected ? "bg-red-500 text-white" : "bg-slate-200 text-slate-400"
                    }`}>
                      {isApproved ? <Check className="w-2.5 h-2.5" /> : isRejected ? <X className="w-2.5 h-2.5" /> : "3"}
                    </span>
                    <span className={isApproved ? "text-emerald-600 font-bold" : isRejected ? "text-red-600 font-bold" : "text-slate-400"}>
                      {isRejected ? "Ditolak" : "Selesai"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

