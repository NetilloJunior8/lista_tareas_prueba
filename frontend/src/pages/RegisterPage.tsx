/*
  =====================================================
  PÁGINA DE REGISTRO - pages/RegisterPage.tsx
  =====================================================
  Misma arquitectura que LoginPage. Notar que:
  - Tiene un campo extra: nombre
  - Tiene confirmación de contraseña (validación .refine en Zod)
  - Llama a registerService en lugar de loginService
  - Al registrarse exitosamente también hace login automático
    porque el backend devuelve el token directamente.
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
    // No enviamos confirmPassword al backend, solo lo usamos para validar en el front.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = values;
    doRegister(registerData);
  };

  const errorMessage = error
    ? (error as any)?.response?.data?.message ?? 'Error al crear la cuenta. Intenta de nuevo.'
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-8">
      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-accent/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/30">
            <UserPlus size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text">Crea tu cuenta</h1>
          <p className="mt-2 text-brand-muted">Comienza a organizar tus tareas hoy</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

            {/* Campo Nombre */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-sm font-medium text-brand-muted">
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                autoComplete="name"
                {...register('nombre')}
                placeholder="Juan Pérez"
                className={`
                  rounded-lg border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted/40
                  outline-none transition-all duration-200
                  focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                  ${errors.nombre ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border'}
                `}
              />
              {errors.nombre && (
                <p className="text-xs text-red-400">{errors.nombre.message}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-brand-muted">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="tu@correo.com"
                className={`
                  rounded-lg border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted/40
                  outline-none transition-all duration-200
                  focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                  ${errors.email ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border'}
                `}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-brand-muted">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder="Mínimo 6 caracteres"
                  className={`
                    w-full rounded-lg border bg-brand-bg px-4 py-3 pr-12 text-brand-text placeholder-brand-muted/40
                    outline-none transition-all duration-200
                    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                    ${errors.password ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted transition-colors hover:text-brand-text"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-brand-muted">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword')}
                placeholder="Repite tu contraseña"
                className={`
                  rounded-lg border bg-brand-bg px-4 py-3 text-brand-text placeholder-brand-muted/40
                  outline-none transition-all duration-200
                  focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                  ${errors.confirmPassword ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border'}
                `}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Error del backend */}
            {errorMessage && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errorMessage}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent py-3 font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:shadow-brand-primary/30 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <><Loader2 size={18} className="animate-spin" /> Creando cuenta...</>
              ) : (
                <>Crear Cuenta</>
              )}
            </button>
          </form>

          {/* Link a login */}
          <p className="mt-6 text-center text-sm text-brand-muted">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-brand-primary transition-colors hover:text-brand-accent">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
