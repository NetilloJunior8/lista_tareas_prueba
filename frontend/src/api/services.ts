/*
  =====================================================
  SERVICIOS DEL API - api/services.ts
  =====================================================
  Aquí centralizamos TODAS las funciones que hacen
  peticiones HTTP al backend. Separar los servicios
  de los componentes tiene varias ventajas:

  1. Si el endpoint del backend cambia, solo lo
     actualizas aquí, no en 10 componentes diferentes.
  2. Los componentes se mantienen limpios: solo se
     preocupan por la UI, no por los detalles HTTP.
  3. Facilita el testing (puedes mockear este archivo).

  React Query va a llamar a estas funciones y manejará
  el estado de loading, error y cache automáticamente.
  =====================================================
*/

import apiClient from './client';
import type { AuthResponse, LoginDTO, RegisterDTO, Tarea, CreateTareaDTO } from '../types';

// ---- SERVICIOS DE AUTENTICACIÓN ----

/**
 * Envía las credenciales al endpoint POST /auth/login.
 * Devuelve una promesa con el token y datos del usuario.
 */
export const loginService = async (data: LoginDTO): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * Registra un nuevo usuario en POST /auth/register.
 * El backend también devuelve un token para el usuario recién registrado,
 * así el usuario no tiene que hacer login después de registrarse.
 */
export const registerService = async (data: RegisterDTO): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// ---- SERVICIOS DE TAREAS ----

/**
 * GET /tareas - Obtiene todas las tareas del usuario autenticado.
 * El interceptor de Axios agrega el token automáticamente.
 */
export const getTareasService = async (): Promise<Tarea[]> => {
  const response = await apiClient.get<Tarea[]>('/tareas');
  return response.data;
};

/**
 * POST /tareas - Crea una nueva tarea.
 * El backend asigna automáticamente el usuario dueño
 * de la tarea basándose en el token JWT recibido.
 */
export const createTareaService = async (data: CreateTareaDTO): Promise<Tarea> => {
  const response = await apiClient.post<Tarea>('/tareas', data);
  return response.data;
};

/**
 * PUT /tareas/:id - Actualiza una tarea existente (ej: marcar como completada).
 * Enviamos el objeto completo de la tarea con el campo 'completada' modificado.
 */
export const updateTareaService = async (id: number, data: Partial<Tarea>): Promise<Tarea> => {
  const response = await apiClient.put<Tarea>(`/tareas/${id}`, data);
  return response.data;
};

/**
 * DELETE /tareas/:id - Elimina una tarea.
 * El backend responde con 204 No Content, por eso no esperamos data de retorno.
 */
export const deleteTareaService = async (id: number): Promise<void> => {
  await apiClient.delete(`/tareas/${id}`);
};

/**
 * GET /tareas/export/excel - Descarga el reporte de tareas.
 * La clave aquí es responseType: 'blob'. Le dice a Axios que la respuesta
 * es un archivo binario (no JSON), y lo maneja como tal.
 * Luego creamos una URL temporal y hacemos un click programático para descargar.
 */
export const exportExcelService = async (): Promise<void> => {
  const response = await apiClient.get('/tareas/export/excel', {
    responseType: 'blob',
  });
  // Creamos una URL de objeto en memoria que apunta al blob recibido
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `mis_tareas_${new Date().toLocaleDateString()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  // Limpiamos el link temporal del DOM y liberamos la memoria
  link.remove();
  window.URL.revokeObjectURL(url);
};
