/*
  =====================================================
  DASHBOARD PAGE - pages/DashboardPage.tsx
  =====================================================
  Esta es la página principal y la más compleja.
  Aquí usamos TanStack Query (React Query) para:

  useQuery: Para OBTENER datos (GET /tareas)
  - Hace la petición automáticamente al montar el componente.
  - Cachea los resultados: si navegas y vuelves, los datos
    aparecen instantáneamente (sin spinner), mientras
    React Query actualiza en background silenciosamente.
  - Tiene staleTime y gcTime para controlar cuánto tiempo
    los datos se consideran "frescos".

  useMutation: Para MODIFICAR datos (POST, PUT, DELETE)
  - Se ejecuta manualmente cuando el usuario hace una acción.
  - onSuccess: invalidamos la query de tareas para que
    React Query refetch automáticamente con los datos nuevos.
    Esto garantiza que la UI siempre refleje el servidor.

  queryClient.invalidateQueries:
  - Le dice a React Query "los datos de esta query ya no
    son válidos, vuelve a fetchear cuando puedas".
  =====================================================
*/

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import {
  getTareasService,
  createTareaService,
  updateTareaService,
  deleteTareaService,
  exportExcelService,
} from '../api/services';
import type { TareaFormValues } from '../lib/validations';
import type { Tarea } from '../types';

// Definimos la query key como constante para evitar errores de typo.
// Si escribes 'teras' en vez de 'tareas', TypeScript no te avisa,
// pero al tenerlo como constante centralizada es más seguro.
const TAREAS_QUERY_KEY = ['tareas'] as const;

export default function DashboardPage() {
  // queryClient nos permite controlar el caché manualmente
  const queryClient = useQueryClient();

  // ---- useQuery: Obtiene las tareas del backend ----
  // 'queryKey': identificador único del caché. Si dos componentes usan
  // la misma key, comparten el mismo caché (no hace dos peticiones).
  // 'queryFn': la función que retorna una promesa con los datos.
  const {
    data: tareas = [],    // 'data' renombrado a 'tareas', default [] si aún no llegó
    isLoading,           // true solo en el primer fetch (no hay datos en caché)
    isError,
  } = useQuery({
    queryKey: TAREAS_QUERY_KEY,
    queryFn: getTareasService,
    staleTime: 1000 * 30, // Los datos se consideran frescos por 30 segundos
  });

  // ---- Función helper para invalidar el caché ----
  // Después de cualquier mutación exitosa, llamamos esto para
  // que React Query refetch las tareas automáticamente.
  const invalidateTareas = () => {
    queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
  };

  // ---- Mutación: Crear tarea ----
  const { mutateAsync: createTarea, isPending: isCreating } = useMutation({
    mutationFn: (data: { titulo: string; descripcion?: string }) =>
      createTareaService(data),
    onSuccess: invalidateTareas,
  });

  // ---- Mutación: Toggle completada ----
  const { mutate: toggleTarea, isPending: isToggling } = useMutation({
    mutationFn: (tarea: Tarea) =>
      updateTareaService(tarea.id, { ...tarea, completada: !tarea.completada }),
    onSuccess: invalidateTareas,
  });

  // ---- Mutación: Eliminar tarea ----
  const { mutate: deleteTarea, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteTareaService(id),
    onSuccess: invalidateTareas,
  });

  // ---- Mutación: Exportar a Excel ----
  const { mutate: exportExcel, isPending: isExporting } = useMutation({
    mutationFn: exportExcelService,
    // No necesitamos invalidar queries aquí ya que no modifica datos del servidor
  });

  // Handler para el TaskForm: recibe los valores de RHF/Zod y crea la tarea
  const handleCreateTarea = async (values: TareaFormValues) => {
    await createTarea({
      titulo: values.titulo,
      descripcion: values.descripcion || undefined,
    });
  };

  // true si alguna mutación está en progreso (para deshabilitar botones)
  const isMutating = isCreating || isToggling || isDeleting;

  // Estadísticas para el resumen
  const totalTareas = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const progreso = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">

        {/* ---- STATS CARDS ---- */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {/* Total de tareas */}
          <div className="rounded-xl border border-brand-border bg-brand-surface p-5">
            <p className="text-sm text-brand-muted">Total</p>
            <p className="mt-1 text-3xl font-bold text-brand-text">{totalTareas}</p>
          </div>
          {/* Completadas */}
          <div className="rounded-xl border border-brand-success/20 bg-brand-success/5 p-5">
            <p className="text-sm text-brand-success/70">Completadas</p>
            <p className="mt-1 text-3xl font-bold text-brand-success">{completadas}</p>
          </div>
          {/* Progreso */}
          <div className="col-span-2 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5 sm:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-brand-primary/70">Progreso</p>
              <p className="text-xl font-bold text-brand-primary">{progreso}%</p>
            </div>
            {/* Barra de progreso */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-surface-2">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* ---- FORMULARIO DE NUEVA TAREA ---- */}
        <div className="mb-6">
          <TaskForm onSubmit={handleCreateTarea} isLoading={isCreating} />
        </div>

        {/* ---- HEADER DE LA LISTA CON BOTÓN EXCEL ---- */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-text">Mis Tareas</h2>
          <button
            onClick={() => exportExcel()}
            disabled={isExporting || totalTareas === 0}
            className="flex items-center gap-2 rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-brand-muted transition-all hover:border-brand-success/50 hover:bg-brand-success/10 hover:text-brand-success disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isExporting
              ? <Loader2 size={15} className="animate-spin" />
              : <FileSpreadsheet size={15} />
            }
            {isExporting ? 'Exportando...' : 'Exportar a Excel'}
          </button>
        </div>

        {/* ---- ESTADO DE CARGA / ERROR / LISTA ---- */}
        {isLoading ? (
          // Skeleton loader: más profesional que un spinner simple
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-brand-border bg-brand-surface"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            No se pudieron cargar las tareas. Verifica que el backend esté corriendo.
          </div>
        ) : (
          <TaskList
            tareas={tareas}
            onToggle={toggleTarea}
            onDelete={deleteTarea}
            isMutating={isMutating}
          />
        )}
      </main>
    </div>
  );
}
