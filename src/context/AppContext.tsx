"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Warga {
  id: number;
  kk: string;
  nama: string;
  nik: string;
  status: string;
  rt: string;
  phone: string;
  alamat: string;
}

export interface Pengumuman {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
  tipe: string;
}

export interface Surat {
  id: number;
  pemohon: string;
  jenis: string;
  tanggal: string;
  status: string;
  keperluan?: string;
  catatan?: string;
  alasanPenolakan?: string;
}

export interface Transaksi {
  id: number;
  tipe: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: string;
}

export interface Tagihan {
  id: number;
  kk: string;
  tagihan: string;
  nominal: number;
  status: string;
  buktiBayar?: string;
}

export interface TransaksiBulanan {
  name: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface UserSession {
  username: string;
  role: string;
  desc: string;
}

export interface Notification {
  id: number;
  targetRole: "Warga" | "Admin RT/RW" | "Pemda" | "All";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Aduan {
  id: number;
  pemohon: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  tanggal: string;
  status: "Diajukan" | "Diproses" | "Selesai" | "Ditolak";
  foto?: string;
  tanggapan?: string;
}

interface AppContextType {
  nominalIuran: number;
  iuranAktif: boolean;
  daftarWarga: Warga[];
  pengumumanList: Pengumuman[];
  suratList: Surat[];
  tagihanList: Tagihan[];
  transaksiBulanan: TransaksiBulanan[];
  transaksiList: Transaksi[];
  currentUser: UserSession | null;
  notifications: Notification[];
  setNominalIuran: (nominal: number) => void;
  setIuranAktif: (aktif: boolean) => void;
  tambahWarga: (warga: Omit<Warga, "id">) => void;
  tambahPengumuman: (judul: string, isi: string, tipe: string) => void;
  hapusPengumuman: (id: number) => void;
  ajukanSurat: (jenis: string, keperluan: string, catatan: string, pemohon: string) => void;
  updateStatusSurat: (id: number, status: string, alasanPenolakan?: string) => void;
  bayarIuran: (kk: string, buktiBayar: string) => void;
  verifikasiIuran: (id: number, status: "Lunas" | "Belum") => void;
  loginUser: (username: string, role: string, desc: string) => void;
  logoutUser: () => void;
  pemasukanManual: (nominal: number, keterangan: string) => void;
  pengeluaranManual: (nominal: number, keterangan: string) => void;
  tambahNotifikasi: (targetRole: "Warga" | "Admin RT/RW" | "Pemda" | "All", title: string, message: string) => void;
  markNotifikasiRead: (id: number) => void;
  clearAllNotifikasi: (targetRole: "Warga" | "Admin RT/RW" | "Pemda" | "All") => void;
  aduanList: Aduan[];
  tambahAduan: (judul: string, deskripsi: string, kategori: string, pemohon: string, foto?: string) => void;
  updateStatusAduan: (id: number, status: "Diajukan" | "Diproses" | "Selesai" | "Ditolak", tanggapan?: string) => void;
  updateWarga: (id: number, warga: Partial<Warga>) => void;
  hapusWarga: (id: number) => void;
  isLoaded: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_WARGA: Warga[] = [
  { id: 1, kk: "3171234567890001", nama: "Budi Santoso", nik: "3171230101800001", status: "Tetap", rt: "01", phone: "081234567890", alamat: "Jl. Merdeka No. 45" },
  { id: 2, kk: "3171234567890001", nama: "Siti Aminah", nik: "3171230202850001", status: "Tetap", rt: "01", phone: "081298765432", alamat: "Jl. Merdeka No. 45" },
  { id: 3, kk: "3171234567890002", nama: "Ahmad Wijaya", nik: "3171230303900001", status: "Kontrak", rt: "01", phone: "085612345678", alamat: "Jl. Pahlawan No. 12" },
  { id: 4, kk: "3171234567890003", nama: "Dewi Lestari", nik: "3171230404950001", status: "Tetap", rt: "02", phone: "082211223344", alamat: "Jl. Sudirman No. 7" },
];

const INITIAL_PENGUMUMAN: Pengumuman[] = [
  { id: 1, judul: "Kerja Bakti Rutin", tanggal: "14 Juni 2026", isi: "Diharapkan kehadiran seluruh bapak-bapak untuk kerja bakti membersihkan selokan RT. Kumpul di lapangan voli jam 07:00 WIB.", tipe: "Agenda" },
  { id: 2, judul: "Iuran Keamanan Naik", tanggal: "10 Juni 2026", isi: "Sesuai hasil rapat, iuran keamanan naik menjadi Rp 50.000 mulai bulan depan. Harap dimaklumi demi keamanan bersama.", tipe: "Info" },
  { id: 3, judul: "Pemadaman Listrik", tanggal: "05 Juni 2026", isi: "Akan ada pemadaman bergilir dari PLN pada hari Minggu, 7 Juni 2026 pukul 09:00 - 12:00 WIB.", tipe: "Penting" },
];

const INITIAL_SURAT: Surat[] = [
  { id: 1, pemohon: "Budi Santoso", jenis: "Pengantar KTP", tanggal: "14 Jun 2026", status: "Menunggu" },
  { id: 2, pemohon: "Siti Aminah", jenis: "Keterangan Domisili", tanggal: "12 Jun 2026", status: "Disetujui" },
  { id: 3, pemohon: "Ahmad Wijaya", jenis: "Pengantar SKCK", tanggal: "10 Jun 2026", status: "Ditolak", alasanPenolakan: "Dokumen NIK tidak sesuai dengan data kependudukan RT" },
  { id: 4, pemohon: "Budi Santoso", jenis: "Surat Keterangan Usaha", tanggal: "08 Jun 2026", status: "Ditolak", alasanPenolakan: "Dokumen berkas SIUP tidak melampirkan foto tempat usaha yang jelas." }
];

const INITIAL_TAGIHAN: Tagihan[] = [
  { id: 1, kk: "Budi Santoso", tagihan: "Iuran Juni 2026", nominal: 50000, status: "Lunas" },
  { id: 2, kk: "Siti Aminah", tagihan: "Iuran Juni 2026", nominal: 50000, status: "Lunas" },
  { id: 3, kk: "Ahmad Wijaya", tagihan: "Iuran Juni 2026", nominal: 50000, status: "Belum" },
  { id: 4, kk: "Dewi Lestari", tagihan: "Iuran Juni 2026", nominal: 50000, status: "Belum" },
];

const INITIAL_TRANSAKSI: TransaksiBulanan[] = [
  { name: "Jan", pemasukan: 4000000, pengeluaran: 2400000 },
  { name: "Feb", pemasukan: 3000000, pengeluaran: 1398000 },
  { name: "Mar", pemasukan: 4500000, pengeluaran: 3800000 },
  { name: "Apr", pemasukan: 2780000, pengeluaran: 3908000 },
  { name: "Mei", pemasukan: 4890000, pengeluaran: 2800000 },
  { name: "Jun", pemasukan: 4500000, pengeluaran: 1200000 },
];

const INITIAL_TRANSAKSI_LIST: Transaksi[] = [
  { id: 1, tipe: "pemasukan", nominal: 50000, keterangan: "Iuran Mei 2026 - Budi Santoso", tanggal: "05 Mei 2026, 09:00 WIB" },
  { id: 2, tipe: "pemasukan", nominal: 50000, keterangan: "Iuran Mei 2026 - Siti Aminah", tanggal: "06 Mei 2026, 10:15 WIB" },
  { id: 3, tipe: "pengeluaran", nominal: 35000, keterangan: "Pembelian sapu lidi & tempat sampah gang 2", tanggal: "12 Mei 2026, 16:30 WIB" },
  { id: 4, tipe: "pemasukan", nominal: 200000, keterangan: "Donasi HUT RI - Warga Blok A", tanggal: "20 Mei 2026, 11:00 WIB" },
  { id: 5, tipe: "pengeluaran", nominal: 400000, keterangan: "Biaya angkut sampah bulanan", tanggal: "31 Mei 2026, 17:00 WIB" },
  { id: 6, tipe: "pemasukan", nominal: 50000, keterangan: "Iuran Juni 2026 - Budi Santoso", tanggal: "03 Jun 2026, 08:30 WIB" },
  { id: 7, tipe: "pemasukan", nominal: 50000, keterangan: "Iuran Juni 2026 - Siti Aminah", tanggal: "04 Jun 2026, 14:20 WIB" },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, targetRole: "Warga", title: "Selamat Datang Warga!", message: "Akun WargaLink Anda aktif. Laporkan keluhan atau ajukan surat jika diperlukan.", time: "1 Hari Lalu", read: false },
  { id: 2, targetRole: "Admin RT/RW", title: "Sistem RT Aktif", message: "WargaLink RT 01 RW 05 siap untuk melakukan pembukuan keuangan dan persetujuan surat.", time: "1 Hari Lalu", read: false }
];

const INITIAL_ADUAN: Aduan[] = [
  { id: 1, pemohon: "Budi Santoso", judul: "Lampu Jalan Mati di Gang 3", deskripsi: "Lampu jalan di Gang 3 mati sejak 3 hari lalu, membuat lingkungan gelap di malam hari.", kategori: "Fasilitas Umum", tanggal: "22 Jun 2026", status: "Diproses", tanggapan: "Sedang dikoordinasikan dengan petugas PLN." },
  { id: 2, pemohon: "Ahmad Wijaya", judul: "Sampah Menumpuk di Depan Gapura", deskripsi: "Petugas kebersihan belum mengangkut sampah di depan gapura selama seminggu sehingga menimbulkan bau.", kategori: "Kebersihan", tanggal: "20 Jun 2026", status: "Selesai", tanggapan: "Sudah diangkut oleh truk sampah kelurahan pada tanggal 21 Juni." }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nominalIuran, setNominalIuranState] = useState(50000);
  const [iuranAktif, setIuranAktifState] = useState(true);
  const [daftarWarga, setDaftarWarga] = useState<Warga[]>(INITIAL_WARGA);
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(INITIAL_PENGUMUMAN);
  const [suratList, setSuratList] = useState<Surat[]>(INITIAL_SURAT);
  const [tagihanList, setTagihanList] = useState<Tagihan[]>(INITIAL_TAGIHAN);
  const [transaksiBulanan, setTransaksiBulanan] = useState<TransaksiBulanan[]>(INITIAL_TRANSAKSI);
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(INITIAL_TRANSAKSI_LIST);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [aduanList, setAduanList] = useState<Aduan[]>(INITIAL_ADUAN);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedIuran = localStorage.getItem("wl_nominalIuran");
      if (storedIuran) setNominalIuranState(Number(storedIuran));

