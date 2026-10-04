/*
  =====================================================
  RUTA PROTEGIDA - components/common/ProtectedRoute.tsx
  =====================================================
  Este componente actúa como un guardia de seguridad.

  React Router v7 usa el patrón de componentes Outlet:
  - Si el usuario ESTÁ autenticado → renderiza <Outlet />
    que muestra el componente de la ruta protegida hija.
  - Si NO está autenticado → <Navigate> lo redirige
    automáticamente a /login sin renderizar nada.

  El atributo 'replace' en Navigate evita que el usuario
  pueda volver atrás con el botón "←" del navegador
  después de ser redirigido al login.
  =====================================================
*/

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Si no está autenticado, redirige inmediatamente al login.
  // El componente no renderiza NADA hasta que esto se resuelva.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renderiza el componente hijo que se definió en la ruta.
  // Ejemplo: si la ruta es /dashboard dentro de ProtectedRoute,
  // aquí se renderizará <DashboardPage />.
  return <Outlet />;
}
