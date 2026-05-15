import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookPlus, CheckCircle2, RotateCcw, Search, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
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
  authorId: z.coerce.number().min(1),
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
      toast.success('Book added');
      reset({ totalCopies: 1, categoryIds: [] });
      setShowCreate(false);
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not add book'))
  });

  const borrowBook = useMutation({
    mutationFn: async (bookId: number) => (await api.put<BorrowHistory>(`/books/${bookId}/borrow/${currentUser?.id}`)).data,
    onSuccess: () => {
      toast.success('Book borrowed');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrow-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not borrow book'))
  });

  const returnBook = useMutation({
    mutationFn: async (bookId: number) => (await api.put<BorrowHistory>(`/books/${bookId}/return`)).data,
    onSuccess: (history) => {
      toast.success(history.fineAmount > 0 ? `Returned with fine ${history.fineAmount}` : 'Book returned');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrow-history'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(apiMessage(error, 'Could not return book'))
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Search, filter, borrow, return, and maintain inventory"
        actions={
          isStaff ? (
            <button className="btn-primary" onClick={() => setShowCreate((value) => !value)}>
              <BookPlus className="h-4 w-4" />
              Add Book
            </button>
          ) : null
        }
      />

      <section className="panel grid gap-3 p-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input className="input pl-9" placeholder="Search title, ISBN, or description" value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(0);
          }} />
        </label>
        <select className="input" value={authorId} onChange={(event) => {
          setAuthorId(event.target.value);
          setPage(0);
        }}>
          <option value="">All authors</option>
          {(authors.data ?? []).map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
        </select>
        <select className="input" value={categoryId} onChange={(event) => {
          setCategoryId(event.target.value);
          setPage(0);
        }}>
          <option value="">All categories</option>
          {(categories.data ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <select className="input" value={available} onChange={(event) => {
          setAvailable(event.target.value);
          setPage(0);
        }}>
          <option value="">Any availability</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </section>

      {showCreate ? (
        <form className="panel grid gap-4 p-5 lg:grid-cols-3" onSubmit={handleSubmit((values) => createBook.mutate(values))}>
          <input className="input" placeholder="Title" {...register('title')} />
          <input className="input" placeholder="ISBN" {...register('isbn')} />
          <input className="input" placeholder="Publication year" type="number" {...register('publicationYear')} />
          <input className="input" placeholder="Total copies" type="number" {...register('totalCopies')} />
          <input className="input" placeholder="Shelf location" {...register('shelfLocation')} />
          <select className="input" {...register('authorId')}>
            <option value="">Select author</option>
            {(authors.data ?? []).map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}
          </select>
          <select className="input min-h-28 lg:col-span-1" multiple {...register('categoryIds')}>
            {(categories.data ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <textarea className="input min-h-28 lg:col-span-2" placeholder="Description" {...register('description')} />
          <button className="btn-primary lg:col-span-3" disabled={formState.isSubmitting || createBook.isPending}>
            <BookPlus className="h-4 w-4" />
            Save Book
          </button>
        </form>
      ) : null}

      <section className="panel overflow-hidden">
        {(books.data?.content ?? []).length === 0 ? (
          <EmptyState label="No books match the current filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Categories</th>
                  <th className="px-4 py-3">Copies</th>
                  <th className="px-4 py-3">Shelf</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {books.data?.content.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{book.isbn}</div>
                    </td>
                    <td className="px-4 py-3">{book.author?.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {book.categories.map((category) => (
                          <span key={category.id} className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={book.availableCopies > 0 ? 'text-mint' : 'text-rose-600'}>
                        {book.availableCopies}/{book.totalCopies}
                      </span>
                    </td>
                    <td className="px-4 py-3">{book.shelfLocation ?? '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="btn-secondary h-9 px-3" disabled={book.availableCopies <= 0 || borrowBook.isPending} onClick={() => borrowBook.mutate(book.id)}>
                          <CheckCircle2 className="h-4 w-4" />
                          Borrow
                        </button>
                        <button className="btn-secondary h-9 px-3" disabled={returnBook.isPending} onClick={() => returnBook.mutate(book.id)}>
                          {book.availableCopies === book.totalCopies ? <XCircle className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                          Return
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={books.data?.page ?? page} totalPages={books.data?.totalPages ?? 0} onPageChange={setPage} />
      </section>
    </div>
  );
}
