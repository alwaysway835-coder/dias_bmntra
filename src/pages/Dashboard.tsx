import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  FileCheck, 
  TrendingUp, 
  Calendar,
  Clock,
  ChevronRight,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: UserProfile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const isSiswa = profile?.role === 'siswa';

  const stats = isSiswa ? [
    { label: 'Ujian Tersedia', value: '5', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ujian Selesai', value: '8', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rata-rata Nilai', value: '78.2', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Peringkat Kelas', value: '12', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ] : [
    { label: 'Ujian Aktif', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Siswa', value: '840', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ujian Selesai', value: '3,240', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Rata-rata Nilai', value: '84.5', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-6 bg-zinc-950 p-10 rounded-[2.5rem] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black mb-2 tracking-tight"
          >
            {isSiswa ? `Apa kabar, ${profile?.full_name?.split(' ')[0]}?` : `Halo, ${profile?.full_name?.split(' ')[0] || 'User'}! 👋`}
          </motion.h1>
          <p className="text-zinc-400 font-medium text-lg">
            {isSiswa 
              ? `Jurusan: ${profile?.jurusan || '-'} • Siapkan diri Anda untuk ujian hari ini.`
              : 'Selamat datang kembali di pusat kendali akademik SMK Prima Unggul.'}
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Hari Ini</p>
                <p className="text-xs font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Waktu Server</p>
                <p className="text-xs font-bold">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-zinc-200 p-6 rounded-[2rem] flex items-center gap-5 hover:shadow-xl hover:shadow-zinc-200/50 transition-all cursor-pointer group"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-zinc-950">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Recent Exams or Activities */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black text-zinc-950 flex items-center gap-2">
               {isSiswa ? 'Jadwal Ujian Saya' : 'Ujian Terjadwal'}
               <span className="bg-primary/20 text-primary-dark text-xs px-2 py-1 rounded-full font-black uppercase">Live</span>
            </h3>
            <button className="text-sm font-bold text-zinc-500 hover:text-zinc-950 transition-colors flex items-center gap-1 group">
              Lihat Semua
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { id: '1', title: 'Pemrograman Web Madya', date: '22 Apr', time: '08:00', type: 'Siswa', class: 'XII TKJ 1' },
              { id: '2', title: 'Manajemen Keuangan Dasar', date: '22 Apr', time: '10:30', type: 'Siswa', class: 'XII AK 2' },
              { id: '3', title: 'Visi Misi Yayasan 2026', date: '23 Apr', time: '09:00', type: 'Karyawan', class: 'Semua Staff' },
            ].map((exam) => (
              <div key={exam.id} className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center justify-between hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex flex-col items-center justify-center text-zinc-400 font-black">
                      <span className="text-[10px] leading-tight uppercase">{exam.date.split(' ')[1]}</span>
                      <span className="text-lg leading-tight text-zinc-950">{exam.date.split(' ')[0]}</span>
                   </div>
                   <div>
                      <h4 className="font-black text-zinc-950 group-hover:text-primary transition-colors">{exam.title}</h4>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{exam.class} • {exam.time} WIB</p>
                   </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                  exam.type === 'Siswa' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                )}>
                  {exam.type}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Info/Quick Actions */}
        <section className="space-y-10">
          {/* Quick Info */}
          <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem]">
            <h4 className="text-lg font-black text-emerald-950 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              {isSiswa ? 'Panduan Ujian' : 'Info Sistem'}
            </h4>
            <div className="space-y-4 text-emerald-800 text-sm font-medium leading-relaxed">
              <p>
                {isSiswa 
                  ? 'Gunakan perangkat yang stabil. Jangan menutup tab ujian sebelum selesai menekan tombol kirim.' 
                  : 'Sistem ujian sedang dalam performa optimal. Pastikan sinkronisasi database tetap terjaga.'}
              </p>
              <div className="bg-white/50 p-4 rounded-xl border border-emerald-200">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-1">Standard Kelulusan</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-bold font-mono">KKM Minimum: 50.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Guide */}
          <div className="bg-zinc-100 p-8 rounded-[2.5rem] border border-zinc-200">
             <h4 className="text-lg font-black text-zinc-950 mb-2">Bantuan Cepat</h4>
             <p className="text-xs font-medium text-zinc-500 mb-6">Butuh panduan penggunaan dashboard?</p>
             <button className="w-full bg-white border border-zinc-200 py-3 rounded-2xl font-bold text-zinc-800 hover:bg-zinc-50 transition-colors">
                Buka Dokumentasi
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
