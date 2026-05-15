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
import type { Author } from '../types/api';

const schema = z.object({
  name: z.string().min(2).max(160),
  biography: z.string().max(1500).optional()
});

type FormValues = z.infer<typeof schema>;

export function AuthorsPage() {
  const queryClient = useQueryClient();
  const isStaff = useAuthStore((state) => state.isStaff());
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { data = [] } = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await api.get<Author[]>('/authors')).data
  });
  const createAuthor = useMutation({
    mutationFn: async (values: FormValues) => (await api.post<Author>('/authors', values)).data,
    onSuccess: () => {
      toast.success('Author added');
      reset();
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not add author'))
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Authors" description="Catalog contributors and their book counts" />

      {isStaff ? (
        <form className="panel grid gap-4 p-5 lg:grid-cols-[1fr_2fr_auto]" onSubmit={handleSubmit((values) => createAuthor.mutate(values))}>
          <input className="input" placeholder="Author name" {...register('name')} />
          <input className="input" placeholder="Biography" {...register('biography')} />
          <button className="btn-primary" disabled={formState.isSubmitting || createAuthor.isPending}>
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
                <th className="px-4 py-3">Biography</th>
                <th className="px-4 py-3">Books</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.map((author) => (
                <tr key={author.id}>
                  <td className="px-4 py-3 font-medium">{author.name}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{author.biography ?? '-'}</td>
                  <td className="px-4 py-3">{author.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
