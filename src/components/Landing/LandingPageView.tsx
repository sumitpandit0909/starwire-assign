import React, { useState } from 'react';

interface LandingPageViewProps {
  onEnterTerminal: () => void;
  onSelectStar?: (starId: string) => void;
  onOpenIntelligence?: (starName?: string) => void;
  onRequestAccess: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAuthenticated?: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterTerminal,
  onRequestAccess,
  isDarkMode,
  onToggleTheme,
  isAuthenticated = false,
}) => {
  // Interactive Terminal Preview Tab State
  const [activePreviewTab, setActivePreviewTab] = useState<'ai' | 'boxOffice' | 'dossier'>('ai');

  // Primary CTA action: enter terminal if logged in, otherwise open sign in
  const handlePrimaryCta = () => {
    if (isAuthenticated) {
      onEnterTerminal();
    } else {
      onRequestAccess();
    }
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#131313] text-[#FAF9F6] selection:bg-[#f2ca50] selection:text-[#131313] font-sans">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#131313]/90 backdrop-blur-xl border-b border-[#4d4635]/25 px-4 md:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="group flex items-center gap-3 cursor-pointer" onClick={handlePrimaryCta}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] font-bold shadow-lg shadow-[#f2ca50]/20 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_20px_rgba(242,202,80,0.5)] transition-all duration-300">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div>
              <span className="font-wordmark text-base md:text-lg uppercase tracking-[0.35em] text-[#f2ca50] font-bold block group-hover:text-[#ffe088] transition-colors">
                STARWIRE
              </span>
              <span className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-bold block">
                ENTERTAINMENT INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-[#d0c5af]">
            <a
              href="#core-capabilities"
              className="relative py-1 transition-colors hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              Platform Features
            </a>
            <a
              href="#terminal-preview"
              className="relative py-1 transition-colors hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              AI Terminal Preview
            </a>
            <a
              href="#global-coverage"
              className="relative py-1 transition-colors hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              Global Coverage
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-[#d0c5af] hover:text-[#f2ca50] bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Main Sign In / Terminal CTA */}
            <button
              id="landing-auth-btn"
              onClick={handlePrimaryCta}
              className="group flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(242,202,80,0.5)] hover:scale-105 active:scale-95 cursor-pointer font-data-label"
            >
              <span>{isAuthenticated ? 'Go to Terminal' : 'Sign In / Register'}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32 px-4 md:px-12 border-b border-[#4d4635]/20">
        
        {/* Cinematic Backdrop Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/15 rounded-full blur-[140px] animate-pulse duration-[4000ms]" />
          <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px] animate-pulse duration-[5000ms]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8 animate-fade-in">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1c1b1b]/90 border border-[#f2ca50]/40 text-[#f2ca50] text-xs font-mono font-semibold tracking-wider shadow-lg hover:scale-105 hover:border-[#f2ca50] transition-all duration-300 shadow-[0_0_15px_rgba(242,202,80,0.15)]">
            <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
            <span>NEXT-GEN ENTERTAINMENT &amp; TALENT EQUITY INTELLIGENCE PLATFORM</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-xl text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FAF9F6] tracking-tight leading-[1.08] max-w-5xl mx-auto">
            The Executive Intelligence Terminal for <br />
            <span className="bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c5a028] bg-clip-text text-transparent">
              Global Cinema &amp; Talent Equity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-base sm:text-lg md:text-xl text-[#d0c5af] max-w-3xl mx-auto font-light leading-relaxed">
            Harness proprietary StarScore™ talent equity benchmarks, Gemini AI-powered predictive intelligence, and theatrical box office telemetry for producers, distributors, and talent agencies.
          </p>

          {/* Single High-Impact Primary CTA */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handlePrimaryCta}
              className="group flex items-center gap-3 px-9 py-4.5 rounded-2xl bg-gradient-to-r from-[#f2ca50] via-[#ffe088] to-[#f2ca50] bg-[length:200%_auto] hover:bg-right text-[#131313] font-bold text-sm uppercase tracking-wider transition-all duration-500 shadow-[0_0_30px_rgba(242,202,80,0.35)] hover:shadow-[0_0_50px_rgba(242,202,80,0.6)] hover:scale-105 active:scale-95 cursor-pointer font-data-label"
            >
              <span className="material-symbols-outlined text-[22px]">lock_open</span>
              <span>{isAuthenticated ? 'Enter Terminal Dashboard' : 'Access Intelligence Terminal'}</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1.5 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Executive Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12 border-t border-[#4d4635]/25 text-left">
            <div className="group p-5 rounded-2xl bg-[#1c1b1b]/80 border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(242,202,80,0.15)] transition-all duration-300 cursor-default">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Tracked Box Office</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#10B981] font-bold group-hover:scale-105 transition-transform duration-300 block origin-left">
                $4.8B+
              </span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5 font-mono">Global &amp; Pan-Indian</span>
            </div>

            <div className="group p-5 rounded-2xl bg-[#1c1b1b]/80 border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(242,202,80,0.15)] transition-all duration-300 cursor-default">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Monitored Talent</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#f2ca50] font-bold group-hover:scale-105 transition-transform duration-300 block origin-left">
                12,400+
              </span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5 font-mono">Stars &amp; Directors</span>
            </div>

            <div className="group p-5 rounded-2xl bg-[#1c1b1b]/80 border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(242,202,80,0.15)] transition-all duration-300 cursor-default">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">AI Polarity Index</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#FAF9F6] font-bold group-hover:scale-105 transition-transform duration-300 block origin-left">
                96.4%
              </span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5 font-mono">Positive Sentiment</span>
            </div>

            <div className="group p-5 rounded-2xl bg-[#1c1b1b]/80 border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-1.5 hover:shadow-[0_10px_25px_rgba(242,202,80,0.15)] transition-all duration-300 cursor-default">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Proprietary Metric</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#f2ca50] font-bold group-hover:scale-105 transition-transform duration-300 block origin-left">
                StarScore™
              </span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5 font-mono">Equity Benchmark</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive AI Terminal Preview Showcase */}
      <section id="terminal-preview" className="py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">EXECUTIVE TERMINAL PREVIEW</span>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] font-bold">
            Real-Time AI Dossier &amp; Talent Analytics Command
          </h2>
          <p className="text-sm text-[#d0c5af] font-light">
            Preview our live executive dashboard interface combining real-time talent scoring, audience polarity, and box office forecasting.
          </p>
        </div>

        {/* Interactive Terminal Window */}
        <div className="group bg-[#1c1b1b] border border-[#f2ca50]/40 hover:border-[#f2ca50]/70 hover:shadow-[0_20px_50px_rgba(242,202,80,0.15)] transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl space-y-0">
          {/* Window Titlebar */}
          <div className="bg-[#131313] px-6 py-3 border-b border-[#4d4635]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-[#f2ca50]" />
              <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-xs font-mono text-[#99907c] ml-3 hidden sm:inline-block">
                starwire-terminal://ai-intelligence-console
              </span>
            </div>

            {/* Terminal Tabs */}
            <div className="flex items-center gap-2">
              {[
                { key: 'ai', label: 'AI Intelligence Dossier' },
                { key: 'boxOffice', label: 'Box Office Forecast' },
                { key: 'dossier', label: 'StarScore™ Rankings' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePreviewTab(tab.key as any)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                    activePreviewTab === tab.key
                      ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                      : 'text-[#d0c5af] hover:text-[#FAF9F6] hover:bg-[#252424]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Window Body */}
          <div className="p-6 md:p-8 space-y-6">
            {activePreviewTab === 'ai' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4d4635]/30 pb-4">
                  <div className="flex items-center gap-4">
                    {/* Real TMDB Image of Tom Hanks */}
                    <img
                      src="https://image.tmdb.org/t/p/w500/oFvZoKI6lvU03n4YoNGAll9rkas.jpg"
                      alt="Tom Hanks"
                      className="w-16 h-16 rounded-xl object-cover border-2 border-[#f2ca50] shadow-md group-hover:scale-105 group-hover:border-[#f2ca50] transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[10px] font-mono text-[#10B981] uppercase tracking-wider block font-bold">
                        AI MONITORED DOSSIER
                      </span>
                      <h3 className="font-headline-md text-2xl text-[#FAF9F6] font-bold">Tom Hanks</h3>
                      <p className="text-xs font-mono text-[#99907c]">StarScore Equity: 97.4 / 100</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold shadow-sm">
                      94.8% POSITIVE POLARITY
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 hover:-translate-y-1 transition-all duration-300 space-y-1">
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Lifetime Global Gross</span>
                    <span className="text-xl font-bold font-mono text-[#f2ca50]">&gt; $4.2B</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all duration-300 space-y-1">
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Box Office Multiplier</span>
                    <span className="text-xl font-bold font-mono text-[#10B981]">3.85x Est.</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#06B6D4]/50 hover:-translate-y-1 transition-all duration-300 space-y-1">
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Risk Quotient</span>
                    <span className="text-xl font-bold font-mono text-[#06B6D4]">Low Volatility</span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'boxOffice' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-4">
                  <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold">
                    Pan-Indian &amp; Global Theatrical Telemetry
                  </h3>
                  <span className="text-xs font-mono text-[#f2ca50] font-bold">3-YEAR FORECAST MODEL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 hover:-translate-y-1 transition-all duration-300 space-y-2">
                    <span className="text-xs font-mono text-[#f2ca50] uppercase font-bold">North American Circuit</span>
                    <div className="text-2xl font-bold font-mono text-[#FAF9F6]">$1.45B Projected</div>
                    <p className="text-xs text-[#d0c5af] font-light">Strong multiplex opening retention with +18.4% secondary streaming catalog value.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#10B981]/50 hover:-translate-y-1 transition-all duration-300 space-y-2">
                    <span className="text-xs font-mono text-[#10B981] uppercase font-bold">Pan-Indian Circuit</span>
                    <div className="text-2xl font-bold font-mono text-[#FAF9F6]">₹2,840 Cr Projected</div>
                    <p className="text-xs text-[#d0c5af] font-light">High multi-language dubbed theatrical conversion across South &amp; Hindi circuits.</p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'dossier' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-4">
                  <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold">
                    StarScore™ Equity Benchmark Index
                  </h3>
                  <span className="text-xs font-mono text-[#10B981] font-bold">PROPRIETARY WEIGHTED</span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 hover:translate-x-1 transition-all duration-200 flex items-center justify-between cursor-default">
                    <span>#1 Shah Rukh Khan (Bollywood / Global)</span>
                    <span className="text-[#f2ca50] font-bold">98.2 / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 hover:translate-x-1 transition-all duration-200 flex items-center justify-between cursor-default">
                    <span>#2 Tom Hanks (Hollywood / Global)</span>
                    <span className="text-[#f2ca50] font-bold">97.4 / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#131313] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 hover:translate-x-1 transition-all duration-200 flex items-center justify-between cursor-default">
                    <span>#3 Prabhas (Pan-Indian Cinema)</span>
                    <span className="text-[#f2ca50] font-bold">96.8 / 100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities Bento Grid */}
      <section id="core-capabilities" className="py-20 px-4 md:px-12 bg-[#171616] border-y border-[#4d4635]/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">INTELLIGENCE PLATFORM</span>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-[#FAF9F6] font-bold">
              Engineered for Precision Entertainment Decisions
            </h2>
            <p className="text-sm md:text-base text-[#d0c5af] font-light">
              Synthesizing global data points across box office theatrical telemetry, digital engagement, brand affinity, and multi-territorial reach.
            </p>
          </div>

          {/* 4-Pillar Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="group p-7 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 group-hover:scale-115 group-hover:rotate-3 group-hover:bg-[#f2ca50]/25 group-hover:border-[#f2ca50]/60 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">analytics</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest font-bold">PILLAR 01</span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                  StarScore™ Equity Engine
                </h3>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Proprietary algorithmic index measuring commercial opening day pull, career box office velocity, and digital brand equity out of 100.
                </p>
              </div>
              <div className="pt-3 border-t border-[#4d4635]/20 text-[11px] font-mono text-[#f2ca50]">
                <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">Weighted Model →</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group p-7 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#10B981]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30 group-hover:scale-115 group-hover:rotate-3 group-hover:bg-[#10B981]/25 group-hover:border-[#10B981]/60 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">public</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest font-bold">PILLAR 02</span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#10B981] transition-colors">
                  Live Telemetry Pipeline
                </h3>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Continuous telemetry tracking worldwide theatrical releases, international ratings, and audience sentiment velocity.
                </p>
              </div>
              <div className="pt-3 border-t border-[#4d4635]/20 text-[11px] font-mono text-[#10B981]">
                <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">Live Sync →</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group p-7 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#b4c5ff]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#b4c5ff]/15 text-[#b4c5ff] flex items-center justify-center border border-[#b4c5ff]/30 group-hover:scale-115 group-hover:rotate-3 group-hover:bg-[#b4c5ff]/25 group-hover:border-[#b4c5ff]/60 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest font-bold">PILLAR 03</span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#b4c5ff] transition-colors">
                  Gemini AI Synthesizer
                </h3>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Instant executive briefings on star commercial trajectories, risk assessments, demographic polarity, and pre-sales forecasting.
                </p>
              </div>
              <div className="pt-3 border-t border-[#4d4635]/20 text-[11px] font-mono text-[#b4c5ff]">
                <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">Generative Analysis →</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="group p-7 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#e57373]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#e57373]/15 text-[#e57373] flex items-center justify-center border border-[#e57373]/30 group-hover:scale-115 group-hover:rotate-3 group-hover:bg-[#e57373]/25 group-hover:border-[#e57373]/60 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">monitoring</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest font-bold">PILLAR 04</span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#e57373] transition-colors">
                  Territorial Box Office
                </h3>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Deep regional granularity separating Hindi belt, Southern theatrical circles (Tamil/Telugu/Malayalam), and Overseas IMAX circuits.
                </p>
              </div>
              <div className="pt-3 border-t border-[#4d4635]/20 text-[11px] font-mono text-[#e57373]">
                <span className="inline-block group-hover:translate-x-2 transition-transform duration-300">Multi-Territory Footprint →</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Global Cinema Coverage & Intelligence Network */}
      <section id="global-coverage" className="py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">GLOBAL FOOTPRINT</span>
          <h2 className="font-headline-xl text-3xl md:text-5xl text-[#FAF9F6] font-bold">
            Multi-Territorial Cinema &amp; Market Intelligence Network
          </h2>
          <p className="text-sm md:text-base text-[#d0c5af] font-light">
            Consolidating box office telemetry, talent valuation models, and sentiment feeds across all major worldwide theatrical markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Market 1 */}
          <div className="group p-8 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/30 flex items-center justify-center text-[#f2ca50] group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">movie</span>
              </div>
              <span className="text-xs font-mono text-[#f2ca50] uppercase tracking-widest font-bold">INDIAN THEATRICAL CIRCLES</span>
              <h3 className="font-headline-md text-2xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">Bollywood &amp; Pan-Indian Cinema</h3>
              <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                Live tracking across Hindi, Telugu, Tamil, Malayalam, and Kannada theatrical circuits with dubbed box office multipliers and advance ticketing signals.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4d4635]/25 text-xs font-mono text-[#10B981] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Pan-Indian Telemetry Active</span>
            </div>
          </div>

          {/* Market 2 */}
          <div className="group p-8 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#10B981]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">stars</span>
              </div>
              <span className="text-xs font-mono text-[#10B981] uppercase tracking-widest font-bold">NORTH AMERICAN &amp; GLOBAL</span>
              <h3 className="font-headline-md text-2xl text-[#FAF9F6] group-hover:text-[#10B981] transition-colors">Hollywood Studio Pipeline</h3>
              <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                Executive dossier reports, opening weekend tracking, secondary VOD/streaming window valuations, and international box office retention rates.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4d4635]/25 text-xs font-mono text-[#10B981] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Studio Analytics Active</span>
            </div>
          </div>

          {/* Market 3 */}
          <div className="group p-8 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#06B6D4]/70 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl cursor-default">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
                <span className="material-symbols-outlined text-[26px]">public</span>
              </div>
              <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest font-bold">OVERSEAS &amp; IMAX CIRCUITS</span>
              <h3 className="font-headline-md text-2xl text-[#FAF9F6] group-hover:text-[#06B6D4] transition-colors">Global Distribution Footprint</h3>
              <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                Multi-currency box office conversion, IMAX screen capacity indices, and overseas distribution benchmarks for international co-productions.
              </p>
            </div>
            <div className="pt-4 border-t border-[#4d4635]/25 text-xs font-mono text-[#06B6D4] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>International Circuit Active</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 px-4 md:px-12 border-t border-[#4d4635]/20 text-xs text-[#99907c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="font-wordmark text-sm uppercase tracking-[0.3em] text-[#f2ca50] font-bold">
              STARWIRE INTELLIGENCE
            </span>
            <span>·</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-mono uppercase text-[11px]">
            <button onClick={handlePrimaryCta} className="text-[#f2ca50] hover:underline cursor-pointer">
              Launch Terminal
            </button>
            <span>·</span>
            <button onClick={onRequestAccess} className="text-[#d0c5af] hover:text-[#FAF9F6] cursor-pointer">
              Request Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
