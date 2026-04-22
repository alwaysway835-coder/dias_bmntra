import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Gagal login. Silakan periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex font-sans overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

      {/* Left Decoration (Desktop) */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-16 relative z-10">
        <Link to="/" className="flex items-center gap-3 group text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm uppercase tracking-widest">Kembali ke Beranda</span>
        </Link>

        <div>
          <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8 max-w-md">
            SISTEM <br />
            <span className="text-primary italic font-light font-serif">UJIAN TERPADU.</span>
          </h2>
          <p className="text-zinc-500 text-lg max-w-sm font-medium">
            Masuk untuk mengakses dasbor ujian, rekap nilai, dan manajemen akademik.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-zinc-950 text-2xl">S</div>
          <div>
            <p className="text-white font-bold tracking-tight">SMK Prima Unggul</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Exam Center</p>
          </div>
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 lg:flex-none lg:w-[500px] bg-zinc-900 border-l border-zinc-800 p-8 md:p-16 flex flex-col justify-center relative z-10">
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
           className="w-full max-w-md mx-auto"
        >
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-zinc-950 text-xl">S</div>
            <span className="font-bold text-white text-xl tracking-tight">ExamPro</span>
          </div>

          <header className="mb-10">
            <h1 className="text-3xl font-black text-white mb-3">Selamat Datang</h1>
            <p className="text-zinc-500 font-medium">Silakan login dengan kredensial yang diberikan admin.</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex gap-3 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Email Karyawan / Siswa</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-zinc-700" 
                  placeholder="name@primaunggul.sch.id"
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Lupa Password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-zinc-700" 
                  placeholder="••••••••"
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-zinc-950 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  MENDATA SESI...
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  MASUK KE SISTEM
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-zinc-600 text-sm font-medium">
            Butuh bantuan akses? <br />
            <span className="text-zinc-400">Hubungi Tenaga Kependidikan SMK Prima Unggul</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
