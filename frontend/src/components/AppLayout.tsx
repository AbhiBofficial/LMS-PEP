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
  Command,
  Menu,
  X
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { cn, getInitials } from '../lib/utils';
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
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isStaff = useAuthStore((state) => state.isStaff());
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const dark = useThemeStore((state) => state.dark);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const applyTheme = useThemeStore((state) => state.apply);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setMobileMenuOpen(false);
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
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-3 w-[calc(100%-2rem)] max-w-5xl"
      >
        {/* Logo */}
        <NavLink to="/app" className="flex items-center gap-2 mr-2 flex-shrink-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Library className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm hidden sm:inline-block">Libris</span>
        </NavLink>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app'}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex h-8 items-center gap-1.5 px-3 rounded-xl text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )
              }
            >
              <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Command Palette Button */}
          <button
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors hidden md:flex"
            onClick={() => setIsCommandOpen(true)}
            title="Search (Ctrl+K)"
            id="cmd-palette-trigger"
          >
            <Command className="h-3.5 w-3.5" />
          </button>

          {/* Theme Toggle */}
          <button
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
            onClick={toggleTheme}
            title="Toggle Theme"
            id="theme-toggle"
          >
            {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {/* Profile Link */}
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              cn(
                'h-8 rounded-xl flex items-center gap-1.5 px-2 transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )
            }
            title="Profile"
            id="profile-link"
          >
            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
              {getInitials(user?.fullName)}
            </div>
            <span className="text-xs font-medium hidden lg:inline-block max-w-[80px] truncate">{user?.fullName?.split(' ')[0]}</span>
          </NavLink>

          {/* Visible Logout Button */}
          <button
            onClick={logout}
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors hidden md:flex"
            title="Sign Out"
            id="logout-btn"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="h-8 w-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            title="Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-20 left-4 right-4 z-40 glass-panel rounded-2xl p-3 shadow-xl md:hidden"
          >
            <div className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
              <div className="h-px bg-border/50 my-1" />
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-100px)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-card border border-border/50 rounded-3xl shadow-sm p-6 sm:p-8 min-h-[70vh]"
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
              className="w-full max-w-xl bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden mx-4"
            >
              <div className="p-4 border-b border-border/50 flex items-center gap-3">
                <Command className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
                  autoFocus
                  id="cmd-palette-input"
                />
                <button
                  onClick={() => setIsCommandOpen(false)}
                  className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground flex-shrink-0"
                >
                  ESC
                </button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Navigation</div>
                {items.map(item => (
                  <button
                    key={item.to}
                    onClick={() => {
                      navigate(item.to);
                      setIsCommandOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-left text-sm transition-colors"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">Account</div>
                <button
                  onClick={() => { navigate('/app/profile'); setIsCommandOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-left text-sm transition-colors"
                >
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive text-left text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
