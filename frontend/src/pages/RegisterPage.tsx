import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { AuthResponse } from '../types/api';

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(160),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[0-9]/, 'Must include a number'),
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
      toast.success('Account created! Welcome to Libris.');
      navigate('/app');
    } catch (error) {
      toast.error(apiMessage(error, 'Registration failed'));
    }
  }

  const errors = formState.errors;

  return (
    <main className="grid min-h-screen bg-muted/30 px-4 py-8">
      <section className="m-auto w-full max-w-xl panel p-8">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <BookOpen className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Reader access is granted immediately</p>
        </div>

        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} id="register-form">
          <div className="sm:col-span-2">
            <label className="label block mb-1" htmlFor="reg-fullname">Full Name *</label>
            <input
              className="input"
              id="reg-fullname"
              placeholder="Your full name"
              autoComplete="name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label className="label block mb-1" htmlFor="reg-email">Email *</label>
            <input
              className="input"
              type="email"
              id="reg-email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="label block mb-1" htmlFor="reg-password">Password *</label>
            <input
              className="input"
              type="password"
              id="reg-password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="label block mb-1" htmlFor="reg-phone">Phone</label>
            <input
              className="input"
              id="reg-phone"
              placeholder="+91 98765 43210"
              {...register('phone')}
            />
          </div>
          <div>
            <label className="label block mb-1" htmlFor="reg-address">Address</label>
            <input
              className="input"
              id="reg-address"
              placeholder="City, State"
              {...register('address')}
            />
          </div>
          <button
            className="btn-primary sm:col-span-2 h-10"
            disabled={formState.isSubmitting}
            id="register-submit"
          >
            <UserPlus className="h-4 w-4" />
            {formState.isSubmitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <Link className="font-medium text-primary hover:underline" to="/login" id="login-link">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
