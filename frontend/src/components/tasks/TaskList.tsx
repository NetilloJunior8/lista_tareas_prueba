/*
  =====================================================
  TASK LIST - components/tasks/TaskList.tsx (shadcn/ui)
  =====================================================
*/

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import TaskCard from './TaskCard';
import type { Tarea } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type FilterType = 'todas' | 'pendientes' | 'completadas';

interface TaskListProps {
  tareas: Tarea[];
  onToggle: (tarea: Tarea) => void;
  onEdit?: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  isMutating: boolean;
}

export default function TaskList({ tareas, onToggle, onEdit, onDelete, isMutating }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('todas');

  const tareasFiltradas = tareas.filter((t) => {
    if (filter === 'pendientes') return !t.completada;
    if (filter === 'completadas') return t.completada;
    return true;
  });

  const totalCompletadas = tareas.filter((t) => t.completada).length;
  const totalPendientes = tareas.filter((t) => !t.completada).length;

  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'todas', label: 'Todas', count: tareas.length },
    { value: 'pendientes', label: 'Pendientes', count: totalPendientes },
    { value: 'completadas', label: 'Completadas', count: totalCompletadas },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de filtros shadcn */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(option.value)}
            className="gap-2 rounded-lg"
          >
            {option.label}
            <Badge
              variant={filter === option.value ? 'secondary' : 'outline'}
              className="px-1.5 py-0 text-[10px]"
            >
              {option.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Lista de tareas o estado vacío */}
      {tareasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-green-200 bg-white/40 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100/80 text-green-950">
            <ClipboardList size={24} />
          </div>
          <p className="text-sm font-medium text-green-950">
            {filter === 'todas'
              ? 'No tienes tareas aún. ¡Agrega tu primera tarea!'
              : `No hay tareas ${filter}.`
            }
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tareasFiltradas.map((tarea) => (
            <TaskCard
              key={tarea.id}
              tarea={tarea}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              isLoading={isMutating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
