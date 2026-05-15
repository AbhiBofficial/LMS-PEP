type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm dark:border-slate-800">
      <span className="text-slate-500 dark:text-slate-400">
        Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button className="btn-secondary h-9 px-3" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
          Previous
        </button>
        <button className="btn-secondary h-9 px-3" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
