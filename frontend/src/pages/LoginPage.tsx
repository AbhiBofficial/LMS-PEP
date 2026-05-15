import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Library } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { AuthResponse } from '../types/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'admin@library.local', password: 'Password123!' }
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', values);
      setAuth(data);
      toast.success('Signed in');
      navigate('/');
    } catch (error) {
      toast.error(apiMessage(error, 'Login failed'));
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <section className="m-auto w-full max-w-md panel p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-white">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-950 dark:text-white">Library LMS</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="label">Email</span>
            <input className="input mt-1" type="email" {...register('email')} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="input mt-1" type="password" {...register('password')} />
          </label>
          <button className="btn-primary w-full" disabled={formState.isSubmitting}>
            <KeyRound className="h-4 w-4" />
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New reader? <Link className="font-medium text-mint" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
