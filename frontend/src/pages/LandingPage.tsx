import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, Layers, Shield, Star, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Built on Spring Boot 3 + React 19 for zero-latency interactions and real-time data updates.',
  },
  {
    icon: Layers,
    title: 'Advanced Filtering',
    desc: 'Find any book instantly with powerful search by title, ISBN, author, category, and availability.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'JWT + refresh tokens, role-based access (Admin / Librarian / User), and full audit logging.',
  },
  {
    icon: Users,
    title: 'Patron Management',
    desc: 'Manage library members, track active borrows, enforce limits, and auto-calculate overdue fines.',
  },
  {
    icon: CheckCircle,
    title: 'Borrow & Return',
    desc: 'One-click borrowing and returns with automatic fine calculation for overdue books.',
  },
  {
    icon: BookOpen,
    title: 'Full Catalog',
    desc: 'Maintain books, authors, and categories with rich metadata including shelf location and ISBNs.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Head Librarian, Delhi Public Library',
    avatar: 'PS',
    quote: 'Libris transformed how we manage over 50,000 books. The borrow tracking and fine system alone saved us hours every week.',
  },
  {
    name: 'Arjun Mehta',
    role: 'IT Director, NIT Bangalore',
    avatar: 'AM',
    quote: 'The role-based access system is perfect for our university setup — staff manage inventory while students simply browse and borrow.',
  },
  {
    name: 'Sneha Patel',
    role: 'Library Manager, Ahmedabad City Library',
    avatar: 'SP',
    quote: 'The dashboard gives us instant visibility into overdue books and popular categories. It feels like a premium SaaS product.',
  },
];

const stats = [
  { value: '10,000+', label: 'Books Managed' },
  { value: '500+', label: 'Active Libraries' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<50ms', label: 'API Response Time' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-xl">
            <BookOpen className="h-6 w-6 text-primary" />
            <span>Libris</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
            <Link to="/register" className="btn btn-primary rounded-full px-5 h-9">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Now live — Libris v2.0
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8"
          >
            Library management,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
              beautifully designed.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10"
          >
            A premium, high-performance platform to manage books, patrons, and borrowing history with elegance and speed. Built for modern libraries.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/register" className="btn btn-primary h-12 px-8 text-base rounded-full gap-2">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              state={{ demo: true }}
              className="btn btn-secondary h-12 px-8 text-base rounded-full"
            >
              View Demo
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            Demo: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">admin@library.local</code> / <code className="bg-muted px-1.5 py-0.5 rounded text-xs">Password123!</code>
          </motion.p>
        </div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="container mx-auto px-6 mt-20"
        >
          <div className="rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
            <div className="rounded-xl border border-border bg-background h-[320px] md:h-[480px] w-full relative overflow-hidden">
              {/* Fake sidebar */}
              <div className="absolute top-0 left-0 w-56 h-full border-r border-border/50 p-5 hidden md:flex flex-col gap-2">
                <div className="h-5 w-20 bg-muted rounded mb-4" />
                {['Dashboard', 'Books', 'Authors', 'Categories', 'Borrow History'].map((item, i) => (
                  <div key={item} className={`h-8 w-full rounded-lg flex items-center px-3 gap-2 ${i === 0 ? 'bg-primary/10' : ''}`}>
                    <div className="h-3 w-3 rounded-sm bg-muted-foreground/30" />
                    <div className={`h-2.5 rounded ${i === 0 ? 'bg-primary/40 w-20' : 'bg-muted w-16'}`} />
                  </div>
                ))}
              </div>
              {/* Fake content */}
              <div className="p-5 h-full flex flex-col gap-4 md:pl-64">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-28 bg-muted rounded" />
                  <div className="h-7 w-24 bg-primary/20 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['bg-sky-100 dark:bg-sky-950', 'bg-amber-100 dark:bg-amber-950', 'bg-teal-100 dark:bg-teal-950', 'bg-rose-100 dark:bg-rose-950'].map((c, i) => (
                    <div key={i} className={`h-20 rounded-xl border border-border ${c} p-3 flex flex-col justify-between`}>
                      <div className="h-2.5 w-12 bg-current opacity-20 rounded" />
                      <div className="h-5 w-8 bg-current opacity-30 rounded" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded-xl border border-border bg-card p-4">
                  <div className="h-3.5 w-32 bg-muted rounded mb-4" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-9 w-full border border-border/50 rounded-lg flex items-center px-3 gap-3">
                        <div className="h-4 w-4 rounded-full bg-muted" />
                        <div className="h-2.5 flex-1 bg-muted rounded" />
                        <div className="h-5 w-14 bg-muted/60 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 border-y border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features wrapped in an intuitive, keyboard-first interface.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Loved by librarians</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Trusted by libraries across India to manage millions of books and thousands of patrons.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/20 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to modernize your library?</h2>
            <p className="text-muted-foreground text-lg mb-8">Get started in minutes. No credit card required.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn btn-primary h-12 px-8 text-base rounded-full gap-2">
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn btn-secondary h-12 px-8 text-base rounded-full">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Libris</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Libris. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
