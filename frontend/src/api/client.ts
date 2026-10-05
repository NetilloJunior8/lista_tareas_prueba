/*
  =====================================================
  CLIENTE HTTP CENTRAL - api/client.ts
  =====================================================
  Este es el archivo más importante del Frontend.
  Aquí configuramos Axios con dos características clave:

  1. BASE URL: Apuntamos a '/api/v1' que Vite redirige
     automáticamente a 'http://localhost:8080/api/v1'
     gracias al proxy configurado en vite.config.ts.
     Esto elimina errores de CORS en desarrollo.

  2. INTERCEPTORES: Son "middlewares" para Axios.
     - Request Interceptor: Lee el token del localStorage
       y lo agrega al header Authorization ANTES de que
       Axios envíe cada petición. Así no tienes que
       escribirlo manualmente en cada llamada al API.
     - Response Interceptor: Si el backend responde 401
       (No Autorizado), significa que el token expiró.
       Limpiamos la sesión y redirigimos al login.
  =====================================================
*/

import axios from 'axios';

// Creamos una instancia de Axios con configuración base.
// Usamos una instancia en lugar del axios global para
// poder tener múltiples clientes con distintas configs.
const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- INTERCEPTOR DE REQUEST ----
// Se ejecuta ANTES de cada petición saliente.
apiClient.interceptors.request.use(
  (config) => {
    // Buscamos el usuario guardado en localStorage.
    // JSON.parse lo convierte del string guardado al objeto JavaScript.
    const userStr = localStorage.getItem('taskapp:user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.token) {
        // Agregamos el token al header. El backend Spring Security
        // leerá este header en el JwtAuthenticationFilter.
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config; // Devolvemos la config modificada para que continúe
  },
  (error) => Promise.reject(error)
);

// ---- INTERCEPTOR DE RESPONSE ----
// Se ejecuta cuando llega la respuesta del backend.
apiClient.interceptors.response.use(
  (response) => response, // Si todo está bien, la dejamos pasar sin cambios.
  (error) => {
    // Si el código de respuesta es 401 (Unauthorized):
    if (error.response?.status === 401) {
      const isAuthRoute = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthRoute) {
        // Solo expulsamos al usuario si estaba navegando dentro de rutas protegidas
        localStorage.removeItem('taskapp:user');
        window.location.href = '/login';
      }
    }
    // Rechazamos la promesa para que React Query / React Hook Form pueda capturar el error
    return Promise.reject(error);
  }
);

export default apiClient;
