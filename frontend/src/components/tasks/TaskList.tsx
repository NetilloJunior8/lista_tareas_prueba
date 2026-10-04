/*
  =====================================================
  TASK LIST - components/tasks/TaskList.tsx
  =====================================================
  Renderiza la lista completa de tareas con filtros
  por estado. Aplica el principio de separación:
  este componente solo maneja cómo mostrar la lista,
  no cómo obtenerla o mutarla.

  El estado del filtro SÍ es responsabilidad de este
  componente porque es UI state, no server state.
  =====================================================
*/

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import TaskCard from './TaskCard';
import type { Tarea } from '../../types';

// Los filtros posibles para la vista
type FilterType = 'todas' | 'pendientes' | 'completadas';

interface TaskListProps {
  tareas: Tarea[];
  onToggle: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  isMutating: boolean; // true cuando hay una operación de escritura en curso
}

export default function TaskList({ tareas, onToggle, onDelete, isMutating }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('todas');

  // Filtramos las tareas según el filtro activo.
  // useMemo podría optimizar esto si la lista fuera muy grande,
  // pero para listas normales el filtrado inline es suficiente.
  const tareasFiltradas = tareas.filter((t) => {
    if (filter === 'pendientes') return !t.completada;
    if (filter === 'completadas') return t.completada;
    return true; // 'todas'
  });

  // Estadísticas para mostrar en el header
  const totalCompletadas = tareas.filter((t) => t.completada).length;
  const totalPendientes = tareas.filter((t) => !t.completada).length;

  // Opciones de filtro con sus labels y contadores
  const filterOptions: { value: FilterType; label: string; count: number }[] = [
    { value: 'todas', label: 'Todas', count: tareas.length },
    { value: 'pendientes', label: 'Pendientes', count: totalPendientes },
    { value: 'completadas', label: 'Completadas', count: totalCompletadas },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`
              flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors
              ${filter === option.value
                ? 'bg-brand-primary text-white'
                : 'text-brand-muted hover:bg-brand-surface-2 hover:text-brand-text'
              }
            `}
          >
            {option.label}
            <span
              className={`
                rounded-full px-1.5 py-0.5 text-xs font-bold
                ${filter === option.value ? 'bg-white/20' : 'bg-brand-surface-2'}
              `}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista de tareas o estado vacío */}
      {tareasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-brand-border py-16 text-center">
          <ClipboardList size={40} className="text-brand-muted/40" />
          <p className="font-medium text-brand-muted">
            {filter === 'todas'
              ? 'No tienes tareas aún. ¡Crea tu primera tarea!'
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
              onDelete={onDelete}
              isLoading={isMutating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
