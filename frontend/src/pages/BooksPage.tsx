import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookPlus, CheckCircle2, Edit2, RotateCcw, Search, XCircle } from 'lucide-react';
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
import type { Author, Book, BorrowHistory, Category, PageResponse } from '../types/api';

const formSchema = z.object({
  title: z.string().min(2).max(220),
  isbn: z.string().min(10).max(32),
  description: z.string().max(2000).optional(),
  publicationYear: z.coerce.number().min(1000).max(3000).optional(),
  totalCopies: z.coerce.number().min(1),
  shelfLocation: z.string().max(80).optional(),
  authorId: z.coerce.number().min(1, 'Please select an author'),
  categoryIds: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

export function BooksPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const isStaff = useAuthStore((state) => state.isStaff());
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [available, setAvailable] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { totalCopies: 1, categoryIds: [] }
  });

  const authors = useQuery({
    queryKey: ['authors'],
    queryFn: async () => (await api.get<Author[]>('/authors')).data
  });
  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get<Category[]>('/categories')).data
  });
  const books = useQuery({
    queryKey: ['books', page, search, available, authorId, categoryId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: '10', sort: 'title' });
      if (search) params.set('search', search);
      if (available) params.set('available', available);
      if (authorId) params.set('authorId', authorId);
      if (categoryId) params.set('categoryId', categoryId);
      return (await api.get<PageResponse<Book>>(`/books?${params}`)).data;
    }
  });

  const createBook = useMutation({
    mutationFn: async (values: FormValues) =>
      (
        await api.post<Book>('/books', {
          ...values,
          categoryIds: (values.categoryIds ?? []).map(Number)
        })
      ).data,
    onSuccess: () => {
      toast.success('Book added successfully');
      reset({ totalCopies: 1, categoryIds: [] });
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not add book'))
  });

  const borrowBook = useMutation({
    mutationFn: async (bookId: number) =>
      (await api.put<BorrowHistory>(`/books/${bookId}/borrow/${currentUser?.id}`)).data,
    onSuccess: () => {
      toast.success('Book borrowed successfully! Due in 14 days.');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrow-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not borrow book'))
  });

  const returnBook = useMutation({
    mutationFn: async (bookId: number) =>
      (await api.put<BorrowHistory>(`/books/${bookId}/return`)).data,
    onSuccess: (history) => {
      if (history.fineAmount > 0) {
        toast.warning(`Book returned with fine: ₹${history.fineAmount.toFixed(2)}`);
      } else {
        toast.success('Book returned successfully!');
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrow-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not return book'))
  });

  const errors = formState.errors;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Search, filter, borrow, return, and maintain inventory"
        actions={
          isStaff ? (
            <button
              className="btn-primary"
              onClick={() => setShowCreate((value) => !value)}
              id="add-book-btn"
            >
              <BookPlus className="h-4 w-4" />
              {showCreate ? 'Cancel' : 'Add Book'}
            </button>
          ) : null
        }
      />

      {/* Filters */}
      <section className="panel grid gap-3 p-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="input pl-9"
            placeholder="Search title, ISBN, or description…"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(0); }}
            id="book-search"
          />
        </label>
        <select
          className="input"
          value={authorId}
          onChange={(event) => { setAuthorId(event.target.value); setPage(0); }}
          id="author-filter"
        >
          <option value="">All authors</option>
          {(authors.data ?? []).map((author) => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>
        <select
          className="input"
          value={categoryId}
          onChange={(event) => { setCategoryId(event.target.value); setPage(0); }}
          id="category-filter"
        >
          <option value="">All categories</option>
          {(categories.data ?? []).map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          className="input"
          value={available}
          onChange={(event) => { setAvailable(event.target.value); setPage(0); }}
          id="availability-filter"
        >
          <option value="">Any availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </section>

      {/* Add Book Form */}
      {showCreate && (
        <form
          className="panel grid gap-4 p-5 lg:grid-cols-3"
          onSubmit={handleSubmit((values) => createBook.mutate(values))}
          id="add-book-form"
        >
          <div>
            <input className="input" placeholder="Title *" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <input className="input" placeholder="ISBN *" {...register('isbn')} />
            {errors.isbn && <p className="text-xs text-destructive mt-1">{errors.isbn.message}</p>}
          </div>
          <input className="input" placeholder="Publication year" type="number" {...register('publicationYear')} />
          <input className="input" placeholder="Total copies *" type="number" {...register('totalCopies')} />
          <input className="input" placeholder="Shelf location (e.g. A1-JAVA)" {...register('shelfLocation')} />
          <div>
            <select className="input" {...register('authorId')}>
              <option value="">Select author *</option>
              {(authors.data ?? []).map((author) => (
                <option key={author.id} value={author.id}>{author.name}</option>
              ))}
            </select>
            {errors.authorId && <p className="text-xs text-destructive mt-1">{errors.authorId.message}</p>}
          </div>
          <div className="lg:col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">Categories (hold Ctrl to select multiple)</label>
            <select className="input min-h-28" multiple {...register('categoryIds')}>
              {(categories.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <textarea className="input min-h-28 lg:col-span-2" placeholder="Description (optional)" {...register('description')} />
          <button
            className="btn-primary lg:col-span-3"
            disabled={formState.isSubmitting || createBook.isPending}
            id="save-book-btn"
          >
            <BookPlus className="h-4 w-4" />
            {createBook.isPending ? 'Saving…' : 'Save Book'}
          </button>
        </form>
      )}

      {/* Books Table */}
      <section className="panel overflow-hidden">
        {books.isLoading ? (
          <PageLoader />
        ) : books.isError ? (
          <ErrorState
            message={apiMessage(books.error, 'Could not load books')}
            onRetry={() => queryClient.invalidateQueries({ queryKey: ['books'] })}
          />
        ) : (books.data?.content ?? []).length === 0 ? (
          <EmptyState label="No books match the current filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Title / ISBN</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Categories</th>
                  <th className="px-4 py-3 text-left">Copies</th>
                  <th className="px-4 py-3 text-left">Shelf</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {books.data?.content.map((book) => (
                  <tr key={book.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-xs text-muted-foreground font-mono">{book.isbn}</div>
                      {book.publicationYear && (
                        <div className="text-xs text-muted-foreground">{book.publicationYear}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{book.author?.name ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {book.categories.map((category) => (
                          <span
                            key={category.id}
                            className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          book.availableCopies > 0
                            ? 'font-semibold text-teal-600 dark:text-teal-400'
                            : 'font-semibold text-rose-600 dark:text-rose-400'
                        }
                      >
                        {book.availableCopies}
                      </span>
                      <span className="text-muted-foreground">/{book.totalCopies}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{book.shelfLocation ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary h-8 px-3 text-xs"
                          disabled={book.availableCopies <= 0 || borrowBook.isPending}
                          onClick={() => borrowBook.mutate(book.id)}
                          title={book.availableCopies <= 0 ? 'No copies available' : 'Borrow this book'}
                          id={`borrow-${book.id}`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Borrow
                        </button>
                        {isStaff && (
                          <button
                            className="btn-secondary h-8 px-3 text-xs"
                            disabled={returnBook.isPending || book.availableCopies >= book.totalCopies}
                            onClick={() => returnBook.mutate(book.id)}
                            title="Return this book"
                            id={`return-${book.id}`}
                          >
                            {book.availableCopies >= book.totalCopies
                              ? <XCircle className="h-3.5 w-3.5" />
                              : <RotateCcw className="h-3.5 w-3.5" />}
                            Return
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={books.data?.page ?? page}
          totalPages={books.data?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
