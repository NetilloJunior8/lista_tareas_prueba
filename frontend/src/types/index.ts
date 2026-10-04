/*
  =====================================================
  TIPOS GLOBALES DE TYPESCRIPT - types/index.ts
  =====================================================
  Aquí definimos las "formas" (interfaces) de todos los
  datos que van a fluir por nuestra app.

  Estos tipos son un CONTRATO entre el Frontend y el
  Backend. Si el backend cambia un campo, TypeScript
  nos avisa en todos los lugares donde se usa.

  Nota: usamos 'interface' para objetos y 'type' para
  uniones o alias simples. Es una convención común.
  =====================================================
*/

// ---- ENTIDADES DEL DOMINIO ----

/**
 * Refleja exactamente el modelo Tarea.java del backend.
 * El '?' indica que el campo puede ser undefined (opcional).
 */
export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  fechaCreacion?: string; // El backend lo serializa como string ISO 8601
}

/**
 * Representa al usuario autenticado que guardamos en memoria.
 * Combinamos los datos del usuario + el token JWT.
 */
export interface Usuario {
  nombre: string;
  email: string;
  token: string;
}

// ---- DTOs (Data Transfer Objects) ----
// Son los "moldes" de lo que ENVIAMOS al backend en las peticiones.

/** Body del POST /auth/login */
export interface LoginDTO {
  email: string;
  password: string;
}

/** Body del POST /auth/register */
export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
}

/** Body del POST /tareas (crear tarea) */
export interface CreateTareaDTO {
  titulo: string;
  descripcion?: string;
}

// ---- RESPUESTAS DEL BACKEND ----
// Son los "moldes" de lo que RECIBIMOS del backend.

/**
 * Lo que devuelven /auth/login y /auth/register.
 * El token se guarda en localStorage para futuras peticiones.
 */
export interface AuthResponse {
  token: string;
  nombre: string;
  email: string;
}
