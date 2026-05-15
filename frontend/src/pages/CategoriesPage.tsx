import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { Category } from '../types/api';

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional()
});

type FormValues = z.infer<typeof schema>;

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const isStaff = useAuthStore((state) => state.isStaff());
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { data = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data
  });
  const createCategory = useMutation({
    mutationFn: async (values: FormValues) => (await api.post<Category>('/categories', values)).data,
    onSuccess: () => {
      toast.success('Category added');
      reset();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not add category'))
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Searchable subject groupings" />

      {isStaff ? (
        <form className="panel grid gap-4 p-5 lg:grid-cols-[1fr_2fr_auto]" onSubmit={handleSubmit((values) => createCategory.mutate(values))}>
          <input className="input" placeholder="Category name" {...register('name')} />
          <input className="input" placeholder="Description" {...register('description')} />
          <button className="btn-primary" disabled={formState.isSubmitting || createCategory.isPending}>
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      ) : null}

      <section className="panel overflow-hidden">
        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Books</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{category.description ?? '-'}</td>
                  <td className="px-4 py-3">{category.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
