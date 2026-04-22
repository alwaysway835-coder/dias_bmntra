import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ExamResult, UserProfile } from '../types';
import { 
  BarChart3, 
  Search, 
  Download, 
  Filter, 
  ArrowUpRight, 
  TrendingUp, 
  User, 
  Calendar,
  Loader2,
  FileCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface RekapUjianProps {
  profile: UserProfile | null;
}

export default function RekapUjian({ profile }: RekapUjianProps) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'siswa' | 'karyawan'>('siswa');

  useEffect(() => {
    fetchResults();
  }, [filter]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('user_role', filter === 'siswa' ? 'siswa' : 'karyawan') // This is a simplified check
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Analytics Overview */}
      <section className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white border border-zinc-100 p-10 rounded-[3rem] shadow-sm flex flex-col justify-between">
            <div>
               <h3 className="text-xl font-black text-zinc-950 mb-2">Performance Overview</h3>
               <p className="text-zinc-500 font-medium text-sm">Statistik rata-rata nilai ujian {filter} periode ini.</p>
            </div>
            
            <div className="flex gap-10 items-end h-32 pt-10">
               {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                 <div key={i} className="flex-1 bg-zinc-100 rounded-t-xl group cursor-help relative">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      className={cn(
                        "w-full rounded-t-xl transition-all group-hover:bg-primary-dark",
                        h > 80 ? 'bg-primary' : 'bg-zinc-300'
                      )}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {h}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-zinc-950 text-white p-10 rounded-[3rem] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
               <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                  <TrendingUp className="w-6 h-6 text-primary" />
               </div>
               <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Rata-rata Sekolah</p>
               <h4 className="text-5xl font-black mb-2">82.4</h4>
               <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-bold">
                  <ArrowUpRight className="w-4 h-4" />
                  +4.2% dari bulan lalu
               </div>
            </div>
            <button className="relative z-10 w-full bg-white text-zinc-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform">
               Export Laporan Lengkap
            </button>
         </div>
      </section>

      {/* Main Table Section */}
      <section className="space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-zinc-100 p-1.5 rounded-[1.5rem] w-full md:w-auto">
               <button 
                 onClick={() => setFilter('siswa')}
                 className={cn(
                   "flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                   filter === 'siswa' ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-950'
                 )}
               >
                 Rekap Siswa
               </button>
               <button 
                 onClick={() => setFilter('karyawan')}
                 className={cn(
                   "flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                   filter === 'karyawan' ? 'bg-zinc-950 text-white shadow-xl' : 'text-zinc-500 hover:text-zinc-950'
                 )}
               >
                 Rekap Karyawan
               </button>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Cari Participant..."
                    className="w-full bg-white border border-zinc-200 pl-11 pr-4 py-3 rounded-[1.25rem] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  />
               </div>
               <button className="p-3 bg-white border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors text-zinc-500 hover:text-zinc-950">
                  <Download className="w-5 h-5" />
               </button>
            </div>
         </div>

         {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
               <Loader2 className="w-10 h-10 animate-spin text-primary" />
               <span className="text-zinc-400 font-black text-xs uppercase tracking-widest">Generate Laporan...</span>
            </div>
         ) : results.length === 0 ? (
            <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-20 flex flex-col items-center text-center gap-6">
               <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center text-zinc-200">
                  <FileCheck className="w-10 h-10" />
               </div>
               <div>
                  <p className="text-xl font-black text-zinc-950">Laporan Belum Terbit</p>
                  <p className="text-zinc-500 font-medium">Belum ada data nilai ujian yang masuk untuk kategori ini.</p>
               </div>
            </div>
         ) : (
           <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-zinc-50">
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Participant</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mata Ujian</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tanggal</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Skor</th>
                      <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                   {results.map((res) => (
                      <tr key={res.id} className="group hover:bg-zinc-50/50 transition-colors">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 font-bold group-hover:bg-primary group-hover:text-zinc-950 transition-all">
                                  <User className="w-5 h-5" />
                               </div>
                               <span className="font-black text-zinc-950">{res.user_id}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <p className="font-bold text-zinc-800 text-sm">Pemrograman Web XII</p>
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2 text-zinc-500">
                               <Calendar className="w-3.5 h-3.5" />
                               <span className="text-xs font-medium">{new Date(res.completed_at).toLocaleDateString('id-ID')}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-center">
                            <span className={cn(
                               "text-xl font-black",
                               res.score >= 75 ? 'text-emerald-500' : 'text-red-500'
                            )}>
                               {res.score}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <span className={cn(
                               "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                               res.score >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                            )}>
                               {res.score >= 75 ? 'Lulus' : 'Remedial'}
                            </span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
         )}
      </section>
    </div>
  );
}
