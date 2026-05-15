import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BookOpen, Clock, Users } from 'lucide-react';
import { api } from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import type { DashboardStats } from '../types/api';

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get<DashboardStats>('/dashboard/stats')).data
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Live circulation and catalog health" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Books" value={isLoading ? '-' : data?.bookCount ?? 0} icon={BookOpen} tone="teal" />
        <StatCard label="Users" value={isLoading ? '-' : data?.userCount ?? 0} icon={Users} tone="blue" />
        <StatCard label="Borrowed" value={isLoading ? '-' : data?.activeBorrowCount ?? 0} icon={Clock} tone="amber" />
        <StatCard label="Overdue" value={isLoading ? '-' : data?.overdueBorrowCount ?? 0} icon={AlertTriangle} tone="rose" />
      </div>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Popular Categories</h2>
        </div>
        <div className="space-y-3">
          {(data?.popularCategories ?? []).map((item) => {
            const max = Math.max(...(data?.popularCategories ?? [{ bookCount: 1 }]).map((category) => category.bookCount), 1);
            return (
              <div key={item.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span className="text-slate-500 dark:text-slate-400">{item.bookCount}</span>
                </div>
                <div className="h-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="h-2 rounded-lg bg-mint" style={{ width: `${(item.bookCount / max) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
