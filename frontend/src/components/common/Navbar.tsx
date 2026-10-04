/*
  =====================================================
  NAVBAR - components/common/Navbar.tsx
  =====================================================
  La barra de navegación superior. Utiliza Lucide React
  para los iconos (una librería de iconos SVG muy usada
  en proyectos profesionales, mismos que usa Vercel/shadcn).

  useNavigate() es el hook de React Router para navegar
  programáticamente (sin un link clickeable).
  =====================================================
*/

import { LogOut, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Después de hacer logout, redirigimos al login.
    // El ProtectedRoute también haría esto automáticamente,
    // pero es mejor navegación explícita.
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Logo y nombre de la app */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-brand-text">
            Task<span className="text-brand-primary">App</span>
          </span>
        </div>

        {/* Información del usuario y botón de logout */}
        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-brand-text">{user?.nombre}</p>
            <p className="text-xs text-brand-muted">{user?.email}</p>
          </div>

          {/* Separador vertical */}
          <div className="h-6 w-px bg-brand-border" />

          <button
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
