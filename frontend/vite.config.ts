import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '127.0.0.1',
    proxy: {
      '/auth': 'http://localhost:8080',
      '/books': 'http://localhost:8080',
      '/authors': 'http://localhost:8080',
      '/categories': 'http://localhost:8080',
      '/users': 'http://localhost:8080',
      '/profile': 'http://localhost:8080',
      '/borrow-history': 'http://localhost:8080',
      '/dashboard': 'http://localhost:8080',
      '/audit-logs': 'http://localhost:8080',
      '/admin': 'http://localhost:8080'
    }
  }
});
