import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'teal' | 'amber' | 'blue' | 'rose';
};

const tones = {
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
};

export function StatCard({ label, value, icon: Icon, tone = 'teal' }: Props) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
