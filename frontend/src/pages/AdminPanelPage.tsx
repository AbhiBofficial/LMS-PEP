import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { PageLoader } from '../components/LoadingSpinner';
import { ErrorState } from '../components/ErrorState';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import type { AuditLog, PageResponse } from '../types/api';

const ACTION_STYLES: Record<string, string> = {
  CREATE: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  UPDATE: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  DELETE: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  BORROW: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  RETURN: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  LOGIN: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  LOGOUT: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

function getActionStyle(action: string) {
  for (const key of Object.keys(ACTION_STYLES)) {
    if (action.toUpperCase().includes(key)) {
      return ACTION_STYLES[key];
    }
  }
  return 'bg-muted text-muted-foreground';
}

export function AdminPanelPage() {
  const [page, setPage] = useState(0);
  const auditLogs = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () =>
      (await api.get<PageResponse<AuditLog>>(`/audit-logs?page=${page}&size=15&sort=createdAt,desc`)).data
  });
  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await api.get<string[]>('/admin/roles')).data
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Panel" description="RBAC configuration and real-time audit stream" />

      {/* Roles Section */}
      <section className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">System Roles</h2>
        </div>
        {roles.isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(roles.data ?? []).map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1 text-sm font-medium"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {role}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Audit Logs Section */}
      <section className="panel overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50">
          <h2 className="font-semibold">Audit Logs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">All system actions, newest first</p>
        </div>

        {auditLogs.isLoading ? (
          <PageLoader />
        ) : auditLogs.isError ? (
          <ErrorState
            message="Could not load audit logs. Please try again."
            onRetry={() => auditLogs.refetch()}
          />
        ) : (auditLogs.data?.content ?? []).length === 0 ? (
          <EmptyState label="No audit records yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Actor</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Entity</th>
                  <th className="px-4 py-3 text-left">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {auditLogs.data?.content.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{log.actorEmail ?? '—'}</span>
                      {log.ipAddress && (
                        <span className="block text-xs text-muted-foreground font-mono">{log.ipAddress}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {log.entityType ? (
                        <span>
                          {log.entityType}
                          {log.entityId ? <span className="font-mono"> #{log.entityId}</span> : ''}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs">
                      <span className="truncate block">{log.message ?? '—'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={auditLogs.data?.page ?? page}
          totalPages={auditLogs.data?.totalPages ?? 0}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
}
