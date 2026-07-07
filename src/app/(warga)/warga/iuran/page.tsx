"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, CheckCircle2, History, QrCode, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useApp } from "@/context/AppContext";

const riwayatIuranStatis = [
  { bulan: "Mei 2026", nominal: "Rp 50.000", tglBayar: "05 Mei 2026" },
  { bulan: "April 2026", nominal: "Rp 50.000", tglBayar: "02 Apr 2026" },
  { bulan: "Maret 2026", nominal: "Rp 50.000", tglBayar: "10 Mar 2026" },
];

export default function WargaIuran() {
  const { nominalIuran, tagihanList, bayarIuran, currentUser, iuranAktif } = useApp();
  const [openQR, setOpenQR] = useState(false);

  const wargaNama = currentUser ? currentUser.desc.split(",")[0].trim() : "Budi Santoso";
  const myTagihan = tagihanList.find((t) => t.kk === wargaNama && t.tagihan === "Iuran Juni 2026") || {
    id: 0,
    kk: wargaNama,
    tagihan: "Iuran Juni 2026",
    nominal: nominalIuran,
    status: "Belum",
  };

  const handleKonfirmasiBayar = () => {
    setOpenQR(false);
    bayarIuran(wargaNama, "qris_proof_dummy.png");
    toast.success("Pembayaran berhasil dikonfirmasi! Menunggu verifikasi Ketua RT.");
  };

  const displayHistory = [
    ...(myTagihan.status === "Lunas"
      ? [{ bulan: "Juni 2026", nominal: `Rp ${myTagihan.nominal.toLocaleString("id-ID")}`, tglBayar: "Hari Ini" }]
      : []),
    ...riwayatIuranStatis,
  ];

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Iuran Bulanan</h2>
        <p className="text-sm text-slate-500">Bayar iuran kebersihan dan keamanan RT.</p>
      </div>

      {iuranAktif ? (
        <Card className="border-emerald-200 bg-emerald-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-emerald-800 mb-1">Tagihan Aktif</p>
                <h3 className="text-3xl font-bold text-emerald-950">Rp {myTagihan.nominal.toLocaleString("id-ID")}</h3>
                <p className="text-xs text-emerald-700 mt-1">Periode: {myTagihan.tagihan}</p>
              </div>
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Receipt className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            {myTagihan.status === "Belum" && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/20" size="lg" onClick={() => setOpenQR(true)}>
                Bayar Sekarang
              </Button>
            )}
            {myTagihan.status === "Menunggu Verifikasi" && (
              <Button className="w-full bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 text-white cursor-not-allowed font-bold" size="lg" disabled>
                Menunggu Verifikasi RT
              </Button>
            )}
            {myTagihan.status === "Lunas" && (
              <Button className="w-full bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-not-allowed font-bold" size="lg" disabled>
                <span className="flex items-center justify-center">Lunas <Check className="w-4 h-4 ml-1" /></span>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50/70 overflow-hidden relative shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-40"></div>
          <CardContent className="p-6 relative z-10 text-center flex flex-col items-center py-8">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4 border border-blue-100">
              <CheckCircle2 className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xs font-black text-blue-700 mb-1 uppercase tracking-widest">Bebas Iuran Bulanan</p>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">Iuran Ditiadakan oleh RT</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Ketua RT telah menonaktifkan sistem iuran untuk periode ini. Tidak ada tagihan yang harus dibayar.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={openQR} onOpenChange={setOpenQR}>
        <DialogContent className="sm:max-w-md w-[90%] rounded-2xl bg-white">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="text-2xl font-black text-slate-800">Scan QRIS</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">
              Pindai kode QR di bawah menggunakan aplikasi M-Banking atau e-Wallet Anda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-red-500 text-white w-full max-w-[240px] text-center font-bold py-2 rounded-t-2xl tracking-widest text-lg">
              QRIS
            </div>
            <div className="border-4 border-red-500 p-6 bg-white w-full max-w-[240px] flex items-center justify-center">
              <QrCode className="w-40 h-40 text-slate-900" />
            </div>
            <div className="bg-slate-100 text-slate-600 w-full max-w-[240px] text-center font-medium py-2 rounded-b-2xl border-x-4 border-b-4 border-slate-200">
              NMID: ID1029384756
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Tagihan</p>
              <p className="text-3xl font-black text-slate-800">Rp {myTagihan.nominal.toLocaleString("id-ID")}</p>
              <p className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-50 px-3 py-1 rounded-full inline-block">WargaLink - RT 01 RW 05</p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center flex-col sm:flex-col gap-2">
            <Button onClick={handleKonfirmasiBayar} className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl" size="lg">
              Selesai & Konfirmasi
            </Button>
            <Button onClick={() => setOpenQR(false)} variant="ghost" className="w-full rounded-xl text-slate-500">
              Batal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-800">Riwayat Pembayaran</h3>
        </div>
        <div className="space-y-3">
          {displayHistory.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{item.bulan}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.tglBayar}</p>
                </div>
              </div>
              <span className="font-semibold text-slate-700 text-sm">{item.nominal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

