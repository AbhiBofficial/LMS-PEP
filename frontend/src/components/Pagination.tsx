import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border/50 px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        Page <span className="font-medium text-foreground">{page + 1}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>
      <div className="flex gap-1">
        <button
          className="btn-secondary h-8 w-8 p-0"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          id="prev-page"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          className="btn-secondary h-8 w-8 p-0"
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
          id="next-page"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
