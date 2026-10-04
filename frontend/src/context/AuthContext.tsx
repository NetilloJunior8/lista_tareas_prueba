/*
  =====================================================
  CONTEXTO DE AUTENTICACIÓN - context/AuthContext.tsx
  =====================================================
  Context API es la solución nativa de React para
  compartir estado entre componentes sin pasar props
  manualmente a través de múltiples niveles (prop drilling).

  Aquí creamos 3 cosas:
  1. El Contexto (el "canal" de comunicación)
  2. El Provider (el componente que provee los datos)
  3. Un Hook personalizado (useAuth) para consumirlo

  ¿Por qué no Redux?
  Para esta escala de aplicación, Context API es
  suficiente y más simple. Redux añade complejidad
  innecesaria cuando solo necesitas compartir el
  estado de un usuario logueado.
  =====================================================
*/

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Usuario, AuthResponse } from '../types';

// 1. Definimos qué va a exponer el contexto.
//    Cualquier componente que lo consuma tendrá acceso a estos valores.
interface AuthContextValue {
  user: Usuario | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// 2. Creamos el contexto. El undefined inicial es solo el tipo
//    por defecto, el useAuth que creamos abajo previene que
//    alguien lo use fuera del Provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// La llave que usaremos en localStorage para guardar el usuario.
const STORAGE_KEY = 'taskapp:user';

// 3. El Provider es el componente que "envuelve" la app y hace
//    que el estado sea accesible para todos sus hijos.
interface AuthProviderProps {
  children: ReactNode; // ReactNode = cualquier cosa que React pueda renderizar
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Inicializamos el estado desde localStorage.
  // La función dentro de useState() solo se ejecuta UNA VEZ al montar.
  // Esto permite que al refrescar la página, el usuario no pierda su sesión.
  const [user, setUser] = useState<Usuario | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Usuario) : null;
    } catch {
      // Si hay un error al parsear (datos corruptos), ignoramos y empezamos limpio.
      return null;
    }
  });

  /**
   * Se llama cuando el usuario hace login o register exitosamente.
   * Recibe la respuesta del backend, construye el objeto Usuario
   * y lo guarda tanto en el estado de React como en localStorage.
   */
  const login = (data: AuthResponse) => {
    const newUser: Usuario = {
      nombre: data.nombre,
      email: data.email,
      token: data.token,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  /**
   * Limpia el estado y el localStorage al cerrar sesión.
   * Después de esto, el ProtectedRoute redirigirá al login automáticamente.
   */
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // El valor que proveemos tiene todo lo que los componentes necesitan.
  const value: AuthContextValue = {
    user,
    login,
    logout,
    isAuthenticated: user !== null, // true si hay usuario, false si no
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook personalizado para consumir el contexto.
//    El throw previene errores confusos si alguien usa useAuth()
//    en un componente que no está dentro del AuthProvider.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}
