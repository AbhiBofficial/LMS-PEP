import { Inbox } from 'lucide-react';

export function EmptyState({ label = 'No records found' }: { label?: string }) {
  return (
    <div className="grid place-items-center gap-2 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
      <Inbox className="h-8 w-8" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
