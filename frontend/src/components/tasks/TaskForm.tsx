/*
  =====================================================
  TASK FORM - components/tasks/TaskForm.tsx (shadcn/ui)
  =====================================================
*/

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';
import { tareaSchema, type TareaFormValues } from '../../lib/validations';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface TaskFormProps {
  onSubmit: (values: TareaFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
    },
  });

  const handleFormSubmit = async (values: TareaFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Card className="border-slate-800/80 bg-slate-900/60 shadow-xl">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Nueva Tarea
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-3.5">
          <div>
            <Input
              {...register('titulo')}
              placeholder="¿Qué necesitas hacer hoy?"
              disabled={isLoading}
              className={errors.titulo ? 'border-rose-500/80 focus-visible:ring-rose-500/30' : ''}
            />
            {errors.titulo && (
              <p className="mt-1 text-xs text-rose-400">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register('descripcion')}
              placeholder="Descripción (opcional)"
              rows={2}
              disabled={isLoading}
              className={errors.descripcion ? 'border-rose-500/80 focus-visible:ring-rose-500/30' : ''}
            />
            {errors.descripcion && (
              <p className="mt-1 text-xs text-rose-400">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Agregar Tarea
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
