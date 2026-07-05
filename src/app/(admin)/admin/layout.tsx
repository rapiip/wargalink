"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, Wallet, Bell, BarChart, LayoutDashboard, LogOut, Loader2, Menu, X, MessageSquare, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AppLogo } from "@/components/AppLogo";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { currentUser, isLoaded, logoutUser, notifications, markNotifikasiRead, clearAllNotifikasi, aduanList } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const adminNotifs = notifications.filter(
    (n) => n.targetRole === "Admin RT/RW" || n.targetRole === "All"
  );
  const unreadCount = adminNotifs.filter((n) => !n.read).length;
  const pendingAduanCount = aduanList ? aduanList.filter((a) => a.status === "Diajukan").length : 0;

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Data Warga", href: "/admin/warga", icon: Users },
    { name: "Surat Menyurat", href: "/admin/surat", icon: FileText },
    { name: "Iuran & Keuangan", href: "/admin/keuangan", icon: Wallet },
    { name: "Aduan Warga", href: "/admin/aduan", icon: MessageSquare, badge: true },
    { name: "Pengumuman", href: "/admin/pengumuman", icon: Bell },
    { name: "Laporan", href: "/admin/laporan", icon: BarChart },
  ];

  useEffect(() => {
    const storedTheme = localStorage.getItem("wl_theme") || "light";
    setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("wl_theme", nextTheme);
    toast.success(`Mode ${nextTheme === "dark" ? "Gelap" : "Terang"} diaktifkan.`);
  };

  // Active check — exact for /admin, startsWith for children
  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (isLoaded && (!currentUser || currentUser.role !== "Admin RT/RW")) {
      toast.error("Akses Ditolak", {
        description: "Silakan login sebagai Admin RT/RW terlebih dahulu.",
      });
      router.push("/");
    }
  }, [currentUser, isLoaded, router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logoutUser();
    toast.success("Berhasil keluar.");
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "Admin RT/RW") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Shared NavItem component
  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <ul className="space-y-1.5">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/30 translate-x-0"
                  : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-primary hover:translate-x-1"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                {item.name}
              </div>
              {item.badge && pendingAduanCount > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  active ? "bg-white text-primary" : "bg-red-500 text-white"
                }`}>
                  {pendingAduanCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`min-h-screen bg-transparent flex ${theme === "dark" ? "dark bg-slate-900" : "bg-slate-50"}`}>
      {theme === "dark" && (
        <style dangerouslySetInnerHTML={{ __html: `
          .dark {
            background-color: #0b0f19 !important;
          }
          .dark .bg-white, 
          .dark .bg-white\\/85,
          .dark .bg-white\\/80,
          .dark .bg-white\\/90,
          .dark .bg-white\\/95,
          .dark .bg-white\\/30,
          .dark .bg-white\\/40,
          .dark aside,
          .dark header,
          .dark .bg-slate-50\\/20,
          .dark .bg-slate-50\\/50 {
            background-color: #1e293b !important;
            color: #f8fafc !important;
            border-color: #334155 !important;
          }
          .dark .bg-slate-50 {
            background-color: #0f172a !important;
            color: #f8fafc !important;
          }
          .dark .text-slate-900, 
          .dark .text-slate-800, 
          .dark .text-slate-700,
          .dark .text-slate-650,
          .dark .text-slate-600 {
            color: #f1f5f9 !important;
          }
          .dark .text-slate-500, 
          .dark .text-slate-400 {
            color: #94a3b8 !important;
          }
          .dark .border-slate-100, 
          .dark .border-slate-200, 
          .dark .border {
            border-color: #334155 !important;
          }
          .dark input, 
          .dark select, 
          .dark textarea {
            background-color: #0f172a !important;
            color: #f8fafc !important;
            border-color: #334155 !important;
          }
          .dark select option {
            background-color: #1e293b !important;
            color: #f8fafc !important;
          }
          .dark .hover\\:bg-slate-50:hover,
          .dark .hover\\:bg-white:hover {
            background-color: #334155 !important;
            color: #f8fafc !important;
          }
          .dark table, 
          .dark tr,
          .dark th,
          .dark td {
            border-color: #334155 !important;
            color: #f1f5f9 !important;
          }
          .dark table th {
            background-color: #0f172a !important;
            color: #94a3b8 !important;
          }
          .dark .bg-blue-50 {
            background-color: rgba(30, 58, 138, 0.3) !important;
            color: #93c5fd !important;
            border-color: rgba(30, 58, 138, 0.5) !important;
          }
          .dark .text-primary {
            color: #60a5fa !important;
          }
          .dark .bg-primary {
            background-color: #2563eb !important;
            color: white !important;
          }
          .dark .text-slate-800 {
            color: #f1f5f9 !important;
          }
        ` }} />
      )}
      {/* Desktop Floating Sidebar */}
      <div className="hidden md:flex flex-col w-72 p-4 pr-0">
        <aside className="flex-1 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 rounded-3xl flex flex-col overflow-hidden">
          <div className="h-20 flex items-center px-8 border-b border-white/50 bg-white/40">
            <AppLogo className="mr-3 h-9 w-10 rounded-lg shadow-md ring-1 ring-slate-200/70" />
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">WargaLink</span>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ml-4">Menu Utama</p>
            <NavLinks />
          </nav>
          <div className="p-4 border-t border-white/50 bg-white/30">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-white border-r border-slate-200">
          <SheetHeader className="h-20 flex flex-row items-center px-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <AppLogo className="mr-3 h-9 w-10 rounded-lg shadow-md ring-1 ring-slate-200/70" />
            <SheetTitle className="text-xl font-extrabold text-slate-800 tracking-tight">WargaLink</SheetTitle>
          </SheetHeader>
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 ml-4">Menu Utama</p>
            <NavLinks onNavigate={() => setSidebarOpen(false)} />
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
            <button
              onClick={(e) => { setSidebarOpen(false); handleLogout(e); }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 m-4 mb-0 bg-white/80 backdrop-blur-xl border border-white/60 shadow-sm rounded-3xl flex items-center justify-between px-6 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2.5 text-slate-500 bg-white hover:text-primary shadow-sm border border-slate-100 rounded-full transition-all hover:shadow-md"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight md:hidden">RT 01 / RW 05</h1>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden md:block">Dashboard RT 01 / RW 05</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 bg-white hover:text-primary shadow-sm border border-slate-100 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
              aria-label="Toggle Tema"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="relative">
              <button
                className="p-2.5 text-slate-500 bg-white hover:text-primary shadow-sm border border-slate-100 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 relative"
                onClick={() => setShowNotif(!showNotif)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-2xl p-4 z-50 text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">Notifikasi</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => { clearAllNotifikasi("Admin RT/RW"); toast.success("Semua notifikasi ditandai dibaca."); }}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {adminNotifs.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Belum ada notifikasi.</p>
                    ) : (
                      adminNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => { markNotifikasiRead(n.id); setShowNotif(false); }}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer text-xs ${
                            n.read ? "bg-slate-50 text-slate-500" : "bg-blue-50/50 text-slate-800 font-medium hover:bg-blue-50 border-l-2 border-primary"
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
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Bapak RT</p>
                <p className="text-xs text-slate-500">{currentUser.desc}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md ring-2 ring-white">
                RT
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
