import { cn } from '../lib/utils';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeMap = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3'
};

export function LoadingSpinner({ size = 'md', className }: Props) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-border border-t-primary',
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
    </div>
  );
}
