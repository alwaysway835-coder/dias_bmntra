import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Monitor, 
  Palette, 
  Calculator, 
  Radio, 
  MessageSquare, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const jurusans = [
    { title: 'TKJ', desc: 'Teknik Komputer & Jaringan', icon: Monitor, color: 'text-blue-500 bg-blue-50' },
    { title: 'DKV', desc: 'Desain Komunikasi Visual', icon: Palette, color: 'text-purple-500 bg-purple-50' },
    { title: 'AK', desc: 'Akuntansi', icon: Calculator, color: 'text-green-500 bg-green-50' },
    { title: 'BC', desc: 'Broadcasting', icon: Radio, color: 'text-red-500 bg-red-50' },
    { title: 'MPLB', desc: 'Manajemen Perkantoran', icon: MessageSquare, color: 'text-amber-500 bg-amber-50' },
    { title: 'BD', desc: 'Bisnis Digital', icon: ShoppingBag, color: 'text-cyan-500 bg-cyan-50' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center font-bold text-primary text-xl">S</div>
          <span className="font-bold text-zinc-900 text-lg tracking-tight">SMK Prima Unggul</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <a href="#profil" className="hover:text-primary transition-colors">Profil</a>
          <a href="#jurusan" className="hover:text-primary transition-colors">Jurusan</a>
          <a href="#keunggulan" className="hover:text-primary transition-colors">Keunggulan</a>
          <Link to="/login" className="bg-zinc-950 text-white px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-all font-semibold flex items-center gap-2 group">
            Login Sistem
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 md:px-16 py-20 lg:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-8"
        >
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Official Exam Application
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-950 leading-[0.9] tracking-tighter mb-8"
        >
          MENCETAK GENERASI <br />
          <span className="text-zinc-400">UNGGUL & KOMPETEN.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-zinc-600 text-lg md:text-xl font-medium leading-relaxed mb-12"
        >
          SMK Prima Unggul adalah lembaga pendidikan vokasi yang berfokus pada pengembangan skill industri digital dan bisnis modern.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/login" className="bg-primary text-zinc-950 px-10 py-5 rounded-2xl shadow-2xl shadow-primary/30 font-black text-xl hover:scale-105 transition-transform">
            MULAI UJIAN SEKARANG
          </Link>
        </motion.div>
      </section>

      {/* Profil Section */}
      <section id="profil" className="px-8 md:px-16 py-24 bg-zinc-50 rounded-[4rem] mx-4 md:mx-12 border border-zinc-200">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary font-black uppercase tracking-widest text-sm mb-4 block">Tentang Kami</span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-950 leading-tight mb-6">Membangun Masa Depan Berbasis Kompetensi.</h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-8">
              SMK Prima Unggul telah berdiri sebagai pilar pendidikan menengah kejuruan yang adaptif terhadap perubahan zaman. Kami mengintegrasikan kurikulum industri dengan nilai-nilai karakter untuk menghasilkan lulusan yang siap kerja dan mandiri.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-zinc-200">
                <h3 className="text-3xl font-black text-primary mb-1">500+</h3>
                <p className="text-sm font-bold text-zinc-500 uppercase">Siswa Aktif</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-zinc-200">
                <h3 className="text-3xl font-black text-primary mb-1">50+</h3>
                <p className="text-sm font-bold text-zinc-500 uppercase">Mitra Industri</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-zinc-200 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://picsum.photos/seed/school/800/800" 
                  alt="School view" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="absolute -bottom-8 -left-8 bg-zinc-950 text-white p-8 rounded-3xl max-w-xs shadow-2xl -rotate-3">
                <p className="italic text-zinc-400 mb-4">"Visi kami adalah menjadi SMK rujukan nasional dalam pengembangan talenta digital."</p>
                <p className="font-bold">- Kepala Sekolah</p>
             </div>
          </div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section id="jurusan" className="px-8 md:px-16 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-zinc-950 tracking-tighter mb-6">PILIHAN JURUSAN</h2>
          <p className="text-zinc-500 font-medium">Temukan minat dan bakatmu di salah satu jurusan terbaik kami.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jurusans.map((jurusan, i) => (
            <motion.div 
              key={jurusan.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] border border-zinc-100 hover:border-primary/50 hover:bg-zinc-50 transition-all group"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", jurusan.color)}>
                <jurusan.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-zinc-950 mb-3">{jurusan.title}</h3>
              <p className="text-zinc-500 font-medium leading-relaxed">{jurusan.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keunggulan Section */}
      <section id="keunggulan" className="px-8 md:px-16 py-32 bg-zinc-950 text-white rounded-[5rem] mx-4 md:mx-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[10rem] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-black leading-tight mb-12">MENGAPA PILIH <br /><span className="text-primary">PRIMA UNGGUL?</span></h2>
            <div className="space-y-8">
              {[
                { title: 'Kurikulum Industri', desc: 'Materi pembelajaran disesuaikan dengan kebutuhan pasar kerja saat ini.', icon: Zap },
                { title: 'Fasilitas Lengkap', desc: 'Laboratorium modern dan area praktik yang representatif.', icon: ShieldCheck },
                { title: 'Lulusan Siap Kerja', desc: 'Program magang dan penyaluran kerja yang tertata rapi.', icon: CheckCircle2 },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <div className="h-64 bg-zinc-900 rounded-3xl overflow-hidden">
                  <img src="https://picsum.photos/seed/school1/600/600" alt="Activity" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                </div>
                <div className="h-48 bg-primary rounded-3xl flex items-center justify-center p-8 text-zinc-950">
                  <span className="text-4xl font-black">2026</span>
                </div>
             </div>
             <div className="space-y-4 pt-12">
                <div className="h-48 bg-zinc-800 rounded-3xl flex items-end p-8 border border-zinc-700">
                    <span className="text-2xl font-bold">Lokal & Modern</span>
                </div>
                <div className="h-64 bg-zinc-900 rounded-3xl overflow-hidden">
                  <img src="https://picsum.photos/seed/school2/600/800" alt="Activity" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 py-20 border-t border-zinc-100 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center font-bold text-primary text-lg">S</div>
              <span className="font-bold text-zinc-950 text-xl tracking-tight">SMK Prima Unggul</span>
            </div>
            <p className="text-zinc-500 text-sm">© 2026 SMK Prima Unggul. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-sm font-bold text-zinc-950 uppercase tracking-widest">
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
