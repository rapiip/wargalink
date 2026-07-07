"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { useApp, Pengumuman } from "@/context/AppContext";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function WargaPengumuman() {
  const { pengumumanList } = useApp();
  const [selectedPengumuman, setSelectedPengumuman] = useState<Pengumuman | null>(null);

  const renderIllustration = (tipe: string) => {
    const gradients = {
      Penting: "from-red-400 to-rose-600",
      Agenda: "from-blue-400 to-indigo-600",
      Info: "from-emerald-400 to-teal-600",
    };
    const gradient = gradients[tipe as "Penting" | "Agenda" | "Info"] || "from-slate-400 to-slate-600";
    
    return (
      <div className={`h-24 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        {/* Abstract circles */}
        <div className="absolute top-[-20%] left-[-10%] w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-16 h-16 bg-black/10 rounded-full blur-lg" />
        
        {/* Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white/80 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          {tipe === "Penting" && (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          )}
          {tipe === "Agenda" && (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          )}
          {tipe === "Info" && (
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Info & Agenda RT</h2>
        <p className="text-sm text-slate-500">Papan pengumuman digital dari pengurus RT.</p>
      </div>

      <div className="space-y-4 pb-12">
        {pengumumanList.length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-slate-50/60">
            <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
              <Calendar className="w-7 h-7 text-emerald-400" />
            </div>
            <p className="text-sm font-bold text-slate-700">Belum ada pengumuman</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[16rem] mx-auto leading-relaxed">Pengurus RT belum menerbitkan pengumuman. Cek kembali nanti untuk info & agenda terbaru.</p>
          </div>
        )}
        {pengumumanList.map((p) => (
          <Card 
            key={p.id} 
            className="overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]"
            onClick={() => setSelectedPengumuman(p)}
          >
            {renderIllustration(p.tipe || "Info")}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-slate-800 font-bold leading-tight">{p.judul}</CardTitle>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  p.tipe === "Penting" ? "bg-red-50 text-red-700 border-red-200" :
                  p.tipe === "Agenda" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}>
                  {p.tipe || "Info"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{p.tanggal}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{p.isi}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog Detail Pengumuman */}
      <Dialog open={selectedPengumuman !== null} onOpenChange={(open) => !open && setSelectedPengumuman(null)}>
        <DialogContent className="sm:max-w-md w-[90%] rounded-2xl bg-white p-0 overflow-hidden">
          {selectedPengumuman && (
            <div>
              {renderIllustration(selectedPengumuman.tipe || "Info")}
              <div className="p-6 space-y-4">
                <DialogHeader>
                  <div className="flex justify-between items-start gap-4">
                    <DialogTitle className="text-xl font-bold text-slate-800 leading-tight">
                      {selectedPengumuman.judul}
                    </DialogTitle>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                      selectedPengumuman.tipe === "Penting" ? "bg-red-50 text-red-700 border-red-200" :
                      selectedPengumuman.tipe === "Agenda" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}>
                      {selectedPengumuman.tipe || "Info"}
                    </span>
                  </div>
                  <DialogDescription className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedPengumuman.tanggal} · Rukun Tetangga 01</span>
                  </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
                  {selectedPengumuman.isi}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

