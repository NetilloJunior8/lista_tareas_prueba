/*
  =====================================================
  PÁGINA DE REGISTRO - pages/RegisterPage.tsx (shadcn/ui)
  =====================================================
*/

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { registerSchema, type RegisterFormValues } from '../lib/validations';
import { registerService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate: doRegister, isPending, error } = useMutation({
    mutationFn: registerService,
    onSuccess: (data) => {
      login(data);
      navigate('/dashboard');
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    
    const { confirmPassword, ...registerData } = values;
    doRegister(registerData);
  };

  const errorMessage = error
    ? (error as any)?.response?.data?.message ?? 'Error al crear la cuenta. Intenta de nuevo.'
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-8">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-green-700 to-green-600 shadow-xl shadow-green-600/25">
            <UserPlus size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-green-950">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-green-950">Organiza tus tareas con estándar profesional</p>
        </div>

        <Card className="border-green-200 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="nombre" className="text-xs font-semibold uppercase tracking-wider text-green-950">
                Nombre Completo
              </label>
              <Input
                id="nombre"
                type="text"
                autoComplete="name"
                {...register('nombre')}
                placeholder="Juan Pérez"
                className={errors.nombre ? 'border-rose-500/80' : ''}
              />
              {errors.nombre && (
                <p className="text-xs text-rose-600">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-green-950">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="tu@correo.com"
                className={errors.email ? 'border-rose-500/80' : ''}
              />
              {errors.email && (
                <p className="text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-green-950">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder="Mínimo 6 caracteres"
                  className={errors.password ? 'border-rose-500/80 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-950 hover:text-green-950 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-green-950">
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="Repite tu contraseña"
                className={errors.confirmPassword ? 'border-rose-500/80' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-rose-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-600">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 text-base font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-green-950">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-semibold text-green-700 hover:text-green-800 underline-offset-4 hover:underline">
              Inicia sesión
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
