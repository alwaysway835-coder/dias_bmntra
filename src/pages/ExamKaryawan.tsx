import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Exam, UserProfile } from '../types';
import { 
  FileText, 
  Clock, 
  Play, 
  Search, 
  Loader2, 
  Trophy,
  History,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ExamKaryawanProps {
  profile: UserProfile | null;
}

export default function ExamKaryawan({ profile }: ExamKaryawanProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('category', 'karyawan')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-2 border-b border-zinc-200">
        <div>
           <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Ujian Mandiri Karyawan</h2>
           <p className="text-zinc-500 font-medium mt-1">Ukur kompetensi Anda secara berkala untuk pengembangan karir.</p>
        </div>
        <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
           <button 
             onClick={() => setActiveTab('available')}
             className={cn(
               "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
               activeTab === 'available' ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"
             )}
           >
             <Play className="w-4 h-4" />
             Ujian Tersedia
           </button>
           <button 
             onClick={() => setActiveTab('history')}
             className={cn(
               "px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
               activeTab === 'history' ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-950"
             )}
           >
             <History className="w-4 h-4" />
             Riwayat Saya
           </button>
        </div>
      </div>

      {activeTab === 'available' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-zinc-400 font-black text-xs uppercase">Menyiapkan daftar ujian...</span>
             </div>
          ) : exams.length === 0 ? (
            <div className="col-span-full bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[2.5rem] py-20 flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 bg-white border border-zinc-200 rounded-[1.5rem] flex items-center justify-center text-zinc-300">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-zinc-950 font-black text-xl">Belum Ada Ujian</p>
                  <p className="text-zinc-500 font-medium">Hubungi admin untuk ketersediaan modul ujian baru.</p>
               </div>
            </div>
          ) : (
            exams.map((exam) => (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 text-zinc-400 group-hover:bg-primary group-hover:text-zinc-950 transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-950 mb-2 group-hover:text-primary transition-colors">{exam.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-8">{exam.description}</p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between py-4 border-y border-zinc-50">
                      <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-zinc-400" />
                         <span className="text-xs font-bold text-zinc-600">60 Menit</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Trophy className="w-4 h-4 text-zinc-400" />
                         <span className="text-xs font-bold text-zinc-600">KKM: 75</span>
                      </div>
                   </div>
                   <button className="w-full bg-zinc-950 text-white p-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors">
                      <Play className="w-5 h-5 text-primary" />
                      MULAI UJIAN
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-6">
           <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <History className="w-10 h-10" />
           </div>
           <div>
              <p className="text-2xl font-black text-zinc-950">Sejarah Ujian Kosong</p>
              <p className="text-zinc-500 font-medium max-w-sm">Anda belum pernah menyelesaikan ujian kompetensi karyawan apapun di sistem ini.</p>
           </div>
           <button 
             onClick={() => setActiveTab('available')}
             className="bg-zinc-950 text-white px-8 py-4 rounded-2xl font-black text-sm"
           >
             CARI UJIAN PERTAMA SAYA
           </button>
        </div>
      )}

      {/* Security Tip */}
      <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] flex gap-6 items-start">
         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shrink-0 border border-orange-200">
            <AlertCircle className="w-6 h-6" />
         </div>
         <div>
            <h4 className="text-lg font-black text-orange-950 mb-1">Peringatan Keamanan</h4>
            <p className="text-orange-800/80 text-sm font-medium leading-relaxed">
              Dilarang keras menyalin, memotret, atau menyebarkan konten ujian ke pihak manapun. Sistem mencatat jejak digital setiap sesi ujian untuk keperluan audit kompetensi internal.
            </p>
         </div>
      </div>
    </div>
  );
}
