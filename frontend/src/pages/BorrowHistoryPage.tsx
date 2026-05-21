import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { formatCurrency, formatDate } from '../lib/utils';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { BorrowHistory, PageResponse } from '../types/api';

const STATUS_STYLES: Record<string, string> = {
  BORROWED: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  RETURNED: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  LOST: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export function BorrowHistoryPage() {
  const [page, setPage] = useState(0);
  const isStaff = useAuthStore((state) => state.isStaff());
  const [userId, setUserId] = useState('');
  const history = useQuery({
    queryKey: ['borrow-history', page, userId],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), size: '10', sort: 'borrowedAt,desc' });
      if (isStaff && userId) params.set('userId', userId);
      return (await api.get<PageResponse<BorrowHistory>>(`/borrow-history?${params}`)).data;
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Borrow History" description="Due dates, returns, and fine tracking" />

      {isStaff && (
        <section className="panel p-4">
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Filter by User ID</span>
            <input
              className="input max-w-xs"
              placeholder="Enter user ID to filter…"
              value={userId}
              onChange={(event) => {
                setUserId(event.target.value);
                setPage(0);
              }}
              id="user-id-filter"
            />
          </label>
        </section>
      )}

      <section className="panel overflow-hidden">
        {history.isLoading ? (
          <PageLoader />
        ) : history.isError ? (
          <ErrorState
            message="Could not load borrow history. Please try again."
            onRetry={() => history.refetch()}
          />
        ) : (history.data?.content ?? []).length === 0 ? (
          <EmptyState label="No borrow records found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Book</th>
                  <th className="px-4 py-3 text-left">Borrower</th>
                  <th className="px-4 py-3 text-left">Borrowed</th>
                  <th className="px-4 py-3 text-left">Due</th>
                  <th className="px-4 py-3 text-left">Returned</th>
                  <th className="px-4 py-3 text-left">Fine</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {history.data?.content.map((item) => {
                  const isOverdue =
                    item.status === 'BORROWED' && new Date(item.dueDate) < new Date();
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium max-w-[180px]">
                        <span className="truncate block">{item.book.title}</span>
                        <span className="text-xs font-mono text-muted-foreground">{item.book.isbn}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{item.user.fullName}</span>
                        <span className="block text-xs text-muted-foreground">{item.user.email}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(item.borrowedAt)}</td>
                      <td className={`px-4 py-3 font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                        {formatDate(item.dueDate)}
                        {isOverdue && (
                          <span className="block text-xs text-rose-500">Overdue</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.returnedAt ? formatDate(item.returnedAt) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {item.fineAmount > 0 ? (
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            {formatCurrency(item.fineAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[item.status] ?? ''}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={history.data?.page ?? page}
          totalPages={history.data?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
