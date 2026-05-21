import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 mb-6">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-7xl font-extrabold tracking-tighter text-primary mb-2">404</h1>
        <p className="text-xl font-semibold mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Looks like this page got lost in the stacks. Let's get you back to the catalog.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/app"
            className="btn btn-primary rounded-full px-6 h-10"
            id="back-to-app"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/"
            className="btn btn-secondary rounded-full px-6 h-10"
            id="back-to-home"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
