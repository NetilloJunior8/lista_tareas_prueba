/*
  =====================================================
  TASK CARD - components/tasks/TaskCard.tsx (shadcn/ui)
  =====================================================
*/

import { Trash2, Pencil, Circle, CheckCircle2, MoreVertical } from 'lucide-react';
import type { Tarea } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

interface TaskCardProps {
  tarea: Tarea;
  onToggle: (tarea: Tarea) => void;
  onEdit?: (tarea: Tarea) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function TaskCard({ tarea, onToggle, onEdit, onDelete, isLoading }: TaskCardProps) {
  return (
    <Card
      className={`
        group flex flex-col sm:flex-row sm:items-center gap-3.5 p-4 transition-all duration-200
        ${tarea.completada
          ? 'border-green-200/50 bg-white/30 opacity-60'
          : 'border-green-200/80 bg-white/70 hover:-translate-y-0.5 hover:border-green-600/40 hover:shadow-lg hover:shadow-green-600/5'
        }
      `}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Botón de completar */}
        <button
          onClick={() => onToggle(tarea)}
          disabled={isLoading}
          className="mt-0.5 shrink-0 text-green-950 transition-colors hover:text-green-700 focus:outline-none disabled:cursor-not-allowed"
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {tarea.completada ? (
            <CheckCircle2 size={22} className="text-emerald-700 fill-emerald-700/10" />
          ) : (
            <Circle size={22} />
          )}
        </button>

        {/* Contenido principal */}
        <div className="min-w-0 flex-1 break-words">
          <p
            className={`
              font-medium leading-snug tracking-tight break-words
              ${tarea.completada ? 'text-green-950 line-through' : 'text-green-950'}
            `}
          >
            {tarea.titulo}
          </p>
          {tarea.descripcion && (
            <p className="mt-1 text-sm text-green-950 leading-relaxed break-words">{tarea.descripcion}</p>
          )}
          {tarea.fechaCreacion && (
            <p className="mt-2 text-[11px] font-medium text-green-950">
              {new Date(tarea.fechaCreacion).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-green-200/40 sm:border-0 shrink-0">
        {/* Badge de estado */}
        <Badge
          variant={tarea.completada ? 'success' : 'default'}
        >
          {tarea.completada ? 'Completada' : 'Pendiente'}
        </Badge>

        {/* Menú de acciones Shadcn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-950 hover:text-green-950 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              disabled={isLoading}
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(tarea)}>
                <Pencil size={14} className="text-green-700" />
                Editar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onToggle(tarea)}>
              {tarea.completada ? (
                <>
                  <Circle size={14} className="text-amber-400" />
                  Desmarcar
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  Completar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(tarea.id)}
              className="text-rose-600 focus:bg-rose-500/10 focus:text-rose-600"
            >
              <Trash2 size={14} />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
