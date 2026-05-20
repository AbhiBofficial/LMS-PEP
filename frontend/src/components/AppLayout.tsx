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
  Feather,
  Command
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import { useThemeStore } from '../store/theme';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: Gauge },
  { to: '/app/books', label: 'Books', icon: BookOpen },
  { to: '/app/authors', label: 'Authors', icon: Feather },
  { to: '/app/categories', label: 'Categories', icon: Tags },
  { to: '/app/borrow-history', label: 'Borrow History', icon: ClipboardList },
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
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function logout() {
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => undefined);
    }
    clearAuth();
    navigate('/login');
  }

  const items = [
    ...navItems,
    ...(isStaff ? [{ to: '/app/users', label: 'Users', icon: Users }] : []),
    ...(isAdmin ? [{ to: '/app/admin', label: 'Admin', icon: ShieldCheck }] : [])
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Floating Navigation Menu */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-full px-6 py-3 flex items-center gap-6"
      >
        <div className="flex items-center gap-2 mr-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-bold hidden sm:inline-block">Libris</span>
        </div>
        
        <div className="flex items-center gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex h-9 w-9 sm:w-auto sm:px-3 items-center justify-center sm:justify-start gap-2 rounded-full text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline-block">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="h-4 w-px bg-border mx-2"></div>

        <div className="flex items-center gap-2">
          <button 
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            onClick={() => setIsCommandOpen(true)}
            title="Search (Cmd+K)"
          >
            <Command className="h-4 w-4" />
          </button>
          <button 
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            onClick={toggleTheme} 
            title="Toggle Theme"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              cn(
                'h-9 w-9 rounded-full flex items-center justify-center transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )
            }
            title="Profile"
          >
            <UserRound className="h-4 w-4" />
          </NavLink>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-border/50 rounded-3xl shadow-sm p-6 sm:p-10 min-h-[70vh]"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
            onClick={() => setIsCommandOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <Command className="h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Type a command or search..." 
                  className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                <button 
                  onClick={() => setIsCommandOpen(false)}
                  className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                >
                  ESC
                </button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Navigation</div>
                {items.map(item => (
                  <button 
                    key={item.to}
                    onClick={() => {
                      navigate(item.to);
                      setIsCommandOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted text-left text-sm transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground mt-4">Actions</div>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive text-left text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
