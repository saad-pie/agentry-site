/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, 
  ExternalLink, 
  ArrowRight, 
  Check, 
  Menu, 
  X, 
  Cpu, 
  Activity, 
  Lock, 
  LogIn, 
  UserPlus, 
  LogOut, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Layers, 
  Table, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Server, 
  Share2, 
  ChevronRight, 
  Terminal, 
  Search, 
  Database, 
  Copy, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  auth, 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  provisionChatSession, 
  formatAuthError,
  checkRedirectResult
} from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

// Generated Assets
import heroGraphImg from './assets/images/agentry_graph_hero_1791725799479.jpg';
import architectureImg from './assets/images/agentry_architecture_1791725856113.jpg';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth modal states
  const [authModalView, setAuthModalView] = useState<'login' | 'signup' | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Terminal copy state
  const [copiedLog, setCopiedLog] = useState(false);

  // Provisioning & Interim feedback states
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState<{ message: string; showContinue: boolean } | null>(null);

  // Router / pathname sync
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    // Check redirect result if user used redirect login
    checkRedirectResult().then((result) => {
      if (result?.user) {
        setCurrentUser(result.user);
      }
    });

    // Handle browser popstate
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial check for /login or /signup
    if (window.location.pathname === '/login') {
      setAuthModalView('login');
    } else if (window.location.pathname === '/signup') {
      setAuthModalView('signup');
    }

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (path === '/login') {
      setAuthModalView('login');
      setAuthError(null);
    } else if (path === '/signup') {
      setAuthModalView('signup');
      setAuthError(null);
    } else {
      setAuthModalView(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const closeAuthModal = () => {
    setAuthModalView(null);
    setAuthError(null);
    if (currentPath === '/login' || currentPath === '/signup') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    }
  };

  const handleGoogleLogin = async () => {
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
      closeAuthModal();
    } catch (err: any) {
      if (err?.message !== 'Redirecting to Google...') {
        setAuthError(formatAuthError(err?.code || ''));
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthSubmitting(true);
    setAuthError(null);
    try {
      if (authModalView === 'signup') {
        const user = await registerWithEmail(authEmail, authPassword, authName);
        setCurrentUser(user);
      } else {
        const user = await loginWithEmail(authEmail, authPassword);
        setCurrentUser(user);
      }
      closeAuthModal();
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err: any) {
      setAuthError(formatAuthError(err?.code || ''));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleProtectedChatAccess = async () => {
    if (!currentUser) {
      navigateTo('/login');
      return;
    }

    setProvisioning(true);
    setProvisionError(null);

    const res = await provisionChatSession(currentUser);
    setProvisioning(false);

    if (res.ok && res.url) {
      window.location.href = res.url;
    } else {
      setProvisionError({
        message: res.error || 'Chat service is being set up. Try again shortly.',
        showContinue: !!res.isNetworkOr404,
      });
    }
  };

  const copyProductionLog = () => {
    const log = `[agentry-mcp] 8 tools registered: check, search, build, build_from_plan, invoke, status, trace, reason
[build_from_plan] fetch_url      → 206ms  ✓ trial passed
[build_from_plan] page_extract   → 211ms  ✓ trial passed
[build_from_plan] str_filter     → 193ms  ✓ trial passed
[invoke] str_filter × 40 keywords → avg 180ms each
[analysis] routes: 22  models: 42  APIs: 6  stack: React 19 + Firebase`;
    navigator.clipboard.writeText(log);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 relative overflow-hidden bg-grid-pattern selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] md:w-[1100px] h-[550px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/6 to-cyan-500/10 blur-[140px] pointer-events-none rounded-full -z-10" />
      <div className="fixed top-[45%] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/6 to-emerald-500/8 blur-[130px] pointer-events-none rounded-full -z-10" />
      <div className="fixed bottom-0 left-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/8 to-indigo-600/5 blur-[160px] pointer-events-none rounded-full -z-10" />

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#06080d]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); navigateTo('/'); }} 
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-all">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold tracking-tight text-white text-base">agentry</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#pitch" className="hover:text-emerald-400 transition-colors">The Pitch</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#in-production" className="hover:text-emerald-400 transition-colors">In Production</a>
            <a href="#architecture" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#stack" className="hover:text-emerald-400 transition-colors">Stack</a>
            <a href="#comparison" className="hover:text-emerald-400 transition-colors">Astra Compare</a>
            <a href="/benchmark.html" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <span>Benchmark</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300">Phase 1</span>
            </a>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {authLoading ? (
              <div className="w-20 h-8 flex items-center justify-center text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : currentUser ? (
              <div className="flex items-center gap-3 bg-white/[0.04] pl-2 pr-3 py-1.5 rounded-full border border-white/[0.08]">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center border border-emerald-500/30">
                    {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-xs font-mono text-slate-300 max-w-[130px] truncate" title={currentUser.email || ''}>
                  {currentUser.email}
                </span>
                <button
                  onClick={() => logoutUser()}
                  className="text-xs text-slate-400 hover:text-red-400 transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('/login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={handleProtectedChatAccess}
              disabled={provisioning}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all hover:scale-[1.02] cursor-pointer"
            >
              {provisioning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <>
                  <span>Open Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={handleProtectedChatAccess}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg cursor-pointer"
            >
              <span>Chat</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-white/[0.08] bg-[#070a10]/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl"
            >
              {currentUser ? (
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center">
                      {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                    <span className="text-slate-300 truncate">{currentUser.email}</span>
                  </div>
                  <button 
                    onClick={() => { logoutUser(); setMobileMenuOpen(false); }}
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-mono text-xs cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pb-3 border-b border-white/[0.06]">
                  <button
                    onClick={() => { navigateTo('/login'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-lg border border-white/[0.1] text-xs font-mono text-center hover:bg-white/[0.04] cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigateTo('/signup'); setMobileMenuOpen(false); }}
                    className="flex-1 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center font-medium cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <div className="flex flex-col space-y-1 font-medium text-slate-300 text-sm">
                <a href="#pitch" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">01 / The Pitch</a>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">02 / How It Works</a>
                <a href="#in-production" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">03 / In Production</a>
                <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">04 / Architecture</a>
                <a href="#stack" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">05 / Stack</a>
                <a href="#comparison" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-white/[0.04]">Astra Comparison</a>
                <a href="/benchmark.html" className="py-2 px-3 rounded-lg hover:bg-white/[0.04] text-emerald-400">Phase 1 Benchmark</a>
                <a href="/privacy.html" className="py-2 px-3 rounded-lg hover:bg-white/[0.04] text-slate-400">Privacy Policy</a>
                <a href="/terms.html" className="py-2 px-3 rounded-lg hover:bg-white/[0.04] text-slate-400">Terms of Service</a>
                <a href="/cookies.html" className="py-2 px-3 rounded-lg hover:bg-white/[0.04] text-slate-400">Cookie Policy</a>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { handleProtectedChatAccess(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors cursor-pointer"
                >
                  <span>Launch DeepSeek Harness</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Provision Error / Interim Fallback Banner */}
      <AnimatePresence>
        {provisionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-16 z-40 bg-amber-950/90 border-b border-amber-500/30 text-amber-200 px-4 py-3 backdrop-blur-md"
          >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{provisionError.message}</span>
              </div>
              <div className="flex items-center gap-3">
                {provisionError.showContinue && (
                  <a
                    href="https://saadpie1-deepseek-harness.hf.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white font-mono font-medium flex items-center gap-1"
                  >
                    <span>Continue anyway</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => setProvisionError(null)}
                  className="text-amber-400 hover:text-white p-1 cursor-pointer"
                  aria-label="Dismiss banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* =================================================================
            SECTION 1 — HERO
            ================================================================= */}
        <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE ON FREE HF SPACE · 1 HARNESS · 1 GRAPH · 577 CAPABILITIES</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]"
            >
              I trained an agent, <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                not a model.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            >
              Every AI model is frozen at release. Agents are frozen at boot. agentry breaks that: a capability factory that grows its own tools every time it hits a wall. The layer above your agents.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
            >
              <a 
                href="#pitch" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all hover:scale-[1.02] shadow-lg shadow-white/5 cursor-pointer"
              >
                <span>Read the pitch</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <button 
                onClick={() => {
                  if (currentUser) {
                    handleProtectedChatAccess();
                  } else {
                    navigateTo('/signup');
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Try it</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </motion.div>
          </div>

          {/* Thin caption bar below hero */}
          <div className="mt-8 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] font-mono text-[11px] sm:text-xs text-slate-400">
              GRAPH: APPEND-ONLY REPLAYABLE · 8 MCP PRIMITIVES · 6 LANGUAGES · TRIAL-GATED
            </span>
          </div>

          {/* Hero Visual Asset */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-12 rounded-2xl glass-panel p-2 sm:p-3 relative overflow-hidden group shadow-2xl border border-white/[0.1]"
          >
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[460px] bg-black/60">
              <img 
                src={heroGraphImg} 
                alt="Agentry Capability Graph Architecture" 
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-black/30 pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>CAPABILITY RUNTIME: 6-LANGUAGE COMPILER KERNEL</span>
                </span>
                <span className="text-emerald-400">577 LIVE NODES</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* =================================================================
            SECTION 2 — THE PITCH
            ================================================================= */}
        <section id="pitch" className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              01 / THE PITCH
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              &ldquo;I trained an agent instead of a model.&rdquo;
            </h2>

            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
              <p>
                Models get trained once. Their capabilities are frozen at release. No matter what happens in the real world, the weight matrix is immovable.
              </p>
              <p>
                Agents are static: whatever tools the developer gave them at boot, that&apos;s what they have forever. When an agent hits an unsupported file format or a missing API, it stops dead in its tracks.
              </p>
              <p>
                agentry is the opposite bet. Small base capability, but the ability to grow it. Every time the harness hits a wall, agentry builds the tool that fixes it — in under a second — verifies it with real bytes, and saves it. The system gets more capable every time it fails.
              </p>
            </div>

            {/* Two-Column Compare Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-3">
                <div className="font-mono text-xs font-bold text-red-400 uppercase tracking-wide flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  <span>TRADITIONAL AGENTS</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Hardcoded tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Boot-time freeze: if the tool doesn&apos;t exist, execution fails</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>Every failure is a dead end</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/15 space-y-3 shadow-lg shadow-emerald-500/5">
                <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AGENTRY META-GRAPH (HIGHLIGHT)</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-200 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>8 MCP primitives, no hardcoded capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Self-expanding: DSH writes the tool when it doesn&apos;t exist</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Every failure is a permanent capability added to the graph</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-mono pt-2">
              agentry doesn&apos;t claim to beat Astra on reasoning. It claims to be the fastest way to turn a specific task into a reusable, verified tool. That&apos;s the whole pitch.
            </p>
          </div>
        </section>

        {/* PRIMARY STATS ROW (4 cards, large numbers) */}
        <section id="stats" className="py-12 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1">
                150ms
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                Warm invoke
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run a persisted capability
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1">
                606ms
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                Cold build
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Build + verify a new capability
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <div className="font-mono text-4xl sm:text-5xl font-bold text-emerald-300 tracking-tight mb-1">
                4,000×
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                Faster than re-reasoning
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                606ms build vs 40 min of model reasoning on an equivalent task
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/30 transition-all">
              <div className="font-mono text-4xl sm:text-5xl font-bold text-white tracking-tight mb-1">
                577
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2">
                Live capabilities
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verified, trial-passed, invokable
              </p>
            </div>
          </div>
        </section>

        {/* HONEST FRAMING SECTION */}
        <section className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              CLARITY &amp; FIRST PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What this comparison actually means
            </h2>
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>
                GPT-6 Astra is smarter than agentry. It scores 95.8 on BenchGecko across 34 benchmarks, ranks #3 of 323 models, and takes ~40 minutes per OSWorld computer-use task at $10/$50 per 1M tokens.
              </p>
              <p>
                Agentry is not smarter. It's a cache. When you ask it a question the first time, it builds a small tool that answers that question, verifies the tool with real bytes, and saves it. Every subsequent time you ask the same kind of question, it runs the tool in 150ms for $0.
              </p>
              <p className="font-mono text-sm sm:text-base text-emerald-300 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                The 4,000× number is: 40 min of Astra-style reasoning ÷ 606ms of agentry capability build. The 16,000× number is: 40 min of Astra ÷ 150ms of warm invoke.
              </p>
              <p>
                Neither is &ldquo;agentry beats Astra.&rdquo; Both are &ldquo;agentry amortizes against Astra on repeat tasks.&rdquo;
              </p>
              <p className="text-white font-medium">
                If your task is genuinely novel every time, use Astra. If your task is one of a family of tasks you'll run a hundred times, use agentry.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="comparison" className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="space-y-4 mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              BENCHMARK SPECS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              GPT-6 Astra vs Agentry
            </h2>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.1] overflow-x-auto shadow-2xl">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="p-4 sm:px-6 font-mono font-medium text-slate-400">Metric</th>
                  <th className="p-4 sm:px-6 font-mono font-medium text-slate-200">GPT-6 Astra</th>
                  <th className="p-4 sm:px-6 font-mono font-medium text-emerald-400">Agentry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono text-xs sm:text-sm">
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">BenchGecko average</td>
                  <td className="p-4 sm:px-6 text-slate-200">95.8 (rank #3)</td>
                  <td className="p-4 sm:px-6 text-slate-500">n/a</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Reasoning</td>
                  <td className="p-4 sm:px-6 text-slate-200">96.8 (rank #1)</td>
                  <td className="p-4 sm:px-6 text-slate-500">n/a</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Per-task cost</td>
                  <td className="p-4 sm:px-6 text-slate-200">~$0.07/message</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-semibold">$0 per repeat invoke</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Cold task time</td>
                  <td className="p-4 sm:px-6 text-slate-200">~40 min (OSWorld)</td>
                  <td className="p-4 sm:px-6 text-emerald-400">606ms (build) + 150ms (invoke)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Repeat task time</td>
                  <td className="p-4 sm:px-6 text-slate-200">~40 min</td>
                  <td className="p-4 sm:px-6 text-emerald-400 font-bold">150ms</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Time ratio (repeat)</td>
                  <td className="p-4 sm:px-6 text-slate-200">1×</td>
                  <td className="p-4 sm:px-6 text-emerald-300 font-bold">~16,000× faster</td>
                </tr>
                <tr>
                  <td className="p-4 sm:px-6 text-slate-400 font-sans">Verified output</td>
                  <td className="p-4 sm:px-6 text-slate-400">Trust the model</td>
                  <td className="p-4 sm:px-6 text-emerald-400">Magic-byte checked</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================================
            SECTION 3 — HOW IT WORKS
            ================================================================= */}
        <section id="how-it-works" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              02 / HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              From a blocked task to a permanent capability. Three steps, not five.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    STEP 01
                  </span>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Hit a wall</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  The DeepSeek Harness tries to execute a task and needs a tool it doesn&apos;t have. It calls agentry over the MCP bridge (bash + curl on port 7863).
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 font-semibold">
                MCP BRIDGE
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col justify-between space-y-4 bg-emerald-950/10 shadow-lg shadow-emerald-500/5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    STEP 02
                  </span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Build the capability</h3>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>Two paths, one verification gate:</p>
                  <p className="text-xs text-slate-400">
                    • <strong className="text-white">build_from_plan</strong> — DSH writes the plan code itself, agentry renders + trials. Real cold builds: 606ms with real npm install included.
                  </p>
                  <p className="text-xs text-slate-400">
                    • <strong className="text-white">build</strong> — agentry&apos;s own LLM writes the handler from the package README. Slower (45s–6min), used when DSH can&apos;t write the code.
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 font-semibold">
                SYNTHESIS
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    STEP 03
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="font-semibold text-white text-lg">Verify, adopt, invoke</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Trial runs the handler with real inputs in a real kernel session. Output is magic-byte checked (PAR1 for Parquet, %PDF for PDF, PNG header, etc). On pass, the capability is written to the graph and immediately invokable. Warm invokes: 150ms.
                </p>
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 font-semibold">
                TRIAL GATE
              </div>
            </div>
          </div>

          {/* Append-only Invariant Callout */}
          <div className="mt-8 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              <strong className="text-emerald-300">Append-only invariant:</strong> The capability graph is append-only. Every decision is replayable. Nothing is deleted — capabilities are retired, not removed.
            </div>
          </div>
        </section>

        {/* =================================================================
            SECTION 4 — IN PRODUCTION
            ================================================================= */}
        <section id="in-production" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              03 / IN PRODUCTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Real end-to-end run. SteveAI site analysis, 2m 7s, no manual coding.
            </h2>
          </div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            <p>We pointed the DeepSeek Harness at a real website with only the URL. It:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-400 pl-2">
              <li>Checked agentry for existing tools — found none</li>
              <li>Built three capabilities via <code className="font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">build_from_plan</code>: <code className="font-mono text-slate-200">fetch_url</code> (206ms), <code className="font-mono text-slate-200">page_extract</code> (211ms), <code className="font-mono text-slate-200">str_filter</code> (193ms)</li>
              <li>Invoked them 30+ times across 40 keyword filters</li>
              <li>Produced a complete architectural analysis: routes, model matrix, API endpoints, Firebase auth stack, ad scripts, iframe target</li>
            </ol>
            <p className="font-mono text-xs sm:text-sm text-emerald-300 pt-1">
              Total wall time: 2m 7s including all LLM turns between tool calls. Second run estimate: ~15 seconds (capabilities persist).
            </p>
          </div>

          {/* Terminal block excerpt */}
          <div className="mt-6 rounded-2xl glass-panel border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="bg-[#0b0f19] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block"></span>
                <span className="ml-2">production.analysis.log</span>
              </div>
              <button
                onClick={copyProductionLog}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white font-mono text-xs transition-colors cursor-pointer"
                aria-label="Copy production log"
              >
                {copiedLog ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed bg-[#06080e]/95">
              <code>{`[agentry-mcp] 8 tools registered: check, search, build, build_from_plan, invoke, status, trace, reason
[build_from_plan] fetch_url      → 206ms  ✓ trial passed
[build_from_plan] page_extract   → 211ms  ✓ trial passed
[build_from_plan] str_filter     → 193ms  ✓ trial passed
[invoke] str_filter × 40 keywords → avg 180ms each
[analysis] routes: 22  models: 42  APIs: 6  stack: React 19 + Firebase`}</code>
            </pre>
          </div>

          <p className="mt-4 text-xs font-mono text-slate-400">
            These numbers are from one Space on one day. Larger packages still take 15–90 seconds (sharp, playwright). 606ms is the fast path, not a universal claim.
          </p>
        </section>

        {/* =================================================================
            SECTION 5 — ARCHITECTURE
            ================================================================= */}
        <section id="architecture" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              04 / ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Four coordinated primitives on one free-tier Space.
            </h2>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1 */}
            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">Harness</span>
                <span className="font-mono text-[11px] text-emerald-400">Worker agent</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                DeepSeek Harness. Reads AGENTS.md, hits walls, calls agentry.
              </p>
              <div className="pt-2 border-t border-white/[0.06] font-mono text-[11px] text-slate-400">
                DSH 0.2.1 · Ollama beam:cloud (default) · OrcaRouter fallback
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">Agentry</span>
                <span className="font-mono text-[11px] text-emerald-400">Meta-system</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Owns the graph, builds capabilities, verifies artifacts, retires broken caps.
              </p>
              <div className="pt-2 border-t border-white/[0.06] font-mono text-[11px] text-slate-400">
                Node.js 22 engine · 6-language kernel · 8 MCP tools
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">Search</span>
                <span className="font-mono text-[11px] text-emerald-400">Discovery</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Self-hosted SearXNG + GitHub Search API. Fans out per gap. No API keys for web.
              </p>
              <div className="pt-2 border-t border-white/[0.06] font-mono text-[11px] text-slate-400">
                SearXNG (granian) + GitHub Search
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-5 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-base">Storage</span>
                <span className="font-mono text-[11px] text-emerald-400">Append-only ledger</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                capabilities.jsonl + events.jsonl. Fold-on-read. Pushed to GitHub every 5 min.
              </p>
              <div className="pt-2 border-t border-white/[0.06] font-mono text-[11px] text-slate-400">
                JSONL on disk · Git autosave
              </div>
            </div>
          </div>

          {/* Simple flow indicator */}
          <div className="p-4 rounded-xl glass-panel border border-emerald-500/20 text-center font-mono text-xs sm:text-sm text-emerald-300 mb-8">
            Harness ↔ Agentry ↔ SearXNG ↔ JSONL
          </div>

          {/* Architecture 3D asset */}
          <div className="rounded-2xl glass-panel p-2 sm:p-3 mb-8 overflow-hidden border border-white/[0.1] shadow-2xl">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[440px] bg-black/60">
              <img 
                src={architectureImg} 
                alt="Agentry 4-node cybernetic architecture diagram" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                <span>PIPELINE: HARNESS ↔ AGENTRY ↔ SEARXNG ↔ JSONL</span>
                <span className="text-emerald-400">FREE-TIER HF CO-LOCATED</span>
              </div>
            </div>
          </div>

          {/* Three Topology Cards preserved */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-lg font-bold text-white">Capability graph</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                1,500+ capabilities in an append-only JSONL log. Fold-on-read. Rebuildable from the log alone. Each capability is trial-passed with real invocation before adoption.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-lg font-bold text-white">Synthesis factory</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Two paths: build_from_plan (you write the code, agentry renders + trials, sub-second) and build (LLM writes the code, 45s–6min). Every artifact is verified with real bytes before adoption.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-mono text-lg font-bold text-white">6-language kernel</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Node, Python, Rust, Go, Java, .NET. Isolated sessions with own node_modules, .venv, go.mod, per-language project dirs. Real package installs, real compilers, real execution.
              </p>
            </div>
          </div>
        </section>

        {/* EIGHT PRIMITIVES SECTION */}
        <section id="primitives" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              MCP PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Eight primitives. No chat, no plan, no task runner.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'check', desc: 'does a capability exist?' },
              { name: 'search', desc: 'find packages in external registries (12 adapters)' },
              { name: 'build_from_plan', desc: 'you write the plan code, agentry trials it' },
              { name: 'build', desc: 'agentry writes the handler via LLM' },
              { name: 'invoke', desc: 'run a capability' },
              { name: 'status', desc: 'list live capabilities' },
              { name: 'trace', desc: 'reconstruct event timeline' },
              { name: 'reason', desc: 'diagnose failures' },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-xl glass-panel border border-white/[0.08] space-y-1.5">
                <div className="font-mono text-sm font-bold text-emerald-300">
                  {p.name}
                </div>
                <div className="text-xs text-slate-400">
                  {p.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-2">
            <div className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide">
              Substrate vs Head
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The head is DSH (DeepSeek Harness). It's the brain. Agentry is the substrate. DSH decides what to build. Agentry builds it, verifies it, saves it. Every routing decision is DSH's. Every artifact is agentry's.
            </p>
          </div>
        </section>

        {/* =================================================================
            SECTION 6 — STACK
            ================================================================= */}
        <section id="stack" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              05 / STACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              System specifications.
            </h2>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.1] overflow-hidden divide-y divide-white/[0.06]">
            {[
              { label: 'Runtime', val: 'Node.js 22' },
              { label: 'Deployment', val: 'Hugging Face Spaces (Docker, free tier)' },
              { label: 'Storage', val: 'append-only JSONL on disk, Git-synced' },
              { label: 'Reasoning models', val: 'free-tier routing chain — Ollama beam:cloud → OrcaRouter (union-alpha, deepseek-flash) → Groq (context-limited)' },
              { label: 'Discovery', val: 'GitHub Search API + self-hosted SearXNG' },
              { label: 'Notifications', val: 'Resend (HTTPS email, Space-compatible)' },
              { label: 'Kernel', val: '6 languages — Node, Python, Rust, Go, Java, .NET' },
              { label: 'MCP bridge', val: 'HTTP JSON-RPC on port 7863' }
            ].map((row, idx) => (
              <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm">
                <span className="font-mono text-xs sm:text-sm text-slate-400 font-medium sm:w-1/3">
                  {row.label}
                </span>
                <span className="font-mono text-xs sm:text-sm text-emerald-300 sm:w-2/3">
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400">
            Everything runs on free-tier or near-free infrastructure. No paid LLM API required for the demo. Beam:cloud moves to paid on Nov 9, 2026 — the fallback chain is already configured and tested.
          </div>
        </section>

        {/* WHAT IT IS NOT SECTION */}
        <section className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="space-y-4 mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-red-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              BOUNDARIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What agentry is not
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Not a better chatbot',
              'Not a replacement for GPT-6 Astra on open-ended reasoning',
              'Not a generalist agent OS',
              'Not an enterprise multi-tenant platform (yet)',
              'Not full package support on every language (maven/nuget unsupported; rust/go broken via build_from_plan only)'
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 flex items-start gap-3">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* KNOWN LIMITS SECTION */}
        <section id="limits" className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="space-y-4 mb-8">
            <span className="font-mono text-xs tracking-widest uppercase text-amber-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              PRODUCTION TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Honest limits
            </h2>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.1] divide-y divide-white/[0.06]">
            {[
              {
                title: 'Weak-model thesis unproven',
                desc: 'That agentry lifts small models is a hypothesis, not a claim.'
              },
              {
                title: 'Maven / NuGet: no install primitives',
                desc: 'Java/.NET package capabilities cannot be synthesized without pre-baked host manifests.'
              },
              {
                title: 'Rust / Go via build_from_plan',
                desc: "Renderer doesn't call compilers — use build() for those."
              },
              {
                title: 'Dependency cliff',
                desc: 'The default demo model (beam:cloud) moves to paid on Nov 9, 2026; replacement already configured.'
              },
              {
                title: 'Shared kernel',
                desc: "One user's runaway process can slow others for up to 10 minutes before the kill timer fires."
              }
            ].map((limit, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="font-mono text-sm font-semibold text-white sm:w-1/3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{limit.title}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400 sm:w-2/3 leading-relaxed">
                  {limit.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHARED-GRAPH SECTION */}
        <section className="py-16 sm:py-20 border-t border-white/[0.08]">
          <div className="max-w-4xl space-y-6">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              COOPERATIVE COMPUTING
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Shared graph, isolated chats
            </h2>
            <div className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/[0.08] space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p>
                Every user has their own chat history, but everyone shares the same capability graph. If you build a <code className="font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">csv_to_parquet</code> capability, everyone gets it. If you find one is broken, retire it — retiring removes it for everyone.
              </p>
              <p>
                This is by design. Capabilities are universal tools. If 100 users each needed to rebuild <code className="font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">csv_to_parquet</code>, agentry would be worse than a single model. Sharing makes each user's build a gift to every other user.
              </p>
            </div>
          </div>
        </section>

        {/* ROADMAP SECTION */}
        <section className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              TRAJECTORY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Where this is going
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold">PHASE 1</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Completed Nov 2026</span>
              </div>
              <h3 className="font-mono text-lg font-bold text-white">Substrate</h3>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-2 list-disc list-inside">
                <li>606ms cold builds, 150ms warm invokes</li>
                <li>8 MCP primitives live</li>
                <li>577+ verified capabilities</li>
                <li>Trial gate: real invocation + magic bytes</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-bold">PHASE 2</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">In progress</span>
              </div>
              <h3 className="font-mono text-lg font-bold text-white">Promotion loop</h3>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-2 list-disc list-inside">
                <li>Background hardening of successful capabilities</li>
                <li>DSH-powered: run 5× with varied inputs, fix edge cases, re-trial</li>
                <li>Promote from ephemeral → durable tier</li>
                <li>Repair loop for failed ephemeral builds</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 font-bold">PHASE 3</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.08] text-slate-300">Future</span>
              </div>
              <h3 className="font-mono text-lg font-bold text-white">Distribution</h3>
              <ul className="text-xs sm:text-sm text-slate-400 space-y-2 list-disc list-inside">
                <li>Multi-tenant isolation (only if hostile-user onboarding becomes a requirement)</li>
                <li>Rust / Go / Java / .NET first-class synthesis</li>
                <li>Cross-instance capability federation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-emerald-500/30 text-center space-y-6 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Try agentry
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Sign up for access. Build your first capability in under a second. Every user gets their own chat, shares the capability graph.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button 
                onClick={() => {
                  if (currentUser) {
                    handleProtectedChatAccess();
                  } else {
                    navigateTo('/signup');
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <span>{currentUser ? 'Open Chat Console' : 'Sign up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a 
                href="/benchmark.html" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 font-mono text-xs transition-all"
              >
                <span>Read the benchmark</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#04060a] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono font-semibold text-white text-sm">agentry · built by saad-pie</span>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-mono">
              <a href="https://github.com/saad-pie/agentry" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="/benchmark.html" className="hover:text-white transition-colors">Benchmark</a>
              <a href="/privacy.html" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms.html" className="hover:text-white transition-colors">Terms</a>
              <a href="/cookies.html" className="hover:text-white transition-colors">Cookies</a>
              <a href="mailto:saadabdulrehman2010@gmail.com" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-white/[0.06] text-xs text-slate-500 font-mono">
            <div>No cookies for ads. Just capabilities.</div>
            <div>© 2026 saad-pie. MIT licensed.</div>
          </div>
        </div>
      </footer>

      {/* FIREBASE AUTH MODAL (/login and /signup) */}
      <AnimatePresence>
        {authModalView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md rounded-2xl glass-panel bg-[#090d16] border border-white/[0.12] p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={closeAuthModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                  <Lock className="w-3 h-3" />
                  <span>SECURE ACCESS</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {authModalView === 'signup' ? 'Create your Agentry account' : 'Sign in to Agentry'}
                </h2>
                <p className="text-xs text-slate-400">
                  {authModalView === 'signup' 
                    ? 'Get your isolated session, share the verified capability graph.' 
                    : 'Access DeepSeek Harness and run cached capabilities.'}
                </p>
              </div>

              {/* Inline Auth Error Banner */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={authSubmitting}
                className="w-full py-3 px-4 rounded-xl border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]"></div>
                </div>
                <div className="relative flex justify-center text-[11px] font-mono uppercase">
                  <span className="bg-[#090d16] px-2 text-slate-500">or with email</span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {authModalView === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Display Name (optional)</label>
                    <input 
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-emerald-500/60"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Password</label>
                  <input 
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {authSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authModalView === 'signup' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              {/* Switch View */}
              <div className="mt-5 text-center text-xs text-slate-400">
                {authModalView === 'signup' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalView('login'); setAuthError(null); }}
                      className="text-emerald-400 hover:underline font-mono cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthModalView('signup'); setAuthError(null); }}
                      className="text-emerald-400 hover:underline font-mono cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
