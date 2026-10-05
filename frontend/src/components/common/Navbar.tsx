/*
  =====================================================
  NAVBAR - components/common/Navbar.tsx (shadcn/ui)
  =====================================================
*/

import { LogOut, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Logo y marca */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-100">
            Task<span className="text-indigo-400">Flow</span>
          </span>
        </div>

        {/* Información de usuario & logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-200">{user?.nombre}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
