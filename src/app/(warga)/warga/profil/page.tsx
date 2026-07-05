"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Shield, MapPin, Bell, LogOut, ChevronRight, Check, FileText, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { AppLogo } from "@/components/AppLogo";

export default function WargaProfil() {
  const { currentUser, logoutUser } = useApp();
  const router = useRouter();

  // Modal states
  const [openKeluarga, setOpenKeluarga] = useState(false);
  const [openAlamat, setOpenAlamat] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const [openKeamanan, setOpenKeamanan] = useState(false);
  const [openDokumen, setOpenDokumen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState<"ktp" | "kk">("ktp");
  const [isFlipped, setIsFlipped] = useState(false);

  // Forms states
  const [pinLama, setPinLama] = useState("");
  const [pinBaru, setPinBaru] = useState("");
  const [notifIuran, setNotifIuran] = useState(true);
  const [notifPengumuman, setNotifPengumuman] = useState(true);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutUser();
    toast.success("Berhasil keluar dari akun Warga.");
    router.push("/");
  };

  const handleSaveKeamanan = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenKeamanan(false);
    setPinLama("");
    setPinBaru("");
    toast.success("PIN Keamanan berhasil diperbarui!");
  };

  const handleSaveNotif = () => {
    setOpenNotif(false);
    toast.success("Pengaturan notifikasi berhasil disimpan.");
  };

  const wargaNama = currentUser ? currentUser.desc.split(",")[0].trim() : "Budi Santoso";

  return (
    <div className="flex flex-col min-h-screen bg-transparent pb-8 relative">
      {/* Bottom Sheet & Flip Card Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
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
          max-width: 448px; /* max-w-md */
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
        
        /* 3D Flip Card Styles */
        .flip-card {
          background-color: transparent;
          perspective: 1000px;
          cursor: pointer;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 0.75rem;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      ` }} />

      {/* Profil Header */}
      <div className="bg-primary text-white p-6 pb-20 rounded-b-[2rem] shadow-md flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-inner">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{wargaNama}</h2>
          <p className="text-primary-foreground/80 text-sm">NIK: 3171230101800001</p>
        </div>
      </div>

      {/* Profil Menus */}
      <div className="px-4 -mt-12 space-y-4">
        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              <div 
                className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setOpenKeluarga(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Data Keluarga</p>
                    <p className="text-xs text-slate-500">Anggota KK & Dokumen</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div 
                className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setOpenAlamat(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Alamat & Kontak</p>
                    <p className="text-xs text-slate-500">Domisili saat ini</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div 
                className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setOpenDokumen(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Dokumen Saya</p>
                    <p className="text-xs text-slate-500">KTP & Kartu Keluarga Digital</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold text-slate-800 pt-2 px-1 text-sm uppercase tracking-wider">Pengaturan</h3>
        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col divide-y">
              <div 
                className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setOpenNotif(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Notifikasi</p>
                    <p className="text-xs text-slate-500">Pengaturan notif iuran & surat</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div 
                className="p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => setOpenKeamanan(true)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800">Keamanan</p>
                    <p className="text-xs text-slate-500">Ubah PIN / Password</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-6">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-semibold"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar Akun
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">WargaLink v1.0.0</p>
        </div>
      </div>

      {/* Bottom Sheet Data Keluarga */}
      {openKeluarga && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenKeluarga(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Data Anggota Keluarga</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Daftar anggota keluarga yang terdaftar dalam KK.</p>
              </div>
              <button onClick={() => setOpenKeluarga(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 py-2">
              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{wargaNama}</p>
                  <p className="text-xs text-slate-500">Kepala Keluarga</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Tetap</Badge>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Siti Aminah</p>
                  <p className="text-xs text-slate-500">Istri</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Tetap</Badge>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border flex justify-between items-center text-slate-400 border-dashed cursor-not-allowed">
                <span className="text-xs font-medium">+ Tambah Anggota Keluarga (Hubungi RT)</span>
              </div>
            </div>
            <div className="pt-4 pb-6">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 rounded-xl" onClick={() => setOpenKeluarga(false)}>Tutup</Button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Sheet Alamat & Kontak */}
      {openAlamat && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenAlamat(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Alamat & Kontak</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Detail informasi domisili dan kontak Anda.</p>
              </div>
              <button onClick={() => setOpenAlamat(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase">Alamat Domisili</p>
                <p className="text-sm font-semibold text-slate-800">Jl. Merdeka No. 45, RT 01 / RW 05, Blok A2 No 15</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase">Nomor HP</p>
                <p className="text-sm font-semibold text-slate-800">081234567890</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-bold uppercase">Status Hunian</p>
                <p className="text-sm font-semibold text-slate-800">Milik Sendiri</p>
              </div>
            </div>
            <div className="pt-4 pb-6">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 rounded-xl" onClick={() => setOpenAlamat(false)}>Tutup</Button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Sheet Notifikasi */}
      {openNotif && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenNotif(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Pengaturan Notifikasi</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Pilih notifikasi yang ingin Anda terima.</p>
              </div>
              <button onClick={() => setOpenNotif(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Tagihan Iuran</p>
                  <p className="text-xs text-slate-500">Ingatkan saya setiap awal bulan</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifIuran}
                  onChange={(e) => setNotifIuran(e.target.checked)}
                  className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Pengumuman & Info RT</p>
                  <p className="text-xs text-slate-500">Notifikasi pengumuman mendesak</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifPengumuman}
                  onChange={(e) => setNotifPengumuman(e.target.checked)}
                  className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
                />
              </div>
            </div>
            <div className="pt-4 pb-6">
              <Button className="w-full bg-primary hover:bg-primary/95 rounded-xl font-bold" onClick={handleSaveNotif}>Simpan Pengaturan</Button>
            </div>
          </div>
        </>
      )}

      {/* Bottom Sheet Keamanan */}
      {openKeamanan && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenKeamanan(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Keamanan Akun</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Ganti PIN keamanan warga Anda untuk masuk.</p>
              </div>
              <button onClick={() => setOpenKeamanan(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveKeamanan} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-650">PIN Lama</label>
                <input 
                  type="password" 
                  maxLength={6}
                  value={pinLama}
                  onChange={(e) => setPinLama(e.target.value)}
                  placeholder="******"
                  className="w-full px-3 py-2 border rounded-lg text-slate-800 text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-650">PIN Baru</label>
                <input 
                  type="password" 
                  maxLength={6}
                  value={pinBaru}
                  onChange={(e) => setPinBaru(e.target.value)}
                  placeholder="******"
                  className="w-full px-3 py-2 border rounded-lg text-slate-800 text-center tracking-widest font-mono text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div className="pt-4 pb-6">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/95 rounded-xl font-bold">Simpan PIN</Button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Bottom Sheet Dokumen Saya */}
      {openDokumen && (
        <>
          <div className="bottom-sheet-overlay" onClick={() => setOpenDokumen(false)} />
          <div className="bottom-sheet p-6">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Dokumen Saya</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Akses cepat KTP dan Kartu Keluarga versi digital Anda.</p>
              </div>
              <button onClick={() => setOpenDokumen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Tabs Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full mb-4 font-semibold text-xs border">
              <button
                onClick={() => setActiveDocTab("ktp")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeDocTab === "ktp" ? "bg-white text-primary shadow" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                KTP Digital
              </button>
              <button
                onClick={() => setActiveDocTab("kk")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeDocTab === "kk" ? "bg-white text-primary shadow" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Kartu Keluarga (KK)
              </button>
            </div>

            {activeDocTab === "ktp" && (
              <div className="py-2 flex flex-col items-center justify-center">
                <p className="text-[10px] text-slate-450 mb-3 font-semibold flex items-center gap-1">
                  <span>💡</span> Klik kartu untuk melihat bagian belakang
                </p>

                {/* 3D Flip Card KTP Container */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)} 
                  className={`flip-card w-full max-w-[340px] aspect-[1.58/1] ${isFlipped ? "flipped" : ""}`}
                >
                  <div className="flip-card-inner">
                    {/* Front Side */}
                    <div className="flip-card-front">
                      <div className="w-full h-full bg-gradient-to-br from-blue-700 via-sky-600 to-blue-900 rounded-xl p-4 shadow-xl text-white font-sans relative overflow-hidden border border-white/20 select-none">
                        {/* Hologram/Watermark */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-10 right-4 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />

                        {/* Header */}
                        <div className="text-center border-b border-white/25 pb-1 mb-2">
                          <p className="text-[7px] font-black tracking-widest uppercase text-sky-200">Republik Indonesia</p>
                          <p className="text-[8px] font-black uppercase text-white">Provinsi DKI Jakarta</p>
                        </div>

                        <div className="flex gap-2">
                          {/* Photo & Signature */}
                          <div className="w-[80px] shrink-0 flex flex-col items-center gap-1">
                            <div className="w-full aspect-[3/4] bg-sky-200/20 rounded border border-white/10 flex items-center justify-center overflow-hidden">
                              <User className="w-10 h-10 text-sky-100/65" />
                            </div>
                            <span className="text-[5px] text-white/50 tracking-wider font-mono">Ttd. Pemegang</span>
                            <span className="font-serif italic text-white/80 text-[10px] transform rotate-[-5deg]">BudiS</span>
                          </div>

                          {/* Fields */}
                          <div className="flex-1 text-[7px] space-y-0.5 leading-snug">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-[8px] font-black tracking-wider text-sky-150">NIK :</span>
                              <span className="text-[8.5px] font-black tracking-wider font-mono">3171230101800001</span>
                            </div>
                            {[
                              ["Nama", wargaNama],
                              ["Tempat/Tgl Lahir", "JAKARTA, 01-01-1980"],
                              ["Jenis Kelamin", "LAKI-LAKI"],
                              ["Alamat", "JL. MERDEKA NO. 45"],
                              ["     RT/RW", "001/005"],
                              ["     Kel/Desa", "SIMULASI"],
                              ["     Kecamatan", "CONTOH"],
                              ["Agama", "ISLAM"],
                              ["Status Perkawinan", "KAWIN"],
                              ["Pekerjaan", "KARYAWAN SWASTA"],
                              ["Kewarganegaraan", "WNI"],
                              ["Berlaku Hingga", "SEUMUR HIDUP"],
                            ].map(([lbl, val]) => (
                              <div key={lbl} className="flex">
                                <span className="w-24 shrink-0 uppercase tracking-tight text-sky-200 font-bold">{lbl}</span>
                                <span className="w-1 shrink-0">:</span>
                                <span className="flex-1 font-semibold truncate">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="flip-card-back">
                      <div className="w-full h-full bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-900 rounded-xl p-4 shadow-xl text-white font-sans relative overflow-hidden border border-white/20 select-none flex flex-col justify-between">
                        {/* Hologram overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Top: Chip and Garuda */}
                        <div className="flex justify-between items-start">
                          {/* Smart Card Chip */}
                          <div className="w-9 h-7 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-md border border-amber-600/30 flex flex-col justify-between p-1 shadow-inner relative overflow-hidden">
                            <div className="flex justify-between h-1">
                              <div className="w-[1.5px] bg-amber-850/40 h-full"></div>
                              <div className="w-[1.5px] bg-amber-850/40 h-full"></div>
                            </div>
                            <div className="h-0.5 bg-amber-800/45 w-full"></div>
                            <div className="flex justify-between h-1">
                              <div className="w-[1.5px] bg-amber-800/40 h-full"></div>
                              <div className="w-[1.5px] bg-amber-800/40 h-full"></div>
                            </div>
                          </div>
                          
                          <AppLogo className="h-8 w-8 rounded-full border border-white/10 bg-white/90 shadow-sm" />
                        </div>

                        {/* Center: Barcode */}
                        <div className="flex flex-col items-center justify-center my-auto">
                          <div className="bg-white p-2 rounded flex flex-col items-center justify-center w-full max-w-[200px] shadow-lg">
                            <div className="flex items-center justify-center h-8 w-full gap-[1px] bg-white">
                              {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 4, 1, 3, 1, 2].map((w, idx) => (
                                <div 
                                  key={idx} 
                                  className="bg-black h-full shrink-0" 
                                  style={{ width: `${w}px` }} 
                                />
                              ))}
                            </div>
                            <p className="text-[5px] font-mono text-slate-800 mt-1 tracking-[0.2em] font-bold">NIK-3171230101800001</p>
                          </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="flex justify-between items-end border-t border-white/10 pt-2 text-[5px] text-white/60">
                          <div>
                            <p className="font-bold text-[5.5px]">KEMENTERIAN DALAM NEGERI</p>
                            <p>DITJEN DUKCAPIL</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sky-300">WargaLink Digital ID</p>
                            <p>VALID & VERIFIED</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDocTab === "kk" && (
              <div className="py-2">
                {/* KK Sheet Mockup */}
                <div className="w-full bg-amber-50/20 border-2 border-slate-300 rounded-xl p-4 shadow-md font-sans text-slate-800 text-[8px] leading-relaxed">
                  <div className="text-center mb-3 border-b-2 border-double border-slate-300 pb-2">
                    <h4 className="font-extrabold text-sm tracking-wider uppercase text-slate-800">Kartu Keluarga</h4>
                    <p className="font-semibold text-slate-500">No. 3171234567890001</p>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex">
                      <span className="w-24 font-bold text-slate-500 uppercase">Nama Kepala Keluarga</span>
                      <span className="w-2">:</span>
                      <span className="font-extrabold text-slate-800">{wargaNama}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 font-bold text-slate-500 uppercase">Alamat Lengkap</span>
                      <span className="w-2">:</span>
                      <span className="font-extrabold text-slate-800">Jl. Merdeka No. 45, RT 01 / RW 05</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 font-bold text-slate-500 uppercase">Kecamatan / Kelurahan</span>
                      <span className="w-2">:</span>
                      <span className="font-extrabold text-slate-800">Contoh / Simulasi</span>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="border border-slate-300 rounded overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-left font-bold text-slate-600">
                          <th className="p-1 border-r border-slate-300">Nama Lengkap</th>
                          <th className="p-1 border-r border-slate-300">NIK</th>
                          <th className="p-1 border-r border-slate-300">Jenis Kelamin</th>
                          <th className="p-1">Hubungan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="p-1 border-r border-slate-200 font-extrabold">{wargaNama}</td>
                          <td className="p-1 border-r border-slate-200 font-mono">3171230101800001</td>
                          <td className="p-1 border-r border-slate-200">Laki-laki</td>
                          <td className="p-1 font-semibold">Kepala Keluarga</td>
                        </tr>
                        <tr>
                          <td className="p-1 border-r border-slate-200 font-extrabold">Siti Aminah</td>
                          <td className="p-1 border-r border-slate-200 font-mono">3171230202850001</td>
                          <td className="p-1 border-r border-slate-200">Perempuan</td>
                          <td className="p-1 font-semibold">Istri</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-3 text-right text-[6px] font-bold text-slate-400 uppercase tracking-widest">
                    Dokumen Resmi Kependudukan · WargaLink
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 pb-6">
              <Button className="w-full bg-slate-800 hover:bg-slate-700 rounded-xl" onClick={() => setOpenDokumen(false)}>Tutup</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
