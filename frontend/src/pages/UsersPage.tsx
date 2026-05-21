import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import { getInitials } from '../lib/utils';
import type { PageResponse, User } from '../types/api';

const schema = z.object({
  fullName: z.string().min(2).max(160),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'LIBRARIAN', 'USER']),
  phone: z.string().optional(),
  address: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  LIBRARIAN: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  USER: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export function UsersPage() {
  const queryClient = useQueryClient();
  const isStaff = useAuthStore((state) => state.isStaff());
  const [page, setPage] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'USER' }
  });
  const users = useQuery({
    queryKey: ['users', page],
    queryFn: async () =>
      (await api.get<PageResponse<User>>(`/users?page=${page}&size=10&sort=fullName`)).data
  });
  const createUser = useMutation({
    mutationFn: async (values: FormValues) =>
      (
        await api.post<User>('/users', {
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          roles: [values.role],
          profile: { phone: values.phone, address: values.address }
        })
      ).data,
    onSuccess: () => {
      toast.success('User created successfully');
      reset({ role: 'USER' });
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not create user'))
  });

  const errors = formState.errors;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Patrons, librarians, and administrators"
        actions={
          isStaff ? (
            <button
              className="btn-primary"
              onClick={() => setShowCreate((value) => !value)}
              id="add-user-btn"
            >
              <Plus className="h-4 w-4" />
              {showCreate ? 'Cancel' : 'Add User'}
            </button>
          ) : null
        }
      />

      {showCreate && isStaff && (
        <form
          className="panel grid gap-4 p-5 lg:grid-cols-3"
          onSubmit={handleSubmit((values) => createUser.mutate(values))}
          id="add-user-form"
        >
          <div>
            <input className="input" placeholder="Full name *" {...register('fullName')} id="user-fullname" />
            {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <input className="input" placeholder="Email *" type="email" {...register('email')} id="user-email" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input className="input" placeholder="Password *" type="password" {...register('password')} id="user-password" />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>
          <select className="input" {...register('role')} id="user-role">
            <option value="USER">User (Patron)</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input className="input" placeholder="Phone (optional)" {...register('phone')} id="user-phone" />
          <input className="input" placeholder="Address (optional)" {...register('address')} id="user-address" />
          <button
            className="btn-primary lg:col-span-3"
            disabled={formState.isSubmitting || createUser.isPending}
            id="save-user-btn"
          >
            <Plus className="h-4 w-4" />
            {createUser.isPending ? 'Creating…' : 'Save User'}
          </button>
        </form>
      )}

      <section className="panel overflow-hidden">
        {users.isLoading ? (
          <PageLoader />
        ) : users.isError ? (
          <ErrorState
            message="Could not load users. Please try again."
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
          />
        ) : (users.data?.content ?? []).length === 0 ? (
          <EmptyState label="No users found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Roles</th>
                  <th className="px-4 py-3 text-left">Active Borrows</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.data?.content.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span key={role} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${ROLE_STYLES[role] ?? ''}`}>
                            {role === 'ADMIN' && <ShieldCheck className="h-3 w-3" />}
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full text-xs font-semibold ${user.activeBorrowCount > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-muted-foreground'}`}>
                        {user.activeBorrowCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${user.enabled ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {user.enabled ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                        {user.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.profile?.phone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={users.data?.page ?? page}
          totalPages={users.data?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
