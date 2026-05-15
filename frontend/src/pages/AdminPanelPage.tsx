import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import type { AuditLog, PageResponse } from '../types/api';

export function AdminPanelPage() {
  const [page, setPage] = useState(0);
  const auditLogs = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () => (await api.get<PageResponse<AuditLog>>(`/audit-logs?page=${page}&size=10&sort=createdAt,desc`)).data
  });
  const roles = useQuery({
    queryKey: ['roles'],
    queryFn: async () => (await api.get<string[]>('/admin/roles')).data
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Panel" description="RBAC inventory and audit stream" />

      <section className="panel p-5">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-mint" />
          <h2 className="font-semibold">Roles</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(roles.data ?? []).map((role) => (
            <span key={role} className="rounded-lg bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800">{role}</span>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        {(auditLogs.data?.content ?? []).length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.data?.content.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">{log.actorEmail ?? '-'}</td>
                    <td className="px-4 py-3">{log.action}</td>
                    <td className="px-4 py-3">{log.entityType ?? '-'} {log.entityId ?? ''}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{log.message ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={auditLogs.data?.page ?? page} totalPages={auditLogs.data?.totalPages ?? 0} onPageChange={setPage} />
      </section>
    </div>
  );
}
