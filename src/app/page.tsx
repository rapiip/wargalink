"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { AppLogo } from "@/components/AppLogo";

const USERS: Record<string, { password: string; redirect: string; role: string; desc: string }> = {
  adminrt123: { password: "wargalink123", redirect: "/admin", role: "Admin RT/RW", desc: "Ketua RT 01 / RW 05" },
  warga123:   { password: "wargalink123", redirect: "/warga", role: "Warga",       desc: "Budi Santoso, RT 01" },
  pemda123:   { password: "wargalink123", redirect: "/pemda", role: "Pemda",       desc: "Dinas Kependudukan & Catatan Sipil" },
};

const ROLE_COLORS: Record<string, string> = {
  adminrt123: "from-blue-600 to-blue-800",
  warga123:   "from-emerald-500 to-emerald-700",
  pemda123:   "from-slate-700 to-slate-900",
};

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const detectedUser = USERS[username.toLowerCase().trim()];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = USERS[username.toLowerCase().trim()];

    if (!user || password !== user.password) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast.error("Username atau password salah.", {
        description: "Pastikan username dan password sudah benar.",
      });
      return;
    }

    setLoading(true);
    loginUser(username.toLowerCase().trim(), user.role, user.desc);
    
    toast.success(`Selamat datang, ${user.role}!`, {
      description: `Mengarahkan ke dashboard ${user.role}...`,
    });

    await new Promise((res) => setTimeout(res, 1200));
    router.push(user.redirect);
  };


  return (
    <div className="min-h-screen flex items-start justify-center px-4 pb-12 pt-14 sm:pt-16 lg:pt-20 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-[40%] right-[15%] w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <AppLogo
            priority
            className="mx-auto mb-4 h-20 w-24"
          />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">WargaLink</h1>
          <p className="text-slate-500 font-medium mt-1">Platform Digital Administrasi RT/RW</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-900/10 p-8 transition-all duration-300 ${shake ? "animate-shake" : ""}`}
          style={shake ? { animation: "shake 0.5s ease-in-out" } : {}}
        >
          <h2 className="text-xl font-bold text-slate-800 mb-1">Masuk ke Akun Anda</h2>
          <p className="text-sm text-slate-500 mb-6">Gunakan kredensial yang telah diberikan pengurus.</p>

          {/* Detected role badge */}
          <AnimatePresence>
            {detectedUser && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${ROLE_COLORS[username.toLowerCase().trim()]} text-white rounded-2xl px-4 py-3 flex items-center gap-3`}>
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    {detectedUser.role.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{detectedUser.role}</p>
                    <p className="text-xs text-white/80">{detectedUser.desc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Demo credentials hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demo Credentials</p>
          <div className="space-y-2">
            {[
              { user: "adminrt123", role: "Admin RT/RW", color: "bg-blue-100 text-blue-700" },
              { user: "warga123",   role: "Warga",       color: "bg-emerald-100 text-emerald-700" },
              { user: "pemda123",   role: "Pemda",       color: "bg-slate-100 text-slate-700" },
            ].map((c) => (
              <button
                key={c.user}
                type="button"
                onClick={() => { setUsername(c.user); setPassword("wargalink123"); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/80 transition-colors group text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${c.color}`}>{c.role}</span>
                  <span className="text-xs font-mono text-slate-500">{c.user}</span>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">Isi otomatis →</span>
              </button>
            ))}
            <p className="text-xs text-slate-400 text-center pt-1">Password: <span className="font-mono font-bold">wargalink123</span></p>
          </div>
        </motion.div>
      </div>

      {/* Shake animation style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
