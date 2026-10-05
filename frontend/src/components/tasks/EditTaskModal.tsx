/*
  =====================================================
  EDIT TASK MODAL - components/tasks/EditTaskModal.tsx (shadcn/ui)
  =====================================================
*/

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check } from 'lucide-react';
import { tareaSchema, type TareaFormValues } from '../../lib/validations';
import type { Tarea } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface EditTaskModalProps {
  tarea: Tarea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, values: TareaFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function EditTaskModal({
  tarea,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: EditTaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      titulo: tarea?.titulo || '',
      descripcion: tarea?.descripcion || '',
    },
  });

  useEffect(() => {
    if (tarea) {
      reset({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
      });
    }
  }, [tarea, reset]);

  const handleFormSubmit = async (values: TareaFormValues) => {
    if (!tarea) return;
    await onSave(tarea.id, values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-green-200 bg-white text-green-950 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-green-950">Editar Tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-green-950">
              Título
            </label>
            <Input
              {...register('titulo')}
              placeholder="Título de la tarea"
              disabled={isLoading}
              className={errors.titulo ? 'border-rose-500/80' : ''}
            />
            {errors.titulo && (
              <p className="text-xs text-rose-600">{errors.titulo.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-green-950">
              Descripción
            </label>
            <Textarea
              {...register('descripcion')}
              rows={3}
              placeholder="Descripción (opcional)"
              disabled={isLoading}
              className={errors.descripcion ? 'border-rose-500/80' : ''}
            />
            {errors.descripcion && (
              <p className="text-xs text-rose-600">{errors.descripcion.message}</p>
            )}
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