      const storedIuranAktif = localStorage.getItem("wl_iuranAktif");
      if (storedIuranAktif !== null) setIuranAktifState(storedIuranAktif === "true");

      const storedWarga = localStorage.getItem("wl_daftarWarga");
      if (storedWarga) setDaftarWarga(JSON.parse(storedWarga));

      const storedPengumuman = localStorage.getItem("wl_pengumumanList");
      if (storedPengumuman) setPengumumanList(JSON.parse(storedPengumuman));

      const storedSurat = localStorage.getItem("wl_suratList");
      if (storedSurat) {
        const parsed = JSON.parse(storedSurat);
        const hasRejectedBudi = parsed.some((s: any) => s.pemohon === "Budi Santoso" && s.status === "Ditolak");
        if (!hasRejectedBudi) {
          parsed.push({
            id: 4,
            pemohon: "Budi Santoso",
            jenis: "Surat Keterangan Usaha",
            tanggal: "08 Jun 2026",
            status: "Ditolak",
            alasanPenolakan: "Dokumen berkas SIUP tidak melampirkan foto tempat usaha yang jelas."
          });
          localStorage.setItem("wl_suratList", JSON.stringify(parsed));
        }
        setSuratList(parsed);
      }


      const storedTagihan = localStorage.getItem("wl_tagihanList");
      if (storedTagihan) setTagihanList(JSON.parse(storedTagihan));

