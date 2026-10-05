/*
  =====================================================
  PÁGINA DE LOGIN - pages/LoginPage.tsx (shadcn/ui)
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: doLogin, isPending, error } = useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      login(data);
      navigate('/dashboard');
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    doLogin(values);
  };

  const errorMessage = error
    ? (error as any)?.response?.data?.message ?? 'Correo o contraseña incorrectos.'
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">     
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
      </div>

      <div className="relative w-full max-w-md">
        {/* Header de la marca */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-green-700 to-green-600 shadow-xl shadow-green-600/25">
            <LogIn size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-green-950">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-green-950">Ingresa tus credenciales para acceder a tus tareas</p>
        </div>

        {/* Tarjeta Shadcn */}
        <Card className="border-green-200 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="••••••••"
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
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-green-950">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-green-700 hover:text-green-800 underline-offset-4 hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
