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
    <div
      id="landing-page-root"
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans overflow-x-hidden"
    >
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[var(--bg-surface)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-3 sm:px-6 md:px-12 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0"
            onClick={handlePrimaryCta}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] font-bold shadow-lg shadow-[#f2ca50]/20 group-hover:scale-105 transition-all duration-300 shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">auto_awesome</span>
            </div>
            <div>
              <span className="font-wordmark text-xs sm:text-base md:text-lg uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#9A7210] dark:text-[#f2ca50] font-bold block group-hover:text-[#ffe088] transition-colors leading-tight">
                STARWIRE
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] text-[#059669] dark:text-[#10B981] tracking-widest uppercase font-bold hidden sm:block">
                ENTERTAINMENT INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-[var(--text-variant)]">
            <a
              href="#core-capabilities"
              className="relative py-1 transition-colors hover:text-[#9A7210] dark:hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              Platform Features
            </a>
            <a
              href="#terminal-preview"
              className="relative py-1 transition-colors hover:text-[#9A7210] dark:hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              AI Terminal Preview
            </a>
            <a
              href="#global-coverage"
              className="relative py-1 transition-colors hover:text-[#9A7210] dark:hover:text-[#f2ca50] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f2ca50] hover:after:w-full after:transition-all after:duration-300"
            >
              Global Coverage
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Switcher Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleTheme();
              }}
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-[var(--text-variant)] hover:text-[#f2ca50] bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Main Sign In / Terminal CTA */}
            <button
              id="landing-auth-btn"
              onClick={handlePrimaryCta}
              className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_25px_rgba(242,202,80,0.5)] hover:scale-105 active:scale-95 cursor-pointer font-data-label shrink-0 shadow-md"
            >
              <span>{isAuthenticated ? 'Terminal' : 'Sign In'}</span>
              <span className="material-symbols-outlined text-[14px] sm:text-[16px] group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 md:pt-24 pb-16 sm:pb-20 md:pb-32 px-3 sm:px-6 md:px-12 border-b border-[var(--border-subtle)]">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] md:w-[800px] h-[300px] sm:h-[500px] bg-[#d4af37]/15 rounded-full blur-[100px] sm:blur-[140px] animate-pulse duration-[4000ms]" />
          <div className="absolute top-1/2 right-10 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-[#10B981]/10 rounded-full blur-[80px] sm:blur-[120px] animate-pulse duration-[5000ms]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6 sm:space-y-8 animate-fade-in">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[var(--bg-surface-container)] border border-[#f2ca50]/40 text-[#9A7210] dark:text-[#f2ca50] text-[10px] sm:text-xs font-mono font-semibold tracking-wider shadow-md max-w-full">
            <span className="material-symbols-outlined text-[14px] sm:text-[16px] animate-pulse shrink-0">
              auto_awesome
            </span>
            <span className="truncate">ENTERTAINMENT &amp; TALENT EQUITY INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-xl text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight sm:leading-[1.08] max-w-5xl mx-auto px-2">
            The Executive Intelligence Terminal for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#9A7210] via-[#d4af37] to-[#785806] dark:from-[#ffe088] dark:via-[#f2ca50] dark:to-[#c5a028] bg-clip-text text-transparent">
              Global Cinema &amp; Talent Equity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-xs sm:text-base md:text-xl text-[var(--text-variant)] max-w-3xl mx-auto font-light leading-relaxed px-2">
            Harness proprietary StarScore™ talent equity benchmarks, Gemini AI-powered predictive
            intelligence, and theatrical box office telemetry for producers, distributors, and
            talent agencies.
          </p>

          {/* Single High-Impact Primary CTA */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <button
              onClick={handlePrimaryCta}
              className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-9 py-3 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#f2ca50] via-[#ffe088] to-[#f2ca50] bg-[length:200%_auto] hover:bg-right text-[#131313] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-500 shadow-[0_0_30px_rgba(242,202,80,0.35)] hover:shadow-[0_0_50px_rgba(242,202,80,0.6)] hover:scale-105 active:scale-95 cursor-pointer font-data-label"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[22px]">lock_open</span>
              <span>
                {isAuthenticated ? 'Enter Terminal Dashboard' : 'Access Intelligence Terminal'}
              </span>
              <span className="material-symbols-outlined text-[15px] sm:text-[18px] group-hover:translate-x-1.5 transition-transform duration-300">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Executive Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-8 sm:pt-12 border-t border-[var(--border-subtle)] text-left">
            <div className="group p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 cursor-default shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold truncate">
                Tracked Box Office
              </span>
              <span className="font-headline-md text-xl sm:text-2xl md:text-3xl text-[#059669] dark:text-[#10B981] font-bold block mt-0.5">
                $4.8B+
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--text-variant)] block mt-0.5 font-mono">
                Global &amp; Pan-Indian
              </span>
            </div>

            <div className="group p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 cursor-default shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold truncate">
                Monitored Talent
              </span>
              <span className="font-headline-md text-xl sm:text-2xl md:text-3xl text-[#9A7210] dark:text-[#f2ca50] font-bold block mt-0.5">
                12,400+
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--text-variant)] block mt-0.5 font-mono">
                Stars &amp; Directors
              </span>
            </div>

            <div className="group p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 cursor-default shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold truncate">
                AI Polarity Index
              </span>
              <span className="font-headline-md text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] font-bold block mt-0.5">
                96.4%
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--text-variant)] block mt-0.5 font-mono">
                Positive Sentiment
              </span>
            </div>

            <div className="group p-3.5 sm:p-5 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 cursor-default shadow-sm">
              <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold truncate">
                Proprietary Metric
              </span>
              <span className="font-headline-md text-xl sm:text-2xl md:text-3xl text-[#9A7210] dark:text-[#f2ca50] font-bold block mt-0.5">
                StarScore™
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--text-variant)] block mt-0.5 font-mono">
                Equity Benchmark
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive AI Terminal Preview Showcase */}
      <section
        id="terminal-preview"
        className="py-12 sm:py-20 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-6 sm:space-y-10"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <span className="font-wordmark text-[10px] sm:text-xs text-[#9A7210] dark:text-[#f2ca50] tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            EXECUTIVE TERMINAL PREVIEW
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] font-bold">
            Real-Time AI Dossier &amp; Talent Analytics Command
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-variant)] font-light">
            Preview our live executive dashboard interface combining real-time talent scoring,
            audience polarity, and box office forecasting.
          </p>
        </div>

        {/* Interactive Terminal Window */}
        <div className="group bg-[var(--bg-surface-container)] border border-[#f2ca50]/40 rounded-2xl overflow-hidden shadow-2xl space-y-0">
          {/* Window Titlebar */}
          <div className="bg-[var(--bg-surface-high)] px-4 sm:px-6 py-3 border-b border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0 animate-pulse" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f2ca50] shrink-0" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-[11px] font-mono text-[var(--text-muted)] ml-2 hidden sm:inline-block">
                starwire-terminal://ai-intelligence-console
              </span>
            </div>

            {/* Terminal Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide w-full sm:w-auto">
              {[
                { key: 'ai', label: 'AI Dossier' },
                { key: 'boxOffice', label: 'Box Office Forecast' },
                { key: 'dossier', label: 'StarScore™ Index' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePreviewTab(tab.key as any)}
                  className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 text-[11px] font-mono rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap text-center ${
                    activePreviewTab === tab.key
                      ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                      : 'text-[var(--text-variant)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-highest)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Window Body */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            {activePreviewTab === 'ai' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Real TMDB Image of Tom Hanks */}
                    <img
                      src="https://image.tmdb.org/t/p/w500/oFvZoKI6lvU03n4YoNGAll9rkas.jpg"
                      alt="Tom Hanks"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-[#f2ca50] shadow-md shrink-0 aspect-square"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#059669] dark:text-[#10B981] uppercase tracking-wider block font-bold">
                        AI MONITORED DOSSIER
                      </span>
                      <h3 className="font-headline-md text-xl sm:text-2xl text-[var(--text-primary)] font-bold">
                        Tom Hanks
                      </h3>
                      <p className="text-[11px] font-mono text-[var(--text-muted)]">
                        StarScore Equity: 97.4 / 100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#059669] dark:text-[#10B981] border border-[#10B981]/30 text-[11px] font-mono font-bold shadow-sm">
                      94.8% POSITIVE POLARITY
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      Lifetime Global Gross
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#9A7210] dark:text-[#f2ca50]">
                      &gt; $4.2B
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      Box Office Multiplier
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#059669] dark:text-[#10B981]">
                      3.85x Est.
                    </span>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      Risk Quotient
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#06B6D4]">
                      Low Volatility
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'boxOffice' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                  <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] font-bold">
                    Pan-Indian &amp; Global Theatrical Telemetry
                  </h3>
                  <span className="text-xs font-mono text-[#9A7210] dark:text-[#f2ca50] font-bold">
                    3-YEAR FORECAST MODEL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                    <span className="text-xs font-mono text-[#9A7210] dark:text-[#f2ca50] uppercase font-bold">
                      North American Circuit
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)]">
                      $1.45B Projected
                    </div>
                    <p className="text-xs text-[var(--text-variant)] font-light">
                      Strong multiplex opening retention with +18.4% secondary streaming catalog
                      value.
                    </p>
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-2">
                    <span className="text-xs font-mono text-[#059669] dark:text-[#10B981] uppercase font-bold">
                      Pan-Indian Circuit
                    </span>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-[var(--text-primary)]">
                      ₹2,840 Cr Projected
                    </div>
                    <p className="text-xs text-[var(--text-variant)] font-light">
                      High multi-language dubbed theatrical conversion across South &amp; Hindi
                      circuits.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'dossier' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                  <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] font-bold">
                    StarScore™ Equity Benchmark Index
                  </h3>
                  <span className="text-xs font-mono text-[#059669] dark:text-[#10B981] font-bold">
                    PROPRIETARY WEIGHTED
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between cursor-default">
                    <span className="truncate pr-2">#1 Shah Rukh Khan (Bollywood / Global)</span>
                    <span className="text-[#9A7210] dark:text-[#f2ca50] font-bold shrink-0">
                      98.2 / 100
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between cursor-default">
                    <span className="truncate pr-2">#2 Tom Hanks (Hollywood / Global)</span>
                    <span className="text-[#9A7210] dark:text-[#f2ca50] font-bold shrink-0">
                      97.4 / 100
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between cursor-default">
                    <span className="truncate pr-2">#3 Prabhas (Pan-Indian Cinema)</span>
                    <span className="text-[#9A7210] dark:text-[#f2ca50] font-bold shrink-0">
                      96.8 / 100
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Core Capabilities Bento Grid */}
      <section
        id="core-capabilities"
        className="py-12 sm:py-20 px-3 sm:px-6 md:px-12 bg-[var(--bg-surface-low)] border-y border-[var(--border-subtle)] transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
            <span className="font-wordmark text-[10px] sm:text-xs text-[#9A7210] dark:text-[#f2ca50] tracking-[0.25em] sm:tracking-[0.3em] uppercase">
              INTELLIGENCE PLATFORM
            </span>
            <h2 className="font-headline-xl text-2xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-bold">
              Engineered for Precision Entertainment Decisions
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-[var(--text-variant)] font-light">
              Synthesizing global data points across box office theatrical telemetry, digital
              engagement, brand affinity, and multi-territorial reach.
            </p>
          </div>

          {/* 4-Pillar Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="group p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f2ca50]/15 text-[#9A7210] dark:text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
                  analytics
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
                  PILLAR 01
                </span>
                <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-[#9A7210] dark:group-hover:text-[#f2ca50] transition-colors">
                  StarScore™ Equity Engine
                </h3>
                <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                  Proprietary algorithmic index measuring commercial opening day pull, career box
                  office velocity, and digital brand equity out of 100.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[#9A7210] dark:text-[#f2ca50]">
                <span>Weighted Model →</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#10B981]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#10B981]/15 text-[#059669] dark:text-[#10B981] flex items-center justify-center border border-[#10B981]/30 shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
                  public
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
                  PILLAR 02
                </span>
                <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-[#059669] dark:group-hover:text-[#10B981] transition-colors">
                  Live Telemetry Pipeline
                </h3>
                <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                  Continuous telemetry tracking worldwide theatrical releases, international
                  ratings, and audience sentiment velocity.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[#059669] dark:text-[#10B981]">
                <span>Live Sync →</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#b4c5ff]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#b4c5ff]/15 text-[#2563EB] dark:text-[#b4c5ff] flex items-center justify-center border border-[#b4c5ff]/30 shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
                  psychology
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
                  PILLAR 03
                </span>
                <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-[#2563EB] dark:group-hover:text-[#b4c5ff] transition-colors">
                  Gemini AI Synthesizer
                </h3>
                <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                  Instant executive briefings on star commercial trajectories, risk assessments,
                  demographic polarity, and pre-sales forecasting.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[#2563EB] dark:text-[#b4c5ff]">
                <span>Generative Analysis →</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="group p-5 sm:p-7 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#e57373]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-default shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#e57373]/15 text-[#DC2626] dark:text-[#e57373] flex items-center justify-center border border-[#e57373]/30 shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
                  monitoring
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">
                  PILLAR 04
                </span>
                <h3 className="font-headline-md text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-[#DC2626] dark:group-hover:text-[#e57373] transition-colors">
                  Territorial Box Office
                </h3>
                <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                  Deep regional granularity separating Hindi belt, Southern theatrical circles
                  (Tamil/Telugu/Malayalam), and Overseas IMAX circuits.
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[#DC2626] dark:text-[#e57373]">
                <span>Multi-Territory Footprint →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Global Cinema Coverage & Intelligence Network */}
      <section
        id="global-coverage"
        className="py-12 sm:py-20 px-3 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8 sm:space-y-12"
      >
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
          <span className="font-wordmark text-[10px] sm:text-xs text-[#9A7210] dark:text-[#f2ca50] tracking-[0.25em] sm:tracking-[0.3em] uppercase">
            GLOBAL FOOTPRINT
          </span>
          <h2 className="font-headline-xl text-2xl sm:text-4xl md:text-5xl text-[var(--text-primary)] font-bold">
            Multi-Territorial Cinema &amp; Market Intelligence Network
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[var(--text-variant)] font-light">
            Consolidating box office telemetry, talent valuation models, and sentiment feeds
            across all major worldwide theatrical markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* Market 1 */}
          <div className="group p-5 sm:p-8 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#f2ca50]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6 shadow-md cursor-default">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f2ca50]/15 border border-[#f2ca50]/30 flex items-center justify-center text-[#9A7210] dark:text-[#f2ca50] shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">movie</span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-[#9A7210] dark:text-[#f2ca50] uppercase tracking-widest font-bold block">
                INDIAN THEATRICAL CIRCLES
              </span>
              <h3 className="font-headline-md text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[#9A7210] dark:group-hover:text-[#f2ca50] transition-colors">
                Bollywood &amp; Pan-Indian Cinema
              </h3>
              <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                Live tracking across Hindi, Telugu, Tamil, Malayalam, and Kannada theatrical
                circuits with dubbed box office multipliers and advance ticketing signals.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-xs font-mono text-[#059669] dark:text-[#10B981] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Pan-Indian Telemetry Active</span>
            </div>
          </div>

          {/* Market 2 */}
          <div className="group p-5 sm:p-8 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#10B981]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6 shadow-md cursor-default">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#059669] dark:text-[#10B981] shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">stars</span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-[#059669] dark:text-[#10B981] uppercase tracking-widest font-bold block">
                NORTH AMERICAN &amp; GLOBAL
              </span>
              <h3 className="font-headline-md text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[#059669] dark:group-hover:text-[#10B981] transition-colors">
                Hollywood Studio Pipeline
              </h3>
              <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                Executive dossier reports, opening weekend tracking, secondary VOD/streaming window
                valuations, and international box office retention rates.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-xs font-mono text-[#059669] dark:text-[#10B981] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Studio Analytics Active</span>
            </div>
          </div>

          {/* Market 3 */}
          <div className="group p-5 sm:p-8 rounded-2xl bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] hover:border-[#06B6D4]/70 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6 shadow-md cursor-default">
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4] shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[26px]">public</span>
              </div>
              <span className="text-[10px] sm:text-xs font-mono text-[#06B6D4] uppercase tracking-widest font-bold block">
                OVERSEAS &amp; IMAX CIRCUITS
              </span>
              <h3 className="font-headline-md text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[#06B6D4] transition-colors">
                Global Distribution Footprint
              </h3>
              <p className="text-xs text-[var(--text-variant)] font-light leading-relaxed">
                Multi-currency box office conversion, IMAX screen capacity indices, and overseas
                distribution benchmarks for international co-productions.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] text-xs font-mono text-[#06B6D4] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>International Circuit Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 sm:py-12 px-3 sm:px-6 md:px-12 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
            <span className="font-wordmark text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9A7210] dark:text-[#f2ca50] font-bold">
              STARWIRE INTELLIGENCE
            </span>
            <span className="hidden sm:inline">·</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono uppercase text-[10px] sm:text-[11px]">
            <button
              onClick={handlePrimaryCta}
              className="text-[#9A7210] dark:text-[#f2ca50] hover:underline cursor-pointer"
            >
              Launch Terminal
            </button>
            <span>·</span>
            <button
              onClick={onRequestAccess}
              className="text-[var(--text-variant)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
