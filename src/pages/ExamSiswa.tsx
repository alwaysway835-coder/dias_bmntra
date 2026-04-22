import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Exam, UserProfile } from '../types';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Loader2, 
  Users, 
  Clock, 
  Trash2, 
  Edit2, 
  FileText,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface ExamSiswaProps {
  profile: UserProfile | null;
}

export default function ExamSiswa({ profile }: ExamSiswaProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const canManage = profile?.role === 'admin' || profile?.role === 'guru';

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('category', 'siswa')
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
      <div className="bg-zinc-950 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#10B98120_0%,transparent_50%)]" />
        
        <div className="relative z-10">
           <h2 className="text-3xl font-black mb-2 tracking-tight">Manajemen Ujian Siswa</h2>
           <p className="text-zinc-400 font-medium max-w-lg">Pantau, buat, dan kelola seluruh instrumen evaluasi akademik untuk seluruh kompetensi keahlian.</p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Cari Mata Pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          {canManage && (
            <button className="bg-primary text-zinc-950 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] transition-transform shrink-0">
               <Plus className="w-5 h-5" />
               BUAT UJIAN
            </button>
          )}
        </div>
      </div>

      {loading ? (
         <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-zinc-400 font-black text-xs uppercase tracking-widest">Sinkronisasi Modul...</span>
         </div>
      ) : (
        <div className="space-y-6">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                 <Filter className="w-4 h-4 text-zinc-400" />
                 <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Semua Kelas</span>
              </div>
              <p className="text-xs font-bold text-zinc-400">Menampilkan {exams.length} Ujian</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exams.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-zinc-50 border border-zinc-200 rounded-[2.5rem]">
                   <p className="text-zinc-500 font-medium">Belum ada modul ujian siswa yang dibuat.</p>
                </div>
              ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="bg-white border border-zinc-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 hover:border-primary/40 transition-all group">
                     <div className="w-20 h-20 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <FileText className="w-10 h-10 text-zinc-300 group-hover:text-primary" />
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-xl font-black text-zinc-950 group-hover:text-primary transition-colors">{exam.title}</h3>
                              <p className="text-sm font-medium text-zinc-500 leading-relaxed">{exam.description || 'Tidak ada deskripsi.'}</p>
                           </div>
                           <div className="flex gap-1">
                              <button className="p-2 hover:bg-zinc-50 rounded-xl text-zinc-400 hover:text-zinc-950 transition-colors"><Edit2 className="w-4 h-4" /></button>
                              <button className="p-2 hover:bg-red-50 rounded-xl text-zinc-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-50">
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full">
                              <Users className="w-3 h-3 text-zinc-400" />
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Semua Jurusan</span>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">90 Menit</span>
                           </div>
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full">
                              <FileText className="w-3 h-3 text-zinc-400" />
                              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">40 Soal Terdaftar</span>
                           </div>
                        </div>
                        
                        <div className="pt-4">
                           <button className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all group/btn">
                              Kelola Bank Soal 
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      )}
    </div>
  );
}
