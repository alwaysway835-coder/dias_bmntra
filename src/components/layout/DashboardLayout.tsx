import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { UserProfile } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  GraduationCap, 
  Users, 
  UserCog, 
  LogOut,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface DashboardLayoutProps {
  profile: UserProfile | null;
}

export default function DashboardLayout({ profile }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      path: '/app', 
      icon: LayoutDashboard,
      roles: ['admin', 'guru', 'tenaga_kependidikan']
    },
    { 
      label: 'Ujian Karyawan', 
      path: '/app/ujian-karyawan', 
      icon: FileText,
      roles: ['admin', 'guru', 'tenaga_kependidikan']
    },
    { 
      label: 'Ujian Siswa', 
      path: '/app/ujian-siswa', 
      icon: GraduationCap,
      roles: ['admin', 'guru']
    },
    { 
      label: 'Data Siswa', 
      path: '/app/data-siswa', 
      icon: Users,
      roles: ['admin']
    },
    { 
      label: 'Rekap Ujian', 
      path: '/app/rekap-ujian', 
      icon: ClipboardList,
      roles: ['admin', 'guru']
    },
    { 
      label: 'User Management', 
      path: '/app/user-management', 
      icon: UserCog,
      roles: ['admin']
    },
  ];

  const filteredMenu = menuItems.filter(item => profile && item.roles.includes(profile.role));

  return (
    <div className="min-h-screen flex bg-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-zinc-950 text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">ExamPro</h1>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Prima Unggul</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                  isActive 
                    ? "bg-primary text-zinc-950 shadow-lg shadow-primary/20" 
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-zinc-950" : "group-hover:text-primary")} />
                {item.label}
                {isActive && <motion.div layoutId="active-pill" className="ml-auto"><ChevronRight className="w-4 h-4" /></motion.div>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold text-zinc-300">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[10px] text-zinc-500 capitalize">{profile?.role?.replace('_', ' ') || 'Role'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-zinc-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors bg-zinc-100 hover:bg-red-50 px-4 py-2 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
