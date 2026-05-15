import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { api, apiMessage } from '../lib/api';
import type { PageResponse, User } from '../types/api';

const schema = z.object({
  fullName: z.string().min(2).max(160),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'LIBRARIAN', 'USER']),
  phone: z.string().optional(),
  address: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function UsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'USER' }
  });
  const users = useQuery({
    queryKey: ['users', page],
    queryFn: async () => (await api.get<PageResponse<User>>(`/users?page=${page}&size=10&sort=fullName`)).data
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
      toast.success('User created');
      reset({ role: 'USER' });
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not create user'))
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Patrons, librarians, and administrators"
        actions={
          <button className="btn-primary" onClick={() => setShowCreate((value) => !value)}>
            <Plus className="h-4 w-4" />
            Add User
          </button>
        }
      />

      {showCreate ? (
        <form className="panel grid gap-4 p-5 lg:grid-cols-3" onSubmit={handleSubmit((values) => createUser.mutate(values))}>
          <input className="input" placeholder="Full name" {...register('fullName')} />
          <input className="input" placeholder="Email" type="email" {...register('email')} />
          <input className="input" placeholder="Password" type="password" {...register('password')} />
          <select className="input" {...register('role')}>
            <option value="USER">User</option>
            <option value="LIBRARIAN">Librarian</option>
            <option value="ADMIN">Admin</option>
          </select>
          <input className="input" placeholder="Phone" {...register('phone')} />
          <input className="input" placeholder="Address" {...register('address')} />
          <button className="btn-primary lg:col-span-3" disabled={formState.isSubmitting || createUser.isPending}>
            <Plus className="h-4 w-4" />
            Save User
          </button>
        </form>
      ) : null}

      <section className="panel overflow-hidden">
        {(users.data?.content ?? []).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Borrowed</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.data?.content.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                    </td>
                    <td className="px-4 py-3">{user.roles.join(', ')}</td>
                    <td className="px-4 py-3">{user.activeBorrowCount}</td>
                    <td className="px-4 py-3">
                      <span className={user.enabled ? 'inline-flex items-center gap-1 text-mint' : 'inline-flex items-center gap-1 text-rose-600'}>
                        {user.enabled ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                        {user.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.profile?.phone ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={users.data?.page ?? page} totalPages={users.data?.totalPages ?? 0} onPageChange={setPage} />
      </section>
    </div>
  );
}
