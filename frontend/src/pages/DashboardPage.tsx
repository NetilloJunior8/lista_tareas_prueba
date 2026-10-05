/*
  =====================================================
  DASHBOARD PAGE - pages/DashboardPage.tsx (shadcn/ui)
  =====================================================
*/

import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import EditTaskModal from '../components/tasks/EditTaskModal';
import {
  getTareasService,
  createTareaService,
  updateTareaService,
  deleteTareaService,
  exportExcelService,
} from '../api/services';
import type { TareaFormValues } from '../lib/validations';
import type { Tarea } from '../types';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const TAREAS_QUERY_KEY = ['tareas'] as const;

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<Tarea | null>(null);

  const {
    data: tareas = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: TAREAS_QUERY_KEY,
    queryFn: getTareasService,
    staleTime: 1000 * 30,
  });

  const invalidateTareas = () => {
    queryClient.invalidateQueries({ queryKey: TAREAS_QUERY_KEY });
  };

  const { mutateAsync: createTarea, isPending: isCreating } = useMutation({
    mutationFn: (data: { titulo: string; descripcion?: string }) =>
      createTareaService(data),
    onSuccess: invalidateTareas,
  });

  const { mutateAsync: updateTarea, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, values }: { id: number; values: TareaFormValues }) =>
      updateTareaService(id, {
        titulo: values.titulo,
        descripcion: values.descripcion || undefined,
      }),
    onSuccess: invalidateTareas,
  });

  const { mutate: toggleTarea, isPending: isToggling } = useMutation({
    mutationFn: (tarea: Tarea) =>
      updateTareaService(tarea.id, { ...tarea, completada: !tarea.completada }),
    onSuccess: invalidateTareas,
  });

  const { mutate: deleteTarea, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteTareaService(id),
    onSuccess: invalidateTareas,
  });

  const { mutate: exportExcel, isPending: isExporting } = useMutation({
    mutationFn: exportExcelService,
  });

  const handleCreateTarea = async (values: TareaFormValues) => {
    await createTarea({
      titulo: values.titulo,
      descripcion: values.descripcion || undefined,
    });
  };

  const handleUpdateTarea = async (id: number, values: TareaFormValues) => {
    await updateTarea({ id, values });
  };

  const isMutating = isCreating || isUpdating || isToggling || isDeleting;

  const totalTareas = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const progreso = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

  return (
    <div className="min-h-screen bg-green-50 text-green-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* STATS CARDS SHADCN */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card className="border-green-200 bg-white/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-green-950">Total Tareas</p>
            <p className="mt-1 text-3xl font-bold text-green-950">{totalTareas}</p>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Completadas</p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">{completadas}</p>
          </Card>

          <Card className="col-span-2 border-green-600/20 bg-green-600/5 p-5 sm:col-span-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-green-800">Progreso</p>
              <p className="text-xl font-bold text-green-700">{progreso}%</p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-600 transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </Card>
        </div>

        {/* FORMULARIO */}
        <div className="mb-6">
          <TaskForm onSubmit={handleCreateTarea} isLoading={isCreating} />
        </div>

        {/* HEADER Y BOTÓN EXCEL */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-green-950">Mis Tareas</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportExcel()}
            disabled={isExporting || totalTareas === 0}
            className="gap-2 border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-700"
          >
            {isExporting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileSpreadsheet size={15} />
            )}
            {isExporting ? 'Exportando...' : 'Exportar a Excel'}
          </Button>
        </div>

        {/* LISTA / CARGA / ERROR */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl border border-green-200 bg-white/60"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-sm font-medium text-rose-600">
            No se pudieron cargar las tareas. Verifica que el backend esté corriendo.
          </div>
        ) : (
          <TaskList
            tareas={tareas}
            onToggle={toggleTarea}
            onEdit={(tarea) => setEditingTask(tarea)}
            onDelete={deleteTarea}
            isMutating={isMutating}
          />
        )}
      </main>

      <EditTaskModal
        tarea={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTarea}
        isLoading={isUpdating}
      />
    </div>
  );
}
