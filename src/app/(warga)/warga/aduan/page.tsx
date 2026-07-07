"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, PlusCircle, CheckCircle2, ChevronRight, AlertCircle, Clock, Trash2, Camera, X } from "lucide-react";
import { useState } from "react";
import { useApp, Aduan } from "@/context/AppContext";
import { toast } from "sonner";

export default function WargaAduan() {
  const { aduanList, tambahAduan, currentUser } = useApp();
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedAduan, setSelectedAduan] = useState<Aduan | null>(null);

  // Form states
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Fasilitas Umum");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotoMock, setFotoMock] = useState<string | null>(null);

  const wargaNama = currentUser ? currentUser.desc.split(",")[0].trim() : "Budi Santoso";
  const myAduan = aduanList ? aduanList.filter((a) => a.pemohon === wargaNama) : [];

  const handleSimpanAduan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !deskripsi.trim()) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    tambahAduan(judul, deskripsi, kategori, wargaNama, fotoMock || undefined);
    setOpenCreate(false);
    setJudul("");
    setDeskripsi("");
    setFotoMock(null);
    toast.success("Aduan Anda berhasil dikirim ke Ketua RT!");
  };

  const handleSimulasiFoto = () => {
    setFotoMock("foto_aduan_terupload.png");
    toast.success("Gambar berhasil disimulasikan dari kamera.");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Diajukan":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "Diproses":
        return <Clock className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "Selesai":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "Ditolak":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diajukan":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Diproses":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Selesai":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Ditolak":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 space-y-6 pb-24 relative">
      {/* Bottom Sheet Styles */}
      <style>{`
        .bottom-sheet-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 40;
          animation: fadeIn 0.2s ease-out;
        }
        .bottom-sheet {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 448px;
          background-color: white;
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
          max-height: 85%;
          overflow-y: auto;
          z-index: 50;
          box-shadow: 0 -10px 25px -5px rgba(0,0,0,0.1), 0 -8px 10px -6px rgba(0,0,0,0.1);
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }
      `}</style>

      <div>
        <h2 className="text-xl font-bold text-slate-900">Aduan Lingkungan</h2>
        <p className="text-sm text-slate-500">Laporkan keluhan atau saran langsung ke Ketua RT.</p>
      </div>

      {/* Trigger Button */}
      <Button 
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/10 rounded-xl py-6 text-base font-bold text-white transition-all active:scale-95" 
        onClick={() => setOpenCreate(true)}
      >
        <PlusCircle className="w-5 h-5" />
        Buat Laporan Aduan Baru
      </Button>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <h3 className="font-semibold text-slate-800">Riwayat Aduan Saya</h3>
        </div>

        <div className="space-y-3">
          {myAduan.map((aduan) => (
            <div 
              key={aduan.id} 
              className="bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between hover:border-slate-300 transition-all cursor-pointer hover:shadow-md"
              onClick={() => setSelectedAduan(aduan)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full shrink-0">
                  {getStatusIcon(aduan.status)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{aduan.judul}</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{aduan.tanggal} · {aduan.kategori}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Badge className={`text-[10px] font-bold ${getStatusColor(aduan.status)}`} variant="outline">
                  {aduan.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
          {myAduan.length === 0 && (
            <div className="text-center py-12 text-slate-400 border border-dashed rounded-2xl bg-slate-50/50">
              <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Belum ada laporan aduan.</p>
              <p className="text-xs text-slate-400 mt-1">Laporan aduan Anda akan muncul di sini.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sheet: Buat Aduan */}
      {openCreate && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenCreate(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-lg">Buat Laporan Baru</h3>
              <button onClick={() => setOpenCreate(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimpanAduan} className="space-y-4 pb-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Kategori Laporan</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-800"
                >
                  <option value="Fasilitas Umum">Fasilitas Umum</option>
                  <option value="Kebersihan">Kebersihan</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Judul Keluhan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Selokan Tersumbat Depan Rumah"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Deskripsi Keluhan</label>
                <textarea
                  required
                  placeholder="Deskripsikan dengan detail lokasi dan kendala keluhan Anda..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring text-slate-800 leading-relaxed"
                />
              </div>

              {/* Photo Simulation */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Lampiran Gambar</label>
                {fotoMock ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex justify-between items-center text-xs text-emerald-800">
                    <span className="font-semibold">{fotoMock} (Simulasi Terupload)</span>
                    <button type="button" onClick={() => setFotoMock(null)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSimulasiFoto}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors text-xs font-bold bg-slate-50"
                  >
                    <Camera className="w-4 h-4" />
                    Simulasikan Foto Keluhan
                  </button>
                )}
              </div>

              <div className="pt-4 flex gap-2">
                <Button type="button" variant="outline" className="w-full rounded-xl" onClick={() => setOpenCreate(false)}>Batal</Button>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">Kirim Laporan</Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Bottom Sheet: Detail Aduan */}
      {selectedAduan && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setSelectedAduan(null)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-lg">Detail Laporan Aduan</h3>
              <button onClick={() => setSelectedAduan(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pb-6">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {selectedAduan.kategori}
                </span>
                <span className="text-xs font-semibold text-slate-400">{selectedAduan.tanggal}</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-800 leading-snug">{selectedAduan.judul}</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">Status saat ini: <strong className="text-slate-600">{selectedAduan.status}</strong></p>
              </div>

              <div className="bg-slate-50 border p-4 rounded-xl text-xs text-slate-600 leading-relaxed font-semibold">
                {selectedAduan.deskripsi}
              </div>

              {/* Verified Image Preview Mock */}
              {selectedAduan.foto && (
                <div className="bg-slate-100 rounded-xl p-3.5 border border-dashed flex flex-col items-center justify-center text-slate-400 text-xs font-semibold">
                  <Camera className="w-6 h-6 text-slate-300 mb-1" />
                  <span>{selectedAduan.foto}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Lampiran Gambar Keluhan</span>
                </div>
              )}

              {/* Status Timeline Stepper */}
              <div className="pt-2 border-t mt-4 space-y-3.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Laporan Anda</p>
                <div className="relative pl-6 space-y-5">
                  <div className="absolute left-1.5 top-1.5 bottom-1.5 w-0.5 bg-slate-100"></div>

                  {/* Step 1: Diajukan */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-200"></div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Laporan Diajukan</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Laporan telah diterima sistem WargaLink</p>
                    </div>
                  </div>

                  {/* Step 2: Diproses */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      selectedAduan.status === "Diproses" || selectedAduan.status === "Selesai"
                        ? "bg-emerald-500 ring-2 ring-emerald-200"
                        : "bg-slate-200"
                    }`}></div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Ditinjau RT</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sedang dalam peninjauan Ketua RT</p>
                    </div>
                  </div>

                  {/* Step 3: Selesai / Ditolak */}
                  <div className="relative">
                    <div className={`absolute -left-6 top-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      selectedAduan.status === "Selesai"
                        ? "bg-emerald-500 ring-2 ring-emerald-200"
                        : selectedAduan.status === "Ditolak"
                        ? "bg-red-500 ring-2 ring-red-200"
                        : "bg-slate-200"
                    }`}></div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">Selesai / Tanggapan</p>
                      {selectedAduan.tanggapan ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mt-2 text-[11px] text-slate-700 leading-relaxed font-semibold">
                          <p className="font-bold text-emerald-800 uppercase text-[9px] mb-0.5">Tanggapan RT:</p>
                          {selectedAduan.tanggapan}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5">Menunggu konfirmasi penyelesaian</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full rounded-xl" onClick={() => setSelectedAduan(null)}>Tutup Detail</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
