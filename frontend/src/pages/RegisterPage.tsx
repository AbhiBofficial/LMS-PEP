import { zodResolver } from '@hookform/resolvers/zod';
import { Library, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { AuthResponse } from '../types/api';

const schema = z.object({
  fullName: z.string().min(2).max(160),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  address: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  if (token) {
    return <Navigate to="/app" replace />;
  }

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        profile: { phone: values.phone, address: values.address }
      });
      setAuth(data);
      toast.success('Account created');
      navigate('/app');
    } catch (error) {
      toast.error(apiMessage(error, 'Registration failed'));
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <section className="m-auto w-full max-w-xl panel p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-white">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-950 dark:text-white">Create Account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Reader access is created immediately</p>
          </div>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <label className="block sm:col-span-2">
            <span className="label">Full Name</span>
            <input className="input mt-1" {...register('fullName')} />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input className="input mt-1" type="email" {...register('email')} />
          </label>
          <label className="block">
            <span className="label">Password</span>
            <input className="input mt-1" type="password" {...register('password')} />
          </label>
          <label className="block">
            <span className="label">Phone</span>
            <input className="input mt-1" {...register('phone')} />
          </label>
          <label className="block">
            <span className="label">Address</span>
            <input className="input mt-1" {...register('address')} />
          </label>
          <button className="btn-primary sm:col-span-2" disabled={formState.isSubmitting}>
            <UserPlus className="h-4 w-4" />
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link className="font-medium text-mint" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
