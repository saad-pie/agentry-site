/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Cpu, 
  Search, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Copy, 
  Check, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  Mail, 
  ShieldCheck, 
  Database, 
  RefreshCw,
  Zap,
  Activity,
  FileCode,
  Github
} from 'lucide-react';

// Imported generated AI assets
import heroGraphImg from './assets/images/agentry_graph_hero_1791725799479.jpg';
import discoveryFlowImg from './assets/images/agentry_discovery_flow_1791725825699.jpg';
import architectureImg from './assets/images/agentry_architecture_1791725856113.jpg';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [activeLogTab, setActiveLogTab] = useState<'log' | 'jsonl'>('log');
  const [approvedSimulation, setApprovedSimulation] = useState(false);
  const [activeArchNode, setActiveArchNode] = useState<number | null>(null);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const discoveryLogText = `[agentry] discovery tick: {
  "gaps": 1,
  "uncovered": 1,
  "watched": 0,
  "created": [
    {"gap_id": "gap:pdf.extract", "source": "discovery.github_search"},
    {"gap_id": "gap:pdf.extract", "source": "discovery.web_search"}
  ]
}

[agentry] discovery tick: {
  "gaps": 1,
  "uncovered": 0,
  "watched": 2,
  "proposals": 2
}`;

  const jsonlExcerpt = `{"id":"gap:pdf.extract","status":"discovered","candidates":["pdfplumber","pypdf","pdftotext"],"timestamp":"2026-10-11T06:12:00Z"}
{"id":"prop:pdfplumber","gap_id":"gap:pdf.extract","fit_score":0.94,"source":"github","status":"emailed_to_operator"}
{"id":"prop:pypdf","gap_id":"gap:pdf.extract","fit_score":0.88,"source":"searxng","status":"emailed_to_operator"}`;

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 relative overflow-hidden bg-grid-pattern selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Ambient background glow effects (Manus AI style) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] md:w-[1100px] h-[550px] bg-gradient-to-tr from-emerald-500/12 via-teal-500/8 to-cyan-500/12 blur-[140px] pointer-events-none rounded-full -z-10" />
      <div className="fixed top-[45%] right-[-100px] w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/8 to-emerald-500/10 blur-[130px] pointer-events-none rounded-full -z-10" />
      <div className="fixed bottom-0 left-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/10 to-indigo-600/5 blur-[160px] pointer-events-none rounded-full -z-10" />

      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#06080d]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 group-hover:scale-105 transition-all">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-white text-base">agentry</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
            <a href="#pitch" className="hover:text-emerald-400 transition-colors">The Pitch</a>
            <a href="#how" className="hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#live" className="hover:text-emerald-400 transition-colors">In Production</a>
            <a href="#arch" className="hover:text-emerald-400 transition-colors">Architecture</a>
            <a href="#stack" className="hover:text-emerald-400 transition-colors">Stack</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="https://github.com/saad-pie" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://saadpie1-deepseek-harness.hf.space" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-all hover:scale-[1.02]"
            >
              <span>Live Instance</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Right Controls: Never cramped, responsive button + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <a 
              href="https://saadpie1-deepseek-harness.hf.space" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
            >
              <span>Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
              aria-label="Toggle menu"
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
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-white/[0.08] bg-[#070a10]/95 backdrop-blur-2xl px-5 py-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs font-mono text-slate-400">
                <span>SYSTEM STATUS</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  ONLINE (HF SPACE)
                </span>
              </div>

              <div className="flex flex-col space-y-1 font-medium text-slate-300">
                <a 
                  href="#pitch" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.05] hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>The Pitch</span>
                  <span className="font-mono text-xs text-slate-500">01</span>
                </a>
                <a 
                  href="#how" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.05] hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>How it works</span>
                  <span className="font-mono text-xs text-slate-500">02</span>
                </a>
                <a 
                  href="#live" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.05] hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>In Production</span>
                  <span className="font-mono text-xs text-slate-500">03</span>
                </a>
                <a 
                  href="#arch" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.05] hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>Architecture</span>
                  <span className="font-mono text-xs text-slate-500">04</span>
                </a>
                <a 
                  href="#stack" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg hover:bg-white/[0.05] hover:text-emerald-400 transition-colors flex items-center justify-between"
                >
                  <span>Stack</span>
                  <span className="font-mono text-xs text-slate-500">05</span>
                </a>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <a 
                  href="https://saadpie1-deepseek-harness.hf.space" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-colors"
                >
                  <span>Launch DeepSeek Harness</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com/saad-pie" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 font-mono text-xs hover:bg-white/[0.08]"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* 2. Hero Section */}
        <section className="pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Live Status Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE ON FREE HF SPACE · 1 HARNESS · 1 GRAPH</span>
            </motion.div>

            {/* Huge Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]"
            >
              The layer above <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                your agents.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              agentry gives a fleet of AI agents a capability graph they can grow themselves.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
            >
              <a 
                href="#pitch" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all hover:scale-[1.02] shadow-lg shadow-white/5"
              >
                <span>Read the pitch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="https://saadpie1-deepseek-harness.hf.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/10"
              >
                <span>See it live</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>
            </motion.div>
          </div>

          {/* Hero Interactive Capability Graph Visual & Loop Box */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 sm:mt-16 rounded-2xl glass-panel p-2 sm:p-3 relative overflow-hidden group shadow-2xl border border-white/[0.1]"
          >
            {/* Visual Glass Frame with Generated 3D Asset */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[520px] bg-black/60">
              <img 
                src={heroGraphImg} 
                alt="Agentry Capability Graph 3D Visualization showing connected agent tools and memory nodes" 
                className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-black/30 pointer-events-none" />

              {/* Floating Telemetry Badges */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  <span>GRAPH: APPEND-ONLY REPLAYABLE</span>
                </div>
                <div className="hidden sm:flex px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-slate-300 font-mono text-[11px] items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>HARNESS: DEEPSEEK R1</span>
                </div>
              </div>

              {/* Overlay Interactive 3-Step Sequence */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="rounded-xl bg-[#090d16]/90 backdrop-blur-xl border border-emerald-500/25 p-3.5 sm:p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400 pb-2 border-b border-white/[0.06]">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      AUTONOMOUS EXTENSION PIPELINE
                    </span>
                    <span className="text-[11px] text-slate-500">MCP BRIDGE: ACTIVE</span>
                  </div>

                  <div className="font-mono text-[11px] sm:text-[13px] leading-relaxed text-slate-300 overflow-x-auto whitespace-pre pb-1 scrollbar-none">
                    <div className="flex items-center justify-between min-w-[540px] py-1 border-b border-white/[0.04]">
                      <span className="text-white font-medium">harness hits a wall</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-cyan-300">agentry reasons</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-emerald-300 font-semibold">gap recorded</span>
                    </div>
                    <div className="flex items-center justify-between min-w-[540px] py-1 border-b border-white/[0.04]">
                      <span className="text-white font-medium">discovery searches</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-cyan-300">candidates found</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-emerald-300 font-semibold">proposal emailed</span>
                    </div>
                    <div className="flex items-center justify-between min-w-[540px] py-1">
                      <span className="text-white font-medium">human approves</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-cyan-300">graph grows</span>
                      <span className="text-emerald-400 font-bold px-2">→</span>
                      <span className="text-emerald-300 font-semibold">capability added</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3. The Pitch Section */}
        <section id="pitch" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                01 / THE PITCH
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                I trained an agent <br />
                <span className="text-emerald-400">instead of a model.</span>
              </h2>
              <p className="text-sm font-mono text-slate-400 pt-1">
                The manifesto behind agentry's self-expanding architecture.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
              <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
                <p>
                  <strong className="text-white font-semibold">Models get trained once.</strong> Their capabilities are frozen at release. No matter what happens in the real world, the weight matrix is immovable.
                </p>
                <p>
                  <strong className="text-white font-semibold">Agents are static:</strong> whatever tools the developer gave them, that’s what they have forever. When an agent hits an unsupported file format or missing API, it stops dead in its tracks.
                </p>
                <p className="text-emerald-300/90 font-medium bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                  agentry is the opposite bet. Small base capability, but the ability to grow it. Every time the harness hits a wall, agentry learns what’s missing and proposes a permanent fix.
                </p>
              </div>

              {/* Comparison Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 space-y-2">
                  <div className="font-mono text-xs text-red-400 font-semibold flex items-center gap-1.5">
                    <X className="w-4 h-4 text-red-400" />
                    TRADITIONAL AGENTS
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">
                    Hardcoded tools. If a tool doesn't exist at boot time, execution fails and the run terminates.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 space-y-2">
                  <div className="font-mono text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    AGENTRY META-GRAPH
                  </div>
                  <p className="text-xs text-slate-300 leading-normal">
                    Autonomous discovery loop. Discovers tools on GitHub + SearXNG, operator approves via 1-click email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section id="how" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              02 / HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              From a blocked run to a permanent node in the graph.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Five deterministic steps turning operational failures into self-healing capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Hit a wall',
                desc: 'The DeepSeek Harness tries to execute an action and fails. It calls agentry via a bash+curl bridge.',
                icon: Terminal,
                badge: 'MCP Bridge'
              },
              {
                step: '02',
                title: 'Reason about it',
                desc: 'agentry analyzes the failure with an LLM, names the missing capability, and records it as a gap in the graph.',
                icon: Cpu,
                badge: 'Gap Synthesis'
              },
              {
                step: '03',
                title: 'Discover candidates',
                desc: 'The discovery loop runs two searches per gap: GitHub repositories and open-web results via self-hosted SearXNG.',
                icon: Search,
                badge: 'Dual Search'
              },
              {
                step: '04',
                title: 'Propose',
                desc: "An LLM scores each candidate for fit, maturity, and risk. A proposal with approve/reject URLs lands in the operator's inbox.",
                icon: Mail,
                badge: 'Email Dispatch'
              },
              {
                step: '05',
                title: 'Grow the graph',
                desc: 'On approval, the candidate is written into the graph as a live capability. The gap retires. The system is more capable.',
                icon: CheckCircle2,
                badge: 'Graph Expansion'
              }
            ].map((item, index) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={index} 
                  className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {item.step}
                      </span>
                      <IconComp className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-white text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400/80">
                    {item.badge}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              <strong className="text-emerald-300">Append-Only Invariant:</strong> The graph is append-only. Every decision is replayable. Nothing is ever deleted — capabilities are retired, not removed.
            </div>
          </div>
        </section>

        {/* 5. In Production Section */}
        <section id="live" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              03 / IN PRODUCTION
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              One gap. Two sources. Two proposals.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
              That’s the loop. When the DeepSeek Harness was asked to extract text from a PDF, it had no tool. It called agentry, which searched GitHub and the open web, proposing <code className="text-emerald-300 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">pdfplumber</code>, <code className="text-emerald-300 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">pypdf</code>, and <code className="text-emerald-300 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">pdftotext</code> to the operator.
            </p>
          </div>

          {/* Visual Showcase: Production Discovery Flow Asset */}
          <div className="rounded-2xl glass-panel p-2 sm:p-3 mb-10 overflow-hidden border border-white/[0.1] shadow-2xl">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[500px] bg-black/60">
              <img 
                src={discoveryFlowImg} 
                alt="Agentry autonomous tool discovery workflow interface" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="text-xs font-mono text-slate-300">
                    REAL INCIDENT: <span className="text-white font-semibold">gap:pdf.extract</span> → 3 CANDIDATES GENERATED
                  </div>
                </div>

                <button
                  onClick={() => setApprovedSimulation(!approvedSimulation)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                    approvedSimulation 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{approvedSimulation ? 'Capability Approved: Graph Updated' : 'Simulate Operator Approval'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verbatim Terminal Log Card */}
          <div className="rounded-2xl glass-panel border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="bg-[#0b0f19] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/60 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block"></span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActiveLogTab('log')}
                    className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                      activeLogTab === 'log' ? 'bg-white/10 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    discovery.tick.log
                  </button>
                  <button 
                    onClick={() => setActiveLogTab('jsonl')}
                    className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                      activeLogTab === 'jsonl' ? 'bg-white/10 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    events.jsonl
                  </button>
                </div>
              </div>

              <button
                onClick={() => copyCode(activeLogTab === 'log' ? discoveryLogText : jsonlExcerpt)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white font-mono text-xs transition-colors"
                aria-label="Copy logs"
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
              <code>{activeLogTab === 'log' ? discoveryLogText : jsonlExcerpt}</code>
            </pre>

            <div className="bg-[#0b0f19]/80 px-4 py-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Self-hosted SearXNG + GitHub Search Engine co-located in Space</span>
              </span>
              <a 
                href="https://saadpie1-deepseek-harness.hf.space" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Inspect running harness</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* 6. Architecture Section */}
        <section id="arch" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              04 / ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Four coordinated primitives.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Co-located Docker deployment orchestrating the worker, the meta-engine, search, and storage.
            </p>
          </div>

          {/* Architecture 3D Diagram Visual */}
          <div className="rounded-2xl glass-panel p-2 sm:p-3 mb-8 overflow-hidden border border-white/[0.1] shadow-2xl">
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] max-h-[460px] bg-black/60">
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

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Harness',
                sub: 'Worker Agent',
                desc: 'DeepSeek Harness. The worker agent. Hits walls, calls agentry over bash+curl bridge.',
                tech: 'DeepSeek R1 / V3'
              },
              {
                title: 'Agentry',
                sub: 'Meta-System',
                desc: 'The meta-system. Owns the graph, runs discovery, evaluates fit scores, sends proposals.',
                tech: 'Node.js 22 Engine'
              },
              {
                title: 'SearXNG',
                sub: 'Metasearch Gateway',
                desc: 'Self-hosted metasearch instance. Fires GitHub and open-web queries per gap without tracking.',
                tech: 'Self-hosted Docker'
              },
              {
                title: 'Storage',
                sub: 'Append-Only Ledger',
                desc: 'Append-only JSONL. capabilities.jsonl and events.jsonl. Pushed to GitHub every 5 minutes.',
                tech: 'Git Sync Cron'
              }
            ].map((node, i) => (
              <div 
                key={i}
                onMouseEnter={() => setActiveArchNode(i)}
                onMouseLeave={() => setActiveArchNode(null)}
                className={`p-5 rounded-2xl glass-panel transition-all duration-300 relative ${
                  activeArchNode === i 
                    ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10 -translate-y-1' 
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-white text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {node.title}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">{node.sub}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {node.desc}
                </p>
                <div className="pt-2 border-t border-white/[0.06] font-mono text-[11px] text-emerald-400/80">
                  {node.tech}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Stack Section */}
        <section id="stack" className="py-16 sm:py-24 border-t border-white/[0.08]">
          <div className="space-y-4 mb-10">
            <span className="font-mono text-xs tracking-widest uppercase text-emerald-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              05 / STACK
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              System specifications.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Pure lean tooling running on zero-dollar compute budgets.
            </p>
          </div>

          <div className="rounded-2xl glass-panel border border-white/[0.1] overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              {[
                { label: 'Runtime', val: 'Node.js 22' },
                { label: 'Deployment', val: 'Hugging Face Spaces (Docker)' },
                { label: 'Storage', val: 'append-only JSONL on disk' },
                { label: 'Reasoning', val: 'OpenAI-compatible LLM routing with a fallback chain' },
                { label: 'Discovery', val: 'GitHub Search API + self-hosted SearXNG' },
                { label: 'Notify', val: 'Gmail API (OAuth 2.0)' },
                { label: 'Harness bridge', val: 'bash + curl over MCP' }
              ].map((row, idx) => (
                <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                  <span className="font-mono text-xs sm:text-sm text-slate-400 font-medium sm:w-1/3">
                    {row.label}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-emerald-300 sm:w-2/3">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 bg-emerald-500/[0.04] border-t border-white/[0.08] text-xs font-mono text-slate-400">
              ⚡ Everything runs on free-tier infrastructure. No external LLM API keys. No proprietary services.
            </div>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
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
              <a href="/privacy.html" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms.html" className="hover:text-white transition-colors">Terms</a>
              <a href="mailto:apiaf615@gmail.com" className="hover:text-white transition-colors">Contact</a>
              <a href="https://saadpie1-deepseek-harness.hf.space" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">HuggingFace Space ↗</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-white/[0.06] text-xs text-slate-500 font-mono">
            <div>No cookies. No analytics. No tracking. Just a capability graph.</div>
            <div>© 2026 saad-pie. MIT licensed.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
