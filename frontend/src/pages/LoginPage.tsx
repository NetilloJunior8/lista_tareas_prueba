/*
  =====================================================
  PÁGINA DE LOGIN - pages/LoginPage.tsx
  =====================================================
  Esta página usa React Hook Form + Zod para validar.
  La petición al backend usa useMutation de TanStack Query.

  ¿Qué es useMutation?
  Es para operaciones que MODIFICAN datos (POST, PUT, DELETE).
  A diferencia de useQuery (para GET), las mutaciones
  no se ejecutan automáticamente; se ejecutan cuando
  tú llamas a 'mutate()' o 'mutateAsync()'.

  Propiedades útiles de useMutation:
  - isPending: true mientras la petición está en curso
  - isError: true si la petición falló
  - error: el objeto de error con la respuesta del backend
  =====================================================
*/

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '../lib/validations';
import { loginService } from '../api/services';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Conectamos el formulario con el esquema Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // useMutation maneja el estado de la petición POST /auth/login
  const { mutate: doLogin, isPending, error } = useMutation({
    mutationFn: loginService, // La función que llama al backend
    onSuccess: (data) => {
      // Si el backend responde con éxito (2xx):
      login(data);           // Guardamos el usuario en el contexto global
      navigate('/dashboard'); // Redirigimos al dashboard
    },
    // onError se llama automáticamente si la promesa falla.
    // No necesitamos hacer nada aquí porque usamos el objeto 'error' de arriba.
  });

  // React Hook Form llama a esta función solo si Zod valida correctamente.
  const onSubmit = (values: LoginFormValues) => {
    doLogin(values);
  };

  // Extraemos el mensaje de error del backend si existe.
  // axios guarda la respuesta del servidor en error.response.data
  const errorMessage = error
    ? (error as any)?.response?.data?.message ?? 'Correo o contraseña incorrectos.'
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      {/* Fondo decorativo con gradiente radial */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/30">
            <LogIn size={26} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text">Bienvenido</h1>
          <p className="mt-2 text-brand-muted">Inicia sesión en tu cuenta</p>
        </div>

        {/* Tarjeta del formulario */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

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

            {/* Campo Contraseña con toggle de visibilidad */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-brand-muted">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="••••••••"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary py-3 font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-primary-hover hover:shadow-brand-primary/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <><Loader2 size={18} className="animate-spin" /> Iniciando sesión...</>
              ) : (
                <>Iniciar Sesión</>
              )}
            </button>
          </form>

          {/* Link a registro */}
          <p className="mt-6 text-center text-sm text-brand-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-brand-primary transition-colors hover:text-brand-accent">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
