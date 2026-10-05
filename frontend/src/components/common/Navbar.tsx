
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
    <nav className="sticky top-0 z-50 border-b border-green-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Logo y marca */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-green-700 to-green-600 shadow-md shadow-green-600/20">
            <CheckSquare size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-green-950">
            Tareas<span className="text-green-700">Concredito</span>
          </span>
        </div>

        {/* Información de usuario & logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-green-950">{user?.nombre}</p>
            <p className="text-xs text-green-950">{user?.email}</p>
          </div>

          <div className="h-6 w-px bg-green-100" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-green-950 hover:bg-rose-500/10 hover:text-rose-600"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
