"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Wallet, Bell, User } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppLogo } from "@/components/AppLogo";
import { Skeleton } from "@/components/ui/skeleton";

function WargaSkeleton() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white">
      <div className="bg-gradient-to-br from-blue-700 via-primary to-blue-900 p-8 pb-16 rounded-b-[2.5rem]">
        <Skeleton className="h-7 w-48 bg-white/20 mb-2" />
        <Skeleton className="h-4 w-36 bg-white/20" />
      </div>
      <div className="px-5 -mt-8 space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function WargaLayout({ children }: { children: ReactNode }) {
  const { currentUser, isLoaded, notifications, markNotifikasiRead, clearAllNotifikasi } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);

  const navigation = [
    { name: "Beranda", href: "/warga", icon: Home },
    { name: "Surat", href: "/warga/surat", icon: FileText },
    { name: "Iuran", href: "/warga/iuran", icon: Wallet },
    { name: "Info", href: "/warga/pengumuman", icon: Bell },
    { name: "Profil", href: "/warga/profil", icon: User },
  ];

  // Active check — exact for /warga, startsWith for children
  const isActive = (href: string) => {
    if (href === "/warga") return pathname === "/warga";
    return pathname.startsWith(href);
  };

  const wargaNotifs = notifications.filter(
    (n) => n.targetRole === "Warga" || n.targetRole === "All"
  );
  const unreadCount = wargaNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    if (isLoaded && (!currentUser || currentUser.role !== "Warga")) {
      toast.error("Akses Ditolak", {
        description: "Silakan login sebagai Warga terlebih dahulu.",
      });
      router.push("/");
    }
  }, [currentUser, isLoaded, router]);

  if (!isLoaded) {
    return <WargaSkeleton />;
  }

  if (!currentUser || currentUser.role !== "Warga") {
    return <WargaSkeleton />;
  }

  const pemohonNama = currentUser.desc.split(",")[0].trim();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto shadow-2xl shadow-blue-900/10 relative bg-slate-50">
      {/* Notification Panel Overlay */}
      {showNotif && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowNotif(false)}
        />
      )}

      {/* Floating Notification Panel */}
      {showNotif && (
        <div className="fixed top-20 right-4 w-72 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 z-50 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-800 text-sm">Notifikasi</span>
            {unreadCount > 0 && (
              <button
                onClick={() => { clearAllNotifikasi("Warga"); toast.success("Semua notifikasi ditandai dibaca."); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                Tandai dibaca
              </button>
            )}
          </div>
          <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
            {wargaNotifs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada notifikasi.</p>
            ) : (
              wargaNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => { markNotifikasiRead(n.id); setShowNotif(false); }}
                  className={`p-2.5 rounded-xl transition-colors cursor-pointer text-xs ${
                    n.read
                      ? "bg-slate-50 text-slate-500"
                      : "bg-blue-50/50 text-slate-800 font-medium hover:bg-blue-50 border-l-2 border-primary"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold">{n.title}</span>
                    <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <AppLogo className="h-7 w-8" />
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">WargaLink</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-10 h-10 flex items-center justify-center text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-all"
            aria-label="Buka notifikasi"
            aria-expanded={showNotif}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <Link href="/warga/profil" className="flex items-center gap-2" aria-label="Profil saya">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow ring-2 ring-white">
              {pemohonNama.charAt(0)}
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-28">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 max-w-[calc(28rem-2rem)] mx-auto h-16 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl shadow-blue-900/10 rounded-2xl flex items-center justify-around px-1 z-30" aria-label="Navigasi utama">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 rounded-xl transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {/* Active indicator pill */}
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                active ? "bg-blue-50" : ""
              }`}>
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? "scale-110" : ""}`} />
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-all ${active ? "text-primary" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
