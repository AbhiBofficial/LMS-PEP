import type { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: 'teal' | 'amber' | 'blue' | 'rose';
};

const tones = {
  teal: {
    card: 'border-l-4 border-l-teal-500',
    icon: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300',
    value: 'text-teal-700 dark:text-teal-300'
  },
  amber: {
    card: 'border-l-4 border-l-amber-500',
    icon: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
    value: 'text-amber-700 dark:text-amber-300'
  },
  blue: {
    card: 'border-l-4 border-l-sky-500',
    icon: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300',
    value: 'text-sky-700 dark:text-sky-300'
  },
  rose: {
    card: 'border-l-4 border-l-rose-500',
    icon: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
    value: 'text-rose-700 dark:text-rose-300'
  }
};

export function StatCard({ label, value, icon: Icon, tone = 'teal' }: Props) {
  const t = tones[tone];
  return (
    <div className={`panel p-5 ${t.card} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className={`text-3xl font-bold tabular-nums ${t.value}`}>{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${t.icon} flex-shrink-0`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