      const storedTransaksi = localStorage.getItem("wl_transaksiBulanan");
      if (storedTransaksi) setTransaksiBulanan(JSON.parse(storedTransaksi));

      const storedTransaksiList = localStorage.getItem("wl_transaksiList");
      if (storedTransaksiList) setTransaksiList(JSON.parse(storedTransaksiList));

      const storedNotif = localStorage.getItem("wl_notifications");
      if (storedNotif) setNotifications(JSON.parse(storedNotif));

      const storedAduan = localStorage.getItem("wl_aduanList");
      if (storedAduan) setAduanList(JSON.parse(storedAduan));

      const storedUser = sessionStorage.getItem("wl_currentUser") || localStorage.getItem("wl_currentUser");
      if (storedUser) setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error loading localStorage data", e);
    }
    setIsLoaded(true);
  }, []);

  // Save state helper
  const saveToStorage = (key: string, value: any, useSession = false) => {
    try {
      const stringVal = JSON.stringify(value);
      if (useSession) {
        sessionStorage.setItem(key, stringVal);
      } else {
        localStorage.setItem(key, stringVal);
      }
    } catch (e) {
      console.error(`Error saving ${key} to storage`, e);
    }
  };

  const tambahNotifikasi = (targetRole: "Warga" | "Admin RT/RW" | "Pemda" | "All", title: string, message: string) => {
    setNotifications((prev) => {
      const updated = [
        {
          id: Date.now() + Math.random(),
          targetRole,
          title,
          message,
          time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
          read: false
        },
        ...prev
      ];
      saveToStorage("wl_notifications", updated);
      return updated;
    });
  };

  const markNotifikasiRead = (id: number) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage("wl_notifications", updated);
      return updated;
    });
  };

  const clearAllNotifikasi = (targetRole: "Warga" | "Admin RT/RW" | "Pemda" | "All") => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.targetRole === targetRole || n.targetRole === "All" ? { ...n, read: true } : n));
      saveToStorage("wl_notifications", updated);
      return updated;
    });
  };

  const setNominalIuran = (nominal: number) => {
    setNominalIuranState(nominal);
    saveToStorage("wl_nominalIuran", nominal);

    // Update nominal for all unpaid bills dynamically
    setTagihanList((prev) => {
      const updated = prev.map((t) => (t.status !== "Lunas" ? { ...t, nominal } : t));
      saveToStorage("wl_tagihanList", updated);
      return updated;
    });
  };

  const setIuranAktif = (aktif: boolean) => {
    setIuranAktifState(aktif);
    saveToStorage("wl_iuranAktif", aktif);
    tambahNotifikasi(
      "All",
      aktif ? "Sistem Iuran Diaktifkan" : "Sistem Iuran Dinonaktifkan",
      aktif
        ? "Sistem pembayaran iuran bulanan kembali diaktifkan oleh RT."
        : "Sistem pembayaran iuran bulanan ditiadakan sementara oleh RT."
    );
  };

  const tambahWarga = (newWarga: Omit<Warga, "id">) => {
    setDaftarWarga((prev) => {
      const updated = [...prev, { ...newWarga, id: Date.now() }];
      saveToStorage("wl_daftarWarga", updated);
      return updated;
    });

    // Also automatically create a bill for this new household
    setTagihanList((prev) => {
      const exists = prev.some((t) => t.kk === newWarga.nama);
      if (exists) return prev;
      const updated = [
        ...prev,
        { id: Date.now() + 1, kk: newWarga.nama, tagihan: "Iuran Juni 2026", nominal: nominalIuran, status: "Belum" }
      ];
      saveToStorage("wl_tagihanList", updated);
      return updated;
    });

    tambahNotifikasi("Admin RT/RW", "Warga Baru Ditambahkan", `${newWarga.nama} terdaftar di RT ${newWarga.rt}.`);
  };

  const updateWarga = (id: number, updatedFields: Partial<Warga>) => {
    setDaftarWarga((prev) => {
      const updated = prev.map((w) => (w.id === id ? { ...w, ...updatedFields } : w));
      saveToStorage("wl_daftarWarga", updated);
      return updated;
    });
  };

  const hapusWarga = (id: number) => {
    setDaftarWarga((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      saveToStorage("wl_daftarWarga", updated);
      return updated;
    });
  };

  const tambahAduan = (judul: string, deskripsi: string, kategori: string, pemohon: string, foto?: string) => {
    setAduanList((prev) => {
      const updated = [
        {
          id: Date.now(),
          pemohon,
          judul,
          deskripsi,
          kategori,
          tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          status: "Diajukan" as const,
          foto
        },
        ...prev
      ];
      saveToStorage("wl_aduanList", updated);
      return updated;
    });
    tambahNotifikasi("Admin RT/RW", "Aduan Warga Baru", `${pemohon} melaporkan aduan: ${judul}.`);
  };

  const updateStatusAduan = (id: number, status: "Diajukan" | "Diproses" | "Selesai" | "Ditolak", tanggapan?: string) => {
    let targetPemohon = "Warga";
    let judulAduan = "";
    setAduanList((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          targetPemohon = a.pemohon;
          judulAduan = a.judul;
          return { ...a, status, tanggapan };
        }
        return a;
      });
      saveToStorage("wl_aduanList", updated);
      return updated;
    });
    tambahNotifikasi("Warga", "Status Aduan Diperbarui", `Aduan "${judulAduan}" Anda telah diperbarui menjadi: ${status}.`);
  };

  const tambahPengumuman = (judul: string, isi: string, tipe: string) => {
    setPengumumanList((prev) => {
      const updated = [
        {
          id: Date.now(),
          judul,
          tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          isi,
          tipe
        },
        ...prev
      ];
      saveToStorage("wl_pengumumanList", updated);
      return updated;
    });

    tambahNotifikasi("Warga", `Pengumuman RT: ${judul}`, isi.substring(0, 50) + "...");
  };

  const hapusPengumuman = (id: number) => {
    setPengumumanList((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveToStorage("wl_pengumumanList", updated);
      return updated;
    });
  };

  const ajukanSurat = (jenis: string, keperluan: string, catatan: string, pemohon: string) => {
    setSuratList((prev) => {
      const updated = [
        {
          id: Date.now(),
          pemohon,
          jenis,
          tanggal: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          status: "Menunggu",
          keperluan,
          catatan
        },
        ...prev
      ];
      saveToStorage("wl_suratList", updated);
      return updated;
    });

    tambahNotifikasi("Admin RT/RW", "Pengajuan Surat Baru", `${pemohon} mengajukan Surat ${jenis}.`);
  };

  const updateStatusSurat = (id: number, status: string, alasanPenolakan?: string) => {
    let targetPemohon = "Warga";
    let jenisSurat = "Pengantar";
    setSuratList((prev) => {
      const updated = prev.map((s) => {
        if (s.id === id) {
          targetPemohon = s.pemohon;
          jenisSurat = s.jenis;
          return { ...s, status, alasanPenolakan };
        }
        return s;
      });
      saveToStorage("wl_suratList", updated);
      return updated;
    });

    const notifMsg = status === "Ditolak"
      ? `Pengajuan Surat ${jenisSurat} Anda DITOLAK oleh RT. Alasan: ${alasanPenolakan || "-"}`
      : `Pengajuan Surat ${jenisSurat} Anda telah ${status.toUpperCase()} oleh RT.`;
    tambahNotifikasi("Warga", "Status Surat Diperbarui", notifMsg);
  };

  const bayarIuran = (kk: string, buktiBayar: string) => {
    setTagihanList((prev) => {
      const updated = prev.map((t) =>
        t.kk === kk ? { ...t, status: "Menunggu Verifikasi", buktiBayar } : t
      );
      saveToStorage("wl_tagihanList", updated);
      return updated;
    });

    tambahNotifikasi("Admin RT/RW", "Pembayaran Iuran Baru", `${kk} mengonfirmasi transfer iuran.`);
  };

  const verifikasiIuran = (id: number, status: "Lunas" | "Belum") => {
    let nominalAdded = 0;
    let targetKK = "";
    setTagihanList((prev) => {
      const updated = prev.map((t) => {
        if (t.id === id) {
          if (status === "Lunas") {
            nominalAdded = t.nominal;
          }
          targetKK = t.kk;
          return { ...t, status, buktiBayar: status === "Lunas" ? t.buktiBayar : undefined };
        }
        return t;
      });
      saveToStorage("wl_tagihanList", updated);
      return updated;
    });

    if (status === "Lunas" && nominalAdded > 0) {
      setTransaksiBulanan((prev) => {
        const updated = prev.map((t) =>
          t.name === "Jun" ? { ...t, pemasukan: t.pemasukan + nominalAdded } : t
        );
        saveToStorage("wl_transaksiBulanan", updated);
        return updated;
      });

      setTransaksiList((prev) => {
        const dateStr = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
        const updated = [
          {
            id: Date.now(),
            tipe: "pemasukan" as const,
            nominal: nominalAdded,
            keterangan: `Iuran Juni 2026 - ${targetKK}`,
            tanggal: dateStr
          },
          ...prev
        ];
        saveToStorage("wl_transaksiList", updated);
        return updated;
      });
    }

    tambahNotifikasi(
      "Warga",
      status === "Lunas" ? "Pembayaran Iuran Sukses" : "Pembayaran Iuran Ditolak",
      `Pembayaran Iuran Juni 2026 warga atas nama ${targetKK} dinyatakan ${status === "Lunas" ? "LUNAS" : "DITOLAK"}.`
    );
  };

  const pemasukanManual = (nominal: number, keterangan: string) => {
    setTransaksiBulanan((prev) => {
      const updated = prev.map((t) =>
        t.name === "Jun" ? { ...t, pemasukan: t.pemasukan + nominal } : t
      );
      saveToStorage("wl_transaksiBulanan", updated);
      return updated;
    });

    setTransaksiList((prev) => {
      const dateStr = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      const updated = [
        {
          id: Date.now(),
          tipe: "pemasukan" as const,
          nominal,
          keterangan,
          tanggal: dateStr
        },
        ...prev
      ];
      saveToStorage("wl_transaksiList", updated);
      return updated;
    });
  };

  const pengeneralanPengeluaran = (nominal: number, keterangan: string) => {
    setTransaksiBulanan((prev) => {
      const updated = prev.map((t) =>
        t.name === "Jun" ? { ...t, pengeluaran: t.pengeluaran + nominal } : t
      );
      saveToStorage("wl_transaksiBulanan", updated);
      return updated;
    });

    setTransaksiList((prev) => {
      const dateStr = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
      const updated = [
        {
          id: Date.now(),
          tipe: "pengeluaran" as const,
          nominal,
          keterangan,
          tanggal: dateStr
        },
        ...prev
      ];
      saveToStorage("wl_transaksiList", updated);
      return updated;
    });
  };

  const loginUser = (username: string, role: string, desc: string) => {
    const session = { username, role, desc };
    setCurrentUser(session);
    saveToStorage("wl_currentUser", session, true);
    saveToStorage("wl_currentUser", session, false);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem("wl_currentUser");
      localStorage.removeItem("wl_currentUser");
    } catch (e) {
      console.error("Error clearing user session", e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        nominalIuran,
        iuranAktif,
        daftarWarga,
        pengumumanList,
        suratList,
        tagihanList,
        transaksiBulanan,
        transaksiList,
        currentUser,
        notifications,
        setNominalIuran,
        setIuranAktif,
        tambahWarga,
        updateWarga,
        hapusWarga,
        tambahPengumuman,
        hapusPengumuman,
        ajukanSurat,
        updateStatusSurat,
        bayarIuran,
        verifikasiIuran,
        loginUser,
        logoutUser,
        pemasukanManual,
        pengeluaranManual: pengeneralanPengeluaran,
        tambahNotifikasi,
        markNotifikasiRead,
        clearAllNotifikasi,
        aduanList,
        tambahAduan,
        updateStatusAduan,
        isLoaded
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
