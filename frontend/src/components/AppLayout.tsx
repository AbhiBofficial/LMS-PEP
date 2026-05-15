import {
  BookOpen,
  ClipboardList,
  Gauge,
  Library,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Tags,
  UserRound,
  Users,
  Feather
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge },
  { to: '/books', label: 'Books', icon: BookOpen },
  { to: '/authors', label: 'Authors', icon: Feather },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/borrow-history', label: 'Borrow History', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: UserRound }
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isStaff = useAuthStore((state) => state.isStaff());
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const dark = useThemeStore((state) => state.dark);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const applyTheme = useThemeStore((state) => state.apply);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  async function logout() {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => undefined);
    }
    clearAuth();
    navigate('/login');
  }

  const items = [
    ...navItems,
    ...(isStaff ? [{ to: '/users', label: 'Users', icon: Users }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: ShieldCheck }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-white">
            <Library className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Library LMS</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{roles.join(' / ')}</div>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-teal-50 text-mint dark:bg-teal-950 dark:text-teal-200'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.fullName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-secondary h-10 w-10 px-0" onClick={toggleTheme} title="Toggle theme">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="btn-secondary h-10 w-10 px-0" onClick={logout} title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
