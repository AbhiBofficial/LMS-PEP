import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Layers, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
            <Link to="/register" className="btn btn-primary rounded-full px-5 h-9">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-sm font-medium backdrop-blur-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Introducing Libris 2.0
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8"
          >
            Library management, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-500">beautifully designed.</span>
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
            <Link to="/login" className="btn btn-secondary h-12 px-8 text-base rounded-full">
              View Demo
            </Link>
          </motion.div>
        </div>
        
        {/* Abstract App Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="container mx-auto px-6 mt-20"
        >
          <div className="rounded-2xl border border-border/50 bg-card/50 p-2 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
            <div className="rounded-xl border border-border bg-background h-[400px] md:h-[600px] w-full flex items-center justify-center relative overflow-hidden">
               {/* Decorative UI elements for the preview */}
               <div className="absolute top-0 left-0 w-64 h-full border-r border-border/50 p-6 hidden md:block">
                 <div className="h-6 w-24 bg-muted rounded mb-8"></div>
                 <div className="space-y-4">
                   <div className="h-4 w-full bg-primary/10 rounded"></div>
                   <div className="h-4 w-3/4 bg-muted rounded"></div>
                   <div className="h-4 w-5/6 bg-muted rounded"></div>
                 </div>
               </div>
               <div className="p-8 w-full md:pl-72 h-full flex flex-col gap-6">
                 <div className="h-10 w-full md:w-96 bg-muted rounded-lg"></div>
                 <div className="flex gap-4">
                   <div className="h-32 flex-1 bg-card border border-border rounded-xl shadow-sm"></div>
                   <div className="h-32 flex-1 bg-card border border-border rounded-xl shadow-sm"></div>
                   <div className="h-32 flex-1 bg-card border border-border rounded-xl shadow-sm hidden sm:block"></div>
                 </div>
                 <div className="flex-1 bg-card border border-border rounded-xl shadow-sm p-6">
                   <div className="h-6 w-48 bg-muted rounded mb-6"></div>
                   <div className="space-y-3">
                     {[1,2,3,4,5].map(i => (
                       <div key={i} className="h-12 w-full border border-border/50 rounded flex items-center px-4 gap-4">
                         <div className="h-6 w-6 rounded-full bg-muted"></div>
                         <div className="h-4 w-1/3 bg-muted rounded"></div>
                         <div className="h-4 w-1/4 bg-muted rounded ml-auto"></div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful features wrapped in an intuitive, keyboard-first interface.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Built on modern tech stack for zero-latency interactions and real-time updates.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
              <p className="text-muted-foreground">Find any book instantly with powerful search, categorizations, and metadata filtering.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">Role-based access control, comprehensive audit logs, and secure JWT authentication.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-tighter text-lg mb-4 md:mb-0">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Libris</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Libris Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
