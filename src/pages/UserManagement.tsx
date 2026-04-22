import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Shield, 
  Trash2, 
  Edit2, 
  Mail,
  UserPlus,
  Loader2,
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface UserManagementProps {
  profile: UserProfile | null;
}

export default function UserManagement({ profile }: UserManagementProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'tenaga_kependidikan' as UserRole
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      // 1. Create Auth User (Note: In production this should be handled by a secure Edge Function)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          }
        }
      });

      if (authError) throw authError;

      // 2. The profile is usually created by a trigger in Supabase, 
      // but let's update the role manually if needed or if trigger isn't set.
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: formData.role })
          .eq('id', authData.user.id);
        
        if (profileError) {
          // If update fails, maybe trigger hasn't finished yet or record doesn't exist
          // Let's try to upsert as fallback
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            email: formData.email,
            full_name: formData.full_name,
            role: formData.role
          });
        }
      }

      setIsModalOpen(false);
      setFormData({ email: '', password: '', full_name: '', role: 'tenaga_kependidikan' });
      fetchUsers();
    } catch (error: any) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setIsDeleting(id);
    try {
      // In a real app with Supabase, you can't delete auth users from client SDK.
      // You need a service role in an Edge Function.
      // For now, we delete from the public profiles table as a simulation.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-zinc-100 border border-zinc-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <h2 className="text-2xl font-black text-zinc-950 mb-1">Manajemen Pengguna</h2>
           <p className="text-zinc-500 font-medium">Kelola akses guru, admin, dan tenaga kependidikan.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Cari user (nama/email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-zinc-950 px-6 py-3 rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 shrink-0"
          >
            <UserPlus className="w-5 h-5" />
            USER BARU
          </button>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <Loader2 className="w-10 h-10 animate-spin text-primary" />
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm"> Sinkronisasi Data...</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pengguna</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dibuat Pada</th>
                <th className="px-8 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-zinc-400 font-medium">Tidak ada pengguna ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className="w-11 h-11 bg-zinc-100 rounded-2xl flex items-center justify-center font-black text-zinc-400 text-lg group-hover:bg-primary group-hover:text-zinc-950 transition-all">
                            {u.full_name.charAt(0)}
                         </div>
                         <div>
                            <p className="font-black text-zinc-950 leading-tight">{u.full_name}</p>
                            <p className="text-xs text-zinc-500 font-medium">{u.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                       <span className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                         u.role === 'admin' ? "bg-orange-50 text-orange-600" :
                         u.role === 'guru' ? "bg-blue-50 text-blue-600" :
                         "bg-emerald-50 text-emerald-600"
                       )}>
                         <Shield className="w-3 h-3" />
                         {u.role.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-500 font-medium">
                       {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-zinc-950">
                             <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={isDeleting === u.id || u.id === profile?.id}
                            className="p-2 hover:bg-red-50 rounded-xl transition-colors text-zinc-400 hover:text-red-600 disabled:opacity-50"
                          >
                             {isDeleting === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal User Baru */}
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <header className="flex justify-between items-start mb-8">
                   <div>
                      <h3 className="text-2xl font-black text-zinc-950">Tambah User Baru</h3>
                      <p className="text-zinc-500 font-medium text-sm">Akun akan tersinkronisasi dengan Supabase Auth.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-950">
                      <X className="w-6 h-6" />
                   </button>
                </header>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  {formError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex gap-3 text-sm font-bold border border-red-100">
                       <AlertTriangle className="w-5 h-5 shrink-0" />
                       {formError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Contoh: Budi Santoso, S.Kom"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                      <div className="relative group">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                         <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@exam.com"
                            className="w-full bg-zinc-50 border border-zinc-200 pl-11 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                          />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Role Utama</label>
                      <select 
                        className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold appearance-none hover:bg-zinc-100/50 cursor-pointer"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                      >
                        <option value="tenaga_kependidikan">Tenaga Kependidikan</option>
                        <option value="guru">Guru Pengajar</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Password Inisial</label>
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Min. 6 karakter"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    />
                  </div>

                  <button 
                    disabled={formLoading}
                    className="w-full bg-primary text-zinc-950 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50"
                  >
                    {formLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle className="w-6 h-6" />}
                    SIMPAN DATA USER
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
