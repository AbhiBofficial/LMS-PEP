import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './styles.css';

// Apply theme before React mounts to prevent flash of wrong theme on public pages
(function applyThemeEarly() {
  try {
    const stored = localStorage.getItem('lms-theme');
    const dark = stored ? JSON.parse(stored)?.state?.dark : false;
    if (dark) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    // ignore parse errors
  }
})();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  </React.StrictMode>
);
