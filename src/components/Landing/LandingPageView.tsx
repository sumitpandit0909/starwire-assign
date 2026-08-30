import React, { useState, useEffect } from 'react';
import { TMDBMovie, TMDBPerson, Star, NewsBrief } from '../../types';
import {
  fetchTrendingMovies,
  fetchIndianCinema,
  fetchNowPlaying,
  fetchUpcoming,
  fetchTrendingPeople,
  getTMDBImageUrl,
} from '../../services/tmdbService';

interface LandingPageViewProps {
  onEnterTerminal: () => void;
  onSelectStar: (starId: string) => void;
  onOpenIntelligence: (starName?: string) => void;
  onRequestAccess: () => void;
  stars: Star[];
  news: NewsBrief[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAuthenticated?: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterTerminal,
  onSelectStar,
  onOpenIntelligence,
  onRequestAccess,
  stars,
  news,
  isDarkMode,
  onToggleTheme,
  isAuthenticated = false,
}) => {
  // Real TMDB data states
  const [activeTab, setActiveTab] = useState<'trending' | 'indian' | 'nowPlaying' | 'upcoming' | 'people'>('trending');
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [indianMovies, setIndianMovies] = useState<TMDBMovie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<TMDBMovie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([]);
  const [trendingPeople, setTrendingPeople] = useState<TMDBPerson[]>([]);
  const [isLoadingTMDB, setIsLoadingTMDB] = useState<boolean>(true);
  const [tmdbConnected, setTmdbConnected] = useState<boolean>(true);

  // Selected TMDB Movie Modal preview state
  const [selectedPreviewMovie, setSelectedPreviewMovie] = useState<TMDBMovie | null>(null);

  // Interactive Terminal Preview Tab
  const [terminalPreviewTab, setTerminalPreviewTab] = useState<'dossier' | 'boxOffice' | 'news' | 'ai'>('dossier');

  // Primary CTA action: enter terminal if logged in, otherwise open sign in
  const handlePrimaryCta = () => {
    if (isAuthenticated) {
      onEnterTerminal();
    } else {
      onRequestAccess();
    }
  };

  // Load Real TMDB Data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTMDBData() {
      setIsLoadingTMDB(true);
      try {
        const [trendingRes, indianRes, nowPlayingRes, upcomingRes, peopleRes] = await Promise.allSettled([
          fetchTrendingMovies('week', 1),
          fetchIndianCinema(1, 'popularity.desc', 'hi|ta|te|ml|kn'),
          fetchNowPlaying(1),
          fetchUpcoming(1),
          fetchTrendingPeople(1),
        ]);

        if (isMounted) {
          if (trendingRes.status === 'fulfilled' && trendingRes.value.results?.length > 0) {
            setTrendingMovies(trendingRes.value.results);
            setTmdbConnected(true);
          }
          if (indianRes.status === 'fulfilled' && indianRes.value.results?.length > 0) {
            setIndianMovies(indianRes.value.results);
          }
          if (nowPlayingRes.status === 'fulfilled' && nowPlayingRes.value.results?.length > 0) {
            setNowPlayingMovies(nowPlayingRes.value.results);
          }
          if (upcomingRes.status === 'fulfilled' && upcomingRes.value.results?.length > 0) {
            setUpcomingMovies(upcomingRes.value.results);
          }
          if (peopleRes.status === 'fulfilled' && peopleRes.value.results?.length > 0) {
            setTrendingPeople(peopleRes.value.results);
          }
        }
      } catch (err) {
        console.error('Failed to load TMDB initial data:', err);
      } finally {
        if (isMounted) setIsLoadingTMDB(false);
      }
    }

    loadTMDBData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute active movie/people list based on selected category tab
  const displayedItems = React.useMemo(() => {
    if (activeTab === 'trending') return trendingMovies.slice(0, 8);
    if (activeTab === 'indian') return indianMovies.slice(0, 8);
    if (activeTab === 'nowPlaying') return nowPlayingMovies.slice(0, 8);
    if (activeTab === 'upcoming') return upcomingMovies.slice(0, 8);
    return [];
  }, [activeTab, trendingMovies, indianMovies, nowPlayingMovies, upcomingMovies]);

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#131313] text-[#FAF9F6] selection:bg-[#f2ca50] selection:text-[#131313]">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#131313]/90 backdrop-blur-xl border-b border-[#4d4635]/25 px-4 md:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={handlePrimaryCta}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#b38f2a] flex items-center justify-center text-[#131313] font-bold shadow-lg shadow-[#f2ca50]/20">
              <span className="material-symbols-outlined text-[22px]">star</span>
            </div>
            <div>
              <span className="font-wordmark text-base md:text-lg uppercase tracking-[0.35em] text-[#f2ca50] font-bold">
                STARWIRE
              </span>
              <span className="hidden sm:inline-block font-mono text-[9px] text-[#99907c] tracking-widest uppercase ml-2 px-1.5 py-0.5 rounded bg-[#201f1f] border border-[#4d4635]/30">
                ENTERTAINMENT INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-[#d0c5af]">
            <a href="#tmdb-live-feed" className="hover:text-[#f2ca50] transition-colors">
              TMDB Live Feed
            </a>
            <a href="#talent-index-section" className="hover:text-[#f2ca50] transition-colors">
              StarScore™ Index
            </a>
            <a href="#core-capabilities" className="hover:text-[#f2ca50] transition-colors">
              Platform Features
            </a>
            <a href="#pricing-tiers" className="hover:text-[#f2ca50] transition-colors">
              Executive Tiers
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Live TMDB API Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1b1b] border border-[#10B981]/30 text-[#10B981] text-[11px] font-mono">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
              <span>TMDB LIVE SYNC</span>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-[#d0c5af] hover:text-[#f2ca50] bg-[#1c1b1b] border border-[#4d4635]/30 transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] hover:scale-102 cursor-pointer font-data-label"
            >
              <span>{isAuthenticated ? 'Go to Terminal' : 'Sign In / Register'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-32 px-4 md:px-12 border-b border-[#4d4635]/20">
        
        {/* Cinematic Backdrop Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1c1b1b]/90 border border-[#f2ca50]/40 text-[#f2ca50] text-xs font-mono font-semibold tracking-wider shadow-lg">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>NEXT-GEN ENTERTAINMENT EQUITY &amp; BOX OFFICE ANALYTICS</span>
            <span className="text-[#99907c]">|</span>
            <span className="text-[#FAF9F6]">TMDB REAL-TIME API</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-xl text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#FAF9F6] tracking-tight leading-[1.08] max-w-5xl mx-auto">
            The Executive Terminal for <br />
            <span className="bg-gradient-to-r from-[#ffe088] via-[#f2ca50] to-[#c5a028] bg-clip-text text-transparent">
              Global Cinema &amp; Talent Equity
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-body-lg text-base sm:text-lg md:text-xl text-[#d0c5af] max-w-3xl mx-auto font-light leading-relaxed">
            Harness live TMDB box office telemetry, proprietary StarScore™ talent equity benchmarks, and AI-powered predictive intelligence for producers, distributors, and talent agencies.
          </p>

          {/* CTA Group */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handlePrimaryCta}
              className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#131313] font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(242,202,80,0.35)] hover:scale-102 cursor-pointer font-data-label"
            >
              <span className="material-symbols-outlined text-[20px]">lock_open</span>
              <span>{isAuthenticated ? 'Enter Terminal Dashboard' : 'Sign In to Access Terminal'}</span>
            </button>

            <button
              onClick={onRequestAccess}
              className="flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#1c1b1b] hover:bg-[#252424] border border-[#f2ca50]/40 text-[#FAF9F6] font-semibold text-sm uppercase tracking-wider transition-all hover:border-[#f2ca50] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#f2ca50]">person_add</span>
              <span>Request Access</span>
            </button>
          </div>

          {/* Live Key Stats Counter Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-[#4d4635]/25 text-left">
            <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#4d4635]/20">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">TMDB Live Sync</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#f2ca50] font-bold">1,200,000+</span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5">Real Titles &amp; Stars</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#4d4635]/20">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Tracked Box Office</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#10B981] font-bold">₹4,440+ Cr</span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5">Pan-Indian &amp; Global</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#4d4635]/20">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Telemetry Latency</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#FAF9F6] font-bold">&lt; 380 ms</span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5">Real-Time Endpoint</span>
            </div>

            <div className="p-4 rounded-xl bg-[#1c1b1b]/80 border border-[#4d4635]/20">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">Proprietary Metric</span>
              <span className="font-headline-md text-2xl md:text-3xl text-[#f2ca50] font-bold">StarScore™</span>
              <span className="text-[11px] text-[#d0c5af] block mt-0.5">Talent Equity Model</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TMDB Real-Time Live Feed & Marquee Showcase */}
      <section id="tmdb-live-feed" className="py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">REAL-TIME DATA STREAM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
                TMDB API POWERED
              </span>
            </div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-[#FAF9F6] mt-1.5 font-bold">
              Live Box Office Marquee &amp; Global Film Feeds
            </h2>
            <p className="text-sm text-[#d0c5af] mt-1 max-w-2xl font-light">
              Live metadata, international ratings, audience sentiment percentages, and high-resolution posters streamed directly from TMDB's worldwide database.
            </p>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-[#1c1b1b] p-1.5 rounded-xl border border-[#4d4635]/30">
            {(
              [
                { key: 'trending', label: 'Trending Worldwide' },
                { key: 'indian', label: 'Pan-Indian Cinema' },
                { key: 'nowPlaying', label: 'Now Playing' },
                { key: 'upcoming', label: 'Upcoming' },
                { key: 'people', label: 'Popular Talent' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                    : 'text-[#d0c5af] hover:text-[#FAF9F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State or Items Grid */}
        {isLoadingTMDB ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-10 h-10 border-3 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs text-[#d0c5af]">Connecting to TMDB API Live Gateway...</p>
          </div>
        ) : activeTab === 'people' ? (
          /* Popular Talent from TMDB */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {trendingPeople.slice(0, 12).map((person) => (
              <div
                key={person.id}
                onClick={() => onOpenIntelligence(person.name)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 rounded-2xl overflow-hidden p-3 flex flex-col items-center text-center cursor-pointer transition-all hover:scale-102 group shadow-lg"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-[#f2ca50]/30 group-hover:border-[#f2ca50] transition-colors relative">
                  <img
                    src={getTMDBImageUrl(person.profile_path, 'w185', 'profile')}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-headline-md text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors truncate w-full font-semibold">
                  {person.name}
                </h4>
                <span className="text-[10px] font-mono text-[#99907c] mt-0.5">
                  {person.known_for_department || 'Acting'}
                </span>
                <div className="mt-2 text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                  Pop: {Math.round(person.popularity)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Movies Grid from TMDB */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedItems.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedPreviewMovie(movie)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all hover:scale-102 group shadow-xl"
              >
                {/* Poster Artwork with Score Badge */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#201f1f]">
                  <img
                    src={getTMDBImageUrl(movie.poster_path, 'w500', 'poster')}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#131313]/90 text-[#f2ca50] border border-[#f2ca50]/40 backdrop-blur-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                    </span>

                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/80 text-[#d0c5af] backdrop-blur-sm uppercase">
                      {movie.original_language || 'EN'}
                    </span>
                  </div>

                  {/* Release Date overlay */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-mono text-[#d0c5af] bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'Upcoming'}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1 font-semibold">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-[#d0c5af] mt-1.5 line-clamp-2 font-light leading-relaxed">
                      {movie.overview || 'No synopsis recorded in TMDB registry.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#99907c]">Votes: {movie.vote_count || 0}</span>
                    <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Intel</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Live in Terminal Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#1c1b1b] via-[#242323] to-[#1c1b1b] border border-[#f2ca50]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-headline-md text-xl md:text-2xl text-[#FAF9F6]">
              Explore Complete Real-Time Filmography &amp; Box Office
            </h3>
            <p className="text-xs md:text-sm text-[#d0c5af] font-light">
              Access deep financial breakdowns, ROI multipliers, territorial grosses, and live talent tracking.
            </p>
          </div>

          <button
            onClick={onEnterTerminal}
            className="px-6 py-3.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#131313] font-bold text-xs uppercase tracking-wider font-data-label transition-all shadow-md shrink-0 cursor-pointer"
          >
            Open Full Movies Terminal
          </button>
        </div>
      </section>

      {/* 4. Core Capabilities & Architecture Bento Grid */}
      <section id="core-capabilities" className="py-20 px-4 md:px-12 bg-[#171616] border-y border-[#4d4635]/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">INTELLIGENCE PLATFORM</span>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-[#FAF9F6] font-bold">
              Engineered for Precision Entertainment Decisions
            </h2>
            <p className="text-sm md:text-base text-[#d0c5af] font-light">
              Synthesizing millions of global data points across box office theatrical telemetry, digital engagement, brand affinity, and multi-territorial reach.
            </p>
          </div>

          {/* 4-Pillar Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 transition-all flex flex-col justify-between group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#f2ca50]/15 text-[#f2ca50] flex items-center justify-center border border-[#f2ca50]/30 group-hover:scale-110 transition-transform">
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
                Live Weighted Model →
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 transition-all flex flex-col justify-between group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">public</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest font-bold">PILLAR 02</span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#10B981] transition-colors">
                  Real-Time TMDB Pipeline
                </h3>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Direct connection with TMDB’s international API tracking real-time theatrical releases, full cast registries, and audience vote velocity.
                </p>
              </div>
              <div className="pt-3 border-t border-[#4d4635]/20 text-[11px] font-mono text-[#10B981]">
                Real-Time API Sync →
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 transition-all flex flex-col justify-between group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#b4c5ff]/15 text-[#b4c5ff] flex items-center justify-center border border-[#b4c5ff]/30 group-hover:scale-110 transition-transform">
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
                Generative Analysis →
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 transition-all flex flex-col justify-between group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#e57373]/15 text-[#e57373] flex items-center justify-center border border-[#e57373]/30 group-hover:scale-110 transition-transform">
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
                Multi-Territory Footprint →
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Talent Index & StarScore™ Spotlight */}
      <section id="talent-index-section" className="py-20 px-4 md:px-12 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">TALENT DOSSIERS</span>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-[#FAF9F6] mt-1 font-bold">
              StarScore™ Benchmark Rankings
            </h2>
            <p className="text-sm text-[#d0c5af] mt-1 max-w-2xl font-light">
              Comprehensive talent equity profiles featuring historical career ROI, brand endorsements, and verified social buzz velocities.
            </p>
          </div>

          <button
            onClick={onEnterTerminal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#f2ca50]/40 text-[#f2ca50] hover:bg-[#f2ca50]/10 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <span>Explore All Talent Records</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Talent Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stars.slice(0, 3).map((star, idx) => (
            <div
              key={star.id}
              onClick={() => onSelectStar(star.id)}
              className="p-6 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 transition-all cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#2a2a2a] text-[#FAF9F6]">
                    #{idx + 1} RANKED
                  </span>
                  <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-full border border-[#10B981]/30">
                    +{star.buzzDelta}% MOMENTUM
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={star.avatarImage}
                    alt={star.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors font-bold">
                      {star.name}
                    </h3>
                    <p className="text-xs text-[#99907c] font-mono mt-0.5">
                      {star.industry} · {star.category}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20">
                  <div>
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">StarScore™</span>
                    <span className="text-xl font-bold font-mono text-[#f2ca50]">{star.starScore}</span>
                    <span className="text-[10px] text-[#99907c] font-mono"> / 100</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Global Reach</span>
                    <span className="text-xl font-bold font-mono text-[#FAF9F6]">{star.reach}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono text-[#f2ca50]">
                <span>Open Intelligence Dossier</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Executive Membership & Access Tiers */}
      <section id="pricing-tiers" className="py-20 px-4 md:px-12 bg-[#171616] border-y border-[#4d4635]/20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">MEMBERSHIP TIERS</span>
            <h2 className="font-headline-xl text-3xl md:text-5xl text-[#FAF9F6] font-bold">
              Tailored for Film Studios, Producers &amp; Agencies
            </h2>
            <p className="text-sm md:text-base text-[#d0c5af] font-light">
              Secure dedicated API quotas, custom talent equity indices, and AI forecasting models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Tier 1 */}
            <div className="p-8 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#99907c] uppercase tracking-widest font-bold">INDIVIDUAL / CREATOR</span>
                <h3 className="font-headline-md text-2xl text-[#FAF9F6]">Analyst Suite</h3>
                <div className="text-3xl font-mono font-bold text-[#FAF9F6]">
                  ₹4,999 <span className="text-xs font-normal text-[#99907c]">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#d0c5af] pt-4 border-t border-[#4d4635]/20">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Live TMDB Box Office Feed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>50+ Pan-Indian Talent Dossiers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>50 AI Starwire Queries/month</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onRequestAccess}
                className="w-full py-3 rounded-xl border border-[#4d4635]/40 hover:border-[#f2ca50] text-[#FAF9F6] font-bold text-xs uppercase tracking-wider transition-all"
              >
                Request Analyst Access
              </button>
            </div>

            {/* Tier 2 (Highlighted) */}
            <div className="p-8 rounded-2xl bg-[#201f1f] border-2 border-[#f2ca50] relative flex flex-col justify-between space-y-6 shadow-2xl shadow-[#f2ca50]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f2ca50] text-[#131313] text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                MOST POPULAR FOR STUDIOS
              </div>
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#f2ca50] uppercase tracking-widest font-bold">PRODUCERS &amp; DISTRIBUTORS</span>
                <h3 className="font-headline-md text-2xl text-[#FAF9F6]">Executive Studio</h3>
                <div className="text-3xl font-mono font-bold text-[#f2ca50]">
                  ₹18,500 <span className="text-xs font-normal text-[#d0c5af]">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#FAF9F6] pt-4 border-t border-[#4d4635]/30">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Unlimited TMDB Telemetry &amp; Pre-Sales</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Custom StarScore™ Modeling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Gemini AI High-Frequency Forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Territory Footprint Heatmaps</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onRequestAccess}
                className="w-full py-3.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#131313] font-bold text-xs uppercase tracking-wider font-data-label transition-all shadow-md"
              >
                Get Executive Pass
              </button>
            </div>

            {/* Tier 3 */}
            <div className="p-8 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#99907c] uppercase tracking-widest font-bold">ENTERPRISE / AGENCIES</span>
                <h3 className="font-headline-md text-2xl text-[#FAF9F6]">Studio Enterprise</h3>
                <div className="text-3xl font-mono font-bold text-[#FAF9F6]">Custom Quote</div>
                <ul className="space-y-2.5 text-xs text-[#d0c5af] pt-4 border-t border-[#4d4635]/20">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Dedicated Private API Ingress</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>Custom Talent Valuation Audits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#10B981]">check_circle</span>
                    <span>24/7 Dedicated Industry Concierge</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onRequestAccess}
                className="w-full py-3 rounded-xl border border-[#4d4635]/40 hover:border-[#f2ca50] text-[#FAF9F6] font-bold text-xs uppercase tracking-wider transition-all"
              >
                Contact Enterprise Desk
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Footer & TMDB Attribution */}
      <footer className="py-12 px-4 md:px-12 border-t border-[#4d4635]/20 text-xs text-[#99907c]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <span className="font-wordmark text-sm uppercase tracking-[0.3em] text-[#f2ca50] font-bold">
              STARWIRE INTELLIGENCE
            </span>
            <span>·</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          {/* TMDB Official Attribution */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="px-2 py-1 bg-[#0d253f] text-[#01b4e4] rounded font-bold font-mono text-[10px]">
              TMDB
            </div>
            <p className="text-[11px] max-w-md">
              This product uses the TMDB API but is not endorsed or certified by TMDB. Real-time movie metadata and imagery provided by The Movie Database.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onEnterTerminal} className="text-[#f2ca50] hover:underline font-mono uppercase">
              Launch Terminal
            </button>
            <span>·</span>
            <button onClick={onRequestAccess} className="text-[#d0c5af] hover:text-[#FAF9F6] font-mono uppercase">
              Request Access
            </button>
          </div>
        </div>
      </footer>

      {/* TMDB Movie Quick Detail Modal */}
      {selectedPreviewMovie && (
        <div
          id="tmdb-movie-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedPreviewMovie(null)}
        >
          <div
            id="tmdb-movie-modal-content"
            className="bg-[#1c1b1b] border border-[#f2ca50]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPreviewMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:text-[#f2ca50] transition-colors"
              aria-label="Close Preview"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={getTMDBImageUrl(selectedPreviewMovie.poster_path, 'w500', 'poster')}
                alt={selectedPreviewMovie.title}
                className="w-36 h-52 sm:w-48 sm:h-72 rounded-xl object-cover border border-[#f2ca50]/30 shadow-lg shrink-0 self-center sm:self-start"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#f2ca50] text-[#131313]">
                    ★ {selectedPreviewMovie.vote_average ? selectedPreviewMovie.vote_average.toFixed(1) : 'NR'} / 10
                  </span>
                  <span className="text-xs font-mono text-[#d0c5af]">
                    ({selectedPreviewMovie.vote_count} TMDB Votes)
                  </span>
                </div>

                <h3 className="font-headline-md text-2xl md:text-3xl text-[#FAF9F6] leading-tight font-bold">
                  {selectedPreviewMovie.title}
                </h3>

                {selectedPreviewMovie.original_title !== selectedPreviewMovie.title && (
                  <p className="text-xs text-[#99907c] font-mono">
                    Original Title: {selectedPreviewMovie.original_title}
                  </p>
                )}

                <div className="text-xs font-mono text-[#d0c5af]">
                  Release: <strong>{selectedPreviewMovie.release_date || 'TBA'}</strong> · Language: <strong>{selectedPreviewMovie.original_language?.toUpperCase()}</strong>
                </div>

                <p className="text-xs md:text-sm text-[#d0c5af] font-light leading-relaxed pt-2 border-t border-[#4d4635]/25">
                  {selectedPreviewMovie.overview || 'No synopsis provided.'}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setSelectedPreviewMovie(null);
                      onOpenIntelligence(selectedPreviewMovie.title);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>Run AI Box Office Intel</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPreviewMovie(null);
                      onEnterTerminal();
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#4d4635]/40 hover:border-[#f2ca50] text-[#FAF9F6] text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Open in Terminal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
