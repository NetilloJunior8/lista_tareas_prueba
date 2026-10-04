/*
  =====================================================
  VALIDACIONES ZOD - lib/validations.ts
  =====================================================
  Zod es una librería de validación de esquemas.
  Funciona perfecto con React Hook Form a través de
  @hookform/resolvers/zod.

  ¿Por qué Zod sobre validación manual?
  - Los esquemas son reutilizables (los usas en login,
    register y el backend si fuera TypeScript también).
  - TypeScript infiere automáticamente los tipos del
    esquema con z.infer<typeof esquema>.
  - Los mensajes de error están centralizados aquí,
    no esparcidos por todos los formularios.
  =====================================================
*/

import { z } from 'zod';

/**
 * Esquema de validación para el formulario de Login.
 * z.string().email() valida que sea un email con formato correcto.
 * .min() establece longitud mínima con mensaje de error personalizado.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// TypeScript infiere automáticamente el tipo del esquema.
// LoginFormValues es: { email: string; password: string }
export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Esquema para el formulario de Registro.
 * Agrega validación de confirmación de contraseña
 * usando .refine() que permite validaciones cruzadas entre campos.
 */
export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre es muy largo'),
    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Ingresa un correo válido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // El error se muestra en el campo confirmPassword
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Esquema para el formulario de nueva tarea.
 */
export const tareaSchema = z.object({
  titulo: z
    .string()
    .min(1, 'El título es requerido')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  descripcion: z
    .string()
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .optional(),
});

export type TareaFormValues = z.infer<typeof tareaSchema>;
