import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Feather, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
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
  const { data = [], isLoading, isError, refetch } = useQuery({
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

      {isStaff && (
        <form
          className="panel grid gap-4 p-5 lg:grid-cols-[1fr_2fr_auto]"
          onSubmit={handleSubmit((values) => createAuthor.mutate(values))}
          id="add-author-form"
        >
          <div>
            <input className="input" placeholder="Author name *" {...register('name')} id="author-name" />
            {formState.errors.name && (
              <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>
            )}
          </div>
          <input className="input" placeholder="Biography (optional)" {...register('biography')} id="author-bio" />
          <button
            className="btn-primary"
            disabled={formState.isSubmitting || createAuthor.isPending}
            id="add-author-btn"
          >
            <Plus className="h-4 w-4" />
            {createAuthor.isPending ? 'Adding…' : 'Add'}
          </button>
        </form>
      )}

      <section className="panel overflow-hidden">
        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <ErrorState
            message="Could not load authors. Please try again."
            onRetry={refetch}
          />
        ) : data.length === 0 ? (
          <EmptyState label="No authors yet. Add one above." />
        ) : (
          <table className="w-full text-sm">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Biography</th>
                <th className="px-4 py-3 text-right">Books</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.map((author) => (
                <tr key={author.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Feather className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">{author.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-sm">
                    <p className="truncate">{author.biography ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {author.bookCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
