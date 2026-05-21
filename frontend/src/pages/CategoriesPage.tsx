import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { api, apiMessage } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { Category } from '../types/api';

const schema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional()
});

type FormValues = z.infer<typeof schema>;

const TAG_COLORS = [
  'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
];

export function CategoriesPage() {
  const queryClient = useQueryClient();
  const isStaff = useAuthStore((state) => state.isStaff());
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { data = [], isLoading, isError, refetch } = useQuery({
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
      <PageHeader title="Categories" description="Searchable subject groupings for the catalog" />

      {isStaff && (
        <form
          className="panel grid gap-4 p-5 lg:grid-cols-[1fr_2fr_auto]"
          onSubmit={handleSubmit((values) => createCategory.mutate(values))}
          id="add-category-form"
        >
          <div>
            <input
              className="input"
              placeholder="Category name *"
              {...register('name')}
              id="category-name"
            />
            {formState.errors.name && (
              <p className="text-xs text-destructive mt-1">{formState.errors.name.message}</p>
            )}
          </div>
          <input
            className="input"
            placeholder="Description (optional)"
            {...register('description')}
            id="category-desc"
          />
          <button
            className="btn-primary"
            disabled={formState.isSubmitting || createCategory.isPending}
            id="add-category-btn"
          >
            <Plus className="h-4 w-4" />
            {createCategory.isPending ? 'Adding…' : 'Add'}
          </button>
        </form>
      )}

      {isLoading ? (
        <PageLoader />
      ) : isError ? (
        <ErrorState
          message="Could not load categories. Please try again."
          onRetry={refetch}
        />
      ) : data.length === 0 ? (
        <section className="panel overflow-hidden">
          <EmptyState label="No categories yet. Add one above." />
        </section>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((category, i) => (
            <div
              key={category.id}
              className="panel p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                  <Tag className="h-3 w-3" />
                  {category.name}
                </div>
                <span className="text-2xl font-bold text-muted-foreground/40 tabular-nums">
                  {category.bookCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description ?? 'No description provided.'}
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                {category.bookCount} {category.bookCount === 1 ? 'book' : 'books'} in this category
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
