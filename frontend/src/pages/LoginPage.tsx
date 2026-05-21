import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, KeyRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { AuthResponse } from '../types/api';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' }
  });

  if (token) {
    return <Navigate to="/app" replace />;
  }

  // Auto-fill demo credentials if navigated with state.demo
  const isDemo = (location.state as { demo?: boolean } | null)?.demo;

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', values);
      setAuth(data);
      toast.success('Signed in successfully');
      navigate('/app');
    } catch (error) {
      toast.error(apiMessage(error, 'Login failed'));
    }
  }

  function fillDemo() {
    setValue('email', 'admin@library.local');
    setValue('password', 'Password123!');
  }

  const errors = formState.errors;

  return (
    <main className="grid min-h-screen bg-muted/30 px-4 py-8">
      <section className="m-auto w-full max-w-md panel p-8">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your Libris account</p>
        </div>

        {/* Demo Banner */}
        {isDemo && (
          <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <p className="font-medium text-primary mb-1">👋 Demo mode</p>
            <p className="text-muted-foreground text-xs">Click the button below to fill in demo credentials.</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} id="login-form">
          <div>
            <label className="label block mb-1" htmlFor="login-email">Email</label>
            <input
              className="input"
              type="email"
              id="login-email"
              autoComplete="email"
              placeholder="admin@library.local"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label block mb-1" htmlFor="login-password">Password</label>
            <input
              className="input"
              type="password"
              id="login-password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <button
            className="btn-primary w-full h-10"
            disabled={formState.isSubmitting}
            id="login-submit"
          >
            <KeyRound className="h-4 w-4" />
            {formState.isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Demo fill button */}
        <button
          type="button"
          onClick={fillDemo}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors py-1"
          id="demo-fill-btn"
        >
          Use demo credentials (Admin)
        </button>

        <div className="mt-5 pt-5 border-t border-border/50 space-y-1 text-center">
          <p className="text-xs text-muted-foreground">
            Demo: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">admin@library.local</code> /{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Password123!</code>
          </p>
          <p className="text-sm text-muted-foreground">
            New reader?{' '}
            <Link className="font-medium text-primary hover:underline" to="/register" id="register-link">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
