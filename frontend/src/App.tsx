/*
  =====================================================
  ROUTER PRINCIPAL - App.tsx
  =====================================================
  App.tsx es el componente raíz de la aplicación.
  Aquí definimos:

  1. Los Providers: componentes que envuelven la app
     y proveen funcionalidad global.
     - AuthProvider: contexto de autenticación
     - QueryClientProvider: cliente de React Query con su caché

  2. Las Rutas con React Router v7:
     - Rutas públicas: accesibles sin login
     - Rutas protegidas: dentro de <ProtectedRoute />
     - Redirección por defecto con '*'

  QueryClient config:
  - retry: 1 → si una petición falla, reintenta 1 vez antes de marcar error
  - staleTime → por defecto 0 (los datos se consideran obsoletos inmediatamente)
  =====================================================
*/

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Creamos el cliente de React Query FUERA del componente App
// para que no se recree en cada re-render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // En caso de error, reintenta 1 vez
      staleTime: 1000 * 30, // 30 segundos antes de considerar datos obsoletos
    },
  },
});

function App() {
  return (
    // QueryClientProvider debe envolver todo lo que use React Query
    <QueryClientProvider client={queryClient}>
      {/* BrowserRouter provee el contexto de navegación */}
      <BrowserRouter>
        {/* AuthProvider provee el contexto de autenticación */}
        <AuthProvider>
          <Routes>
            {/* ---- RUTAS PÚBLICAS ---- */}
            {/* Accesibles sin estar logueado */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ---- RUTAS PROTEGIDAS ---- */}
            {/* ProtectedRoute actúa como guardia: si no estás logueado,
                redirige a /login. Si sí, renderiza el Outlet (la ruta hija). */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* ---- REDIRECCIÓN POR DEFECTO ---- */}
            {/* Si alguien entra a '/' o cualquier ruta no definida,
                lo mandamos al dashboard (ProtectedRoute se encargará
                de redirigir a login si no está autenticado). */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
