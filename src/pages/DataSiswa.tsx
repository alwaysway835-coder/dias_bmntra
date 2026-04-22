import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { Student, UserProfile } from '../types';
import { 
  Plus, 
  Search, 
  GraduationCap, 
  Trash2, 
  Edit2, 
  UserPlus, 
  X, 
  CheckCircle, 
  Loader2,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DataSiswaProps {
  profile: UserProfile | null;
}

export default function DataSiswa({ profile }: DataSiswaProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    nis: '',
    name: '',
    class_name: 'X'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('class_name', { ascending: true });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
       console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { error } = await supabase.from('students').insert([formData]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ nis: '', name: '', class_name: 'X' });
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus data siswa ini?')) return;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      setStudents(students.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-zinc-950 shadow-xl shadow-emerald-500/20">
              <GraduationCap className="w-8 h-8" />
           </div>
           <div>
              <h2 className="text-2xl font-black text-zinc-950 mb-1">Database Siswa</h2>
              <p className="text-emerald-700 font-medium">Data NIS dan Kelas SMK Prima Unggul.</p>
           </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input 
              type="text" 
              placeholder="Cari NIS / Nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-emerald-200 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-zinc-950 text-white px-6 py-3 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-zinc-950/20 shrink-0 group"
          >
            <UserPlus className="w-5 h-5 group-hover:text-primary" />
            SISWA BARU
          </button>
        </div>
      </div>

      {loading ? (
         <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-zinc-400 font-black uppercase text-xs tracking-widest">Memuat database...</span>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <motion.div 
              layout
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-zinc-100 p-6 rounded-[2rem] hover:border-primary/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center font-black text-zinc-400 text-lg group-hover:bg-primary group-hover:text-zinc-950 transition-all">
                    {student.name.charAt(0)}
                 </div>
                 <div className="flex gap-1">
                    <button className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-zinc-950 transition-colors">
                       <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id)}
                      className="p-2 hover:bg-red-50 rounded-xl text-zinc-400 hover:text-red-600 transition-colors"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
              <h3 className="font-black text-zinc-950 mb-1 group-hover:text-primary transition-colors">{student.name}</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">NIS: {student.nis}</p>
              <div className="flex items-center gap-2">
                 <span className="bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                    KELAS: {student.class_name}
                 </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <header className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="text-2xl font-black text-zinc-950">Input Siswa Baru</h3>
                      <p className="text-zinc-500 font-medium text-sm">Tambahkan data siswa ke database akademik.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-950">
                      <X className="w-6 h-6" />
                   </button>
                </header>

                <form onSubmit={handleAddStudent} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nomor Induk Siswa (NIS)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nis}
                      onChange={e => setFormData({ ...formData, nis: e.target.value })}
                      placeholder="Contoh: 212210001"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold tracking-widest"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Masukkan nama sesuai ijazah"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Kelas / Tingkat</label>
                    <select 
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold appearance-none hover:bg-zinc-100/50 cursor-pointer"
                      value={formData.class_name}
                      onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                    >
                      <option value="X">Kelas X (Sepuluh)</option>
                      <option value="XI">Kelas XI (Sebelas)</option>
                      <option value="XII">Kelas XII (Duabelas)</option>
                    </select>
                  </div>

                  <button 
                    disabled={formLoading}
                    className="w-full bg-zinc-950 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-50"
                  >
                    {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6 text-primary" />}
                    SIMPAN DATA SISWA
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
