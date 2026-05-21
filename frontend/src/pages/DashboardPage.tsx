import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, BookOpen, Clock, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { api } from '../lib/api';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import type { DashboardStats } from '../types/api';

export function DashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get<DashboardStats>('/dashboard/stats')).data
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Live circulation and catalog health" />
        <PageLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Live circulation and catalog health" />
        <ErrorState
          message="Could not load dashboard statistics. The server may be waking up — please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const max = Math.max(...(data?.popularCategories ?? [{ bookCount: 1 }]).map((c) => c.bookCount), 1);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Live circulation and catalog health" />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Books" value={data?.bookCount ?? 0} icon={BookOpen} tone="teal" />
        <StatCard label="Registered Users" value={data?.userCount ?? 0} icon={Users} tone="blue" />
        <StatCard label="Active Borrows" value={data?.activeBorrowCount ?? 0} icon={Clock} tone="amber" />
        <StatCard label="Overdue" value={data?.overdueBorrowCount ?? 0} icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Popular Categories */}
        <section className="panel p-5">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Popular Categories</h2>
          </div>
          {(data?.popularCategories ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No category data available.</p>
          ) : (
            <div className="space-y-4">
              {(data?.popularCategories ?? []).map((item) => (
                <div key={item.category}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground tabular-nums">{item.bookCount} books</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-700 ease-out"
                      style={{ width: `${(item.bookCount / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Stats Summary */}
        <section className="panel p-5">
          <div className="mb-5 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Library Health</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                label: 'Books in circulation',
                value: data?.activeBorrowCount ?? 0,
                total: data?.bookCount ?? 1,
                color: 'bg-amber-500'
              },
              {
                label: 'Overdue rate',
                value: data?.overdueBorrowCount ?? 0,
                total: Math.max(data?.activeBorrowCount ?? 1, 1),
                color: 'bg-rose-500'
              },
              {
                label: 'Books available',
                value: (data?.bookCount ?? 0) - (data?.activeBorrowCount ?? 0),
                total: data?.bookCount ?? 1,
                color: 'bg-teal-500'
              }
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold tabular-nums">{item.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${Math.min((item.value / item.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-border/50 mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Avg Borrows / User</p>
                <p className="text-lg font-bold">
                  {data?.userCount ? ((data.activeBorrowCount ?? 0) / data.userCount).toFixed(1) : '—'}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">Overdue %</p>
                <p className="text-lg font-bold text-rose-500">
                  {data?.activeBorrowCount
                    ? `${(((data.overdueBorrowCount ?? 0) / data.activeBorrowCount) * 100).toFixed(0)}%`
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
