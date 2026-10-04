/*
  =====================================================
  TASK CARD - components/tasks/TaskCard.tsx
  =====================================================
  Renderiza una tarea individual. Aplica el principio
  de Componente Presentacional (Dumb Component): solo
  recibe datos por props y llama callbacks, NO tiene
  lógica de negocio ni llamadas al API directas.

  La lógica de qué hacer cuando se hace click la
  maneja el componente padre (DashboardPage).
  =====================================================
*/

import { Trash2, Circle, CheckCircle2 } from 'lucide-react';
import type { Tarea } from '../../types';

interface TaskCardProps {
  tarea: Tarea;
  // Callbacks: funciones que el padre proporciona para manejar las acciones.
  onToggle: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  // isLoading nos permite deshabilitar los botones mientras hay una petición pendiente
  isLoading?: boolean;
}

export default function TaskCard({ tarea, onToggle, onDelete, isLoading }: TaskCardProps) {
  return (
    <div
      className={`
        group flex items-start gap-4 rounded-xl border p-4 transition-all duration-200
        ${tarea.completada
          ? 'border-brand-border bg-brand-surface/40 opacity-70'
          : 'border-brand-border bg-brand-surface hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-lg hover:shadow-brand-primary/5'
        }
      `}
    >
      {/* Botón de completar/descompletar */}
      <button
        onClick={() => onToggle(tarea)}
        disabled={isLoading}
        className="mt-0.5 shrink-0 text-brand-muted transition-colors hover:text-brand-primary disabled:cursor-not-allowed"
        aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        {/* Cambiamos el icono dependiendo del estado */}
        {tarea.completada
          ? <CheckCircle2 size={22} className="text-brand-success" />
          : <Circle size={22} />
        }
      </button>

      {/* Contenido de la tarea */}
      <div className="min-w-0 flex-1">
        <p
          className={`
            font-medium leading-snug
            ${tarea.completada ? 'text-brand-muted line-through' : 'text-brand-text'}
          `}
        >
          {tarea.titulo}
        </p>
        {tarea.descripcion && (
          <p className="mt-1 text-sm text-brand-muted">{tarea.descripcion}</p>
        )}
        {/* Fecha de creación (si existe) */}
        {tarea.fechaCreacion && (
          <p className="mt-2 text-xs text-brand-muted/60">
            {new Date(tarea.fechaCreacion).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Badge de estado */}
      <span
        className={`
          hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:block
          ${tarea.completada
            ? 'bg-brand-success/10 text-brand-success'
            : 'bg-brand-primary/10 text-brand-primary'
          }
        `}
      >
        {tarea.completada ? 'Completada' : 'Pendiente'}
      </span>

      {/* Botón de eliminar - visible solo en hover gracias a 'group' */}
      <button
        onClick={() => onDelete(tarea.id)}
        disabled={isLoading}
        className="shrink-0 rounded-lg p-1.5 text-brand-muted opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100 disabled:cursor-not-allowed"
        aria-label="Eliminar tarea"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
