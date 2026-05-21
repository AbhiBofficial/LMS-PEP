import { AlertCircle, RefreshCw } from 'lucide-react';

type Props = {
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({ message = 'Something went wrong', onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">Failed to load data</p>
        <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-secondary gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
