import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { formatCurrency, formatDate } from '../lib/utils';
import { api } from '../lib/api';
import { useAuthStore } from '../store/auth';
import type { BorrowHistory, PageResponse } from '../types/api';

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

      {isStaff ? (
        <section className="panel p-4">
          <input className="input max-w-xs" placeholder="Filter by user ID" value={userId} onChange={(event) => {
            setUserId(event.target.value);
            setPage(0);
          }} />
        </section>
      ) : null}

      <section className="panel overflow-hidden">
        {(history.data?.content ?? []).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Borrowed</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Returned</th>
                  <th className="px-4 py-3">Fine</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.data?.content.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium">{item.book.title}</td>
                    <td className="px-4 py-3">{item.user.fullName}</td>
                    <td className="px-4 py-3">{formatDate(item.borrowedAt)}</td>
                    <td className="px-4 py-3">{formatDate(item.dueDate)}</td>
                    <td className="px-4 py-3">{formatDate(item.returnedAt)}</td>
                    <td className="px-4 py-3">{formatCurrency(item.fineAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={item.status === 'BORROWED' ? 'text-saffron' : 'text-mint'}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={history.data?.page ?? page} totalPages={history.data?.totalPages ?? 0} onPageChange={setPage} />
      </section>
    </div>
  );
}
