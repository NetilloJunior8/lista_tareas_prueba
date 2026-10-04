/*
  =====================================================
  TASK FORM - components/tasks/TaskForm.tsx
  =====================================================
  Formulario para crear nuevas tareas. Utiliza
  React Hook Form + Zod para validación.

  React Hook Form es la librería de formularios más
  usada en React. Sus ventajas vs formularios manuales:
  - No re-renderiza el componente en cada keystroke
    (usa referencias, no estado de React).
  - Validación integrada con Zod (zodResolver).
  - Manejo de errores automático y tipado.
  - Resetea el formulario fácilmente con reset().
  =====================================================
*/

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';
import { tareaSchema, type TareaFormValues } from '../../lib/validations';

interface TaskFormProps {
  onSubmit: (values: TareaFormValues) => Promise<void>;
  isLoading: boolean;
}

export default function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  // useForm conecta nuestro esquema Zod con el formulario.
  // TypeScript ya sabe que los valores serán de tipo TareaFormValues.
  const {
    register,  // Conecta un input con el formulario
    handleSubmit, // Envuelve nuestro handler con la lógica de validación
    reset,     // Limpia el formulario
    formState: { errors }, // Objeto con los errores de validación actuales
  } = useForm<TareaFormValues>({
    resolver: zodResolver(tareaSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
    },
  });

  // handleSubmit de React Hook Form primero valida los campos con Zod.
  // Solo llama a nuestro 'onSubmit' si todas las validaciones pasan.
  const handleFormSubmit = async (values: TareaFormValues) => {
    await onSubmit(values);
    reset(); // Limpiamos el formulario después de crear la tarea exitosamente
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="rounded-xl border border-brand-border bg-brand-surface p-5"
    >
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-muted">
        Nueva Tarea
      </h2>

      <div className="flex flex-col gap-3">
        {/* Input de Título */}
        <div>
          <input
            {...register('titulo')}
            placeholder="¿Qué necesitas hacer?"
            disabled={isLoading}
            className={`
              w-full rounded-lg border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted/50
              outline-none transition-colors
              focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
              disabled:cursor-not-allowed disabled:opacity-60
              ${errors.titulo ? 'border-red-500' : 'border-brand-border'}
            `}
          />
          {/* Mensaje de error de Zod */}
          {errors.titulo && (
            <p className="mt-1 text-xs text-red-400">{errors.titulo.message}</p>
          )}
        </div>

        {/* Input de Descripción (opcional) */}
        <div>
          <input
            {...register('descripcion')}
            placeholder="Descripción (opcional)"
            disabled={isLoading}
            className={`
              w-full rounded-lg border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted/50
              outline-none transition-colors
              focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
              disabled:cursor-not-allowed disabled:opacity-60
              ${errors.descripcion ? 'border-red-500' : 'border-brand-border'}
            `}
          />
          {errors.descripcion && (
            <p className="mt-1 text-xs text-red-400">{errors.descripcion.message}</p>
          )}
        </div>

        {/* Botón de submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 font-semibold text-white transition-all hover:bg-brand-primary-hover hover:shadow-lg hover:shadow-brand-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto"
        >
          {isLoading
            ? <Loader2 size={18} className="animate-spin" />
            : <Plus size={18} />
          }
          {isLoading ? 'Agregando...' : 'Agregar Tarea'}
        </button>
      </div>
    </form>
  );
}
