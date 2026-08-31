import React, { useState, useMemo } from 'react';
import { Star, UserStats, NewsBrief, RegionalPerformance, PlatformBuzz, TMDBMovie } from '../../types';
import { getTMDBImageUrl } from '../../services/tmdbService';
import { useMovies } from '../../hooks/useMovies';

interface DashboardViewProps {
  user: UserStats;
  stars: Star[];
  news: NewsBrief[];
  regionalStats: RegionalPerformance[];
  platformBuzz: PlatformBuzz[];
  onSelectStar: (starId: string) => void;
  onSelectNews: (newsId: string) => void;
  onExploreStars: () => void;
  onViewTrending: () => void;
  onViewAllMovies: () => void;
  onViewAllNews: () => void;
  onOpenFollowing: () => void;
  onOpenWatchlist: () => void;
  onOpenIntelligence: (starName?: string) => void;
  onToggleFollow: (starId: string) => void;
  followingIds: string[];
  watchlistCount: number;
}

// Shimmer Skeleton Loader Component
const SkeletonCard: React.FC<{ type: 'movie' | 'star' | 'news' }> = ({ type }) => {
  if (type === 'movie') {
    return (
      <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-72">
        <div className="bg-[#2a2a2a] h-44 w-full" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
          <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
        </div>
      </div>
    );
  }
  if (type === 'star') {
    return (
      <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl p-6 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a]" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-[#2a2a2a] rounded w-2/3" />
            <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
          </div>
        </div>
        <div className="h-12 bg-[#201f1f] rounded-xl" />
      </div>
    );
  }
  return (
    <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-64">
      <div className="bg-[#2a2a2a] h-32 w-full" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#2a2a2a] rounded w-5/6" />
        <div className="h-3 bg-[#2a2a2a] rounded w-2/3" />
      </div>
    </div>
  );
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  stars,
  news,
  regionalStats,
  platformBuzz,
  onSelectStar,
  onSelectNews,
  onExploreStars,
  onViewTrending,
  onViewAllMovies,
  onViewAllNews,
  onOpenFollowing,
  onOpenWatchlist,
  onOpenIntelligence,
  onToggleFollow,
  followingIds,
  watchlistCount,
}) => {
  // Category filters
  const [starCategoryFilter, setStarCategoryFilter] = useState<'ALL' | 'Pan India' | 'Bollywood' | 'RISING'>('ALL');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<string>('ALL');
  const [activePlatformFilter, setActivePlatformFilter] = useState<'Global' | 'Domestic' | 'Overseas'>('Global');
  const [buzzTimeframe, setBuzzTimeframe] = useState<'24H' | '7D' | '30D' | 'YTD'>('7D');

  // Live TMDB Movies Hook
  const [tmdbCategory, setTmdbCategory] = useState<'popular' | 'top_rated' | 'upcoming'>('popular');
  const { movies: fetchedTmdbMovies, people: fetchedTmdbPeople, loading: loadingTmdb } = useMovies(tmdbCategory);
  const [selectedTmdbMovie, setSelectedTmdbMovie] = useState<TMDBMovie | null>(null);

  // TMDB Movies restricted strictly to TOP 3
  const tmdbMovies = useMemo(() => fetchedTmdbMovies.slice(0, 3), [fetchedTmdbMovies]);
  const tmdbPeople = useMemo(() => fetchedTmdbPeople.slice(0, 6), [fetchedTmdbPeople]);

  // Robust Star Filtering guaranteed to match exact categories with non-empty fallback
  const filteredTrendingStars = useMemo(() => {
    if (!stars || stars.length === 0) return [];
    let list = [...stars];

    if (starCategoryFilter === 'ALL') {
      const globalStars = list.filter((s) => s.category === 'Global' || s.industry === 'Hollywood');
      if (globalStars.length > 0) list = globalStars;
    } else if (starCategoryFilter === 'Pan India') {
      const panIndia = list.filter((s) => s.category === 'Pan India' || ['Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Pan-Indian'].includes(s.industry));
      if (panIndia.length > 0) list = panIndia;
    } else if (starCategoryFilter === 'Bollywood') {
      const bollywood = list.filter((s) => s.category === 'Bollywood' || s.industry === 'Hindi');
      if (bollywood.length > 0) list = bollywood;
    } else if (starCategoryFilter === 'RISING') {
      const rising = list.filter((s) => s.buzzDelta >= 3).sort((a, b) => b.buzzDelta - a.buzzDelta);
      if (rising.length > 0) list = rising;
    }

    const res = list.sort((a, b) => b.starScore - a.starScore).slice(0, 3);
    return res.length > 0 ? res : stars.slice(0, 3);
  }, [stars, starCategoryFilter]);

  // Filtered news restricted strictly to TOP 3 with non-empty fallback
  const filteredNews = useMemo(() => {
    if (!news || news.length === 0) return [];
    let list = news.filter((item) => item.category !== 'TECH & AI');
    if (newsCategoryFilter !== 'ALL') {
      const filtered = list.filter((item) => item.category === newsCategoryFilter);
      if (filtered.length > 0) list = filtered;
    }
    const res = list.slice(0, 3);
    return res.length > 0 ? res : news.slice(0, 3);
  }, [news, newsCategoryFilter]);

  // Industry Aggregate Buzz score
  const averageBuzzScore = useMemo(() => {
    if (!stars || stars.length === 0) return 86;
    const sum = stars.reduce((acc, s) => acc + (s.buzzMeter || 80), 0);
    return Math.round(sum / stars.length);
  }, [stars]);

  return (
    <div id="dashboard-view-container" className="flex flex-col gap-10 md:gap-14 animate-fade-in pb-12">

      {/* 1. TOP-POSITIONED Breaking Wire Slow Marquee Ticker */}
      <div
        id="breaking-news-ticker"
        className="w-full bg-[#1c1b1b] border border-[#f2ca50]/25 rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden shadow-sm hover:border-[#f2ca50]/50 transition-all z-20"
      >
        {/* Left Badge */}
        <div className="flex items-center gap-2 bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider shrink-0 uppercase">
          <span className="h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
          <span>BREAKING WIRE</span>
        </div>

        {/* Center Continuous Slow Marquee Loop (85s) */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee flex items-center gap-16 whitespace-nowrap cursor-pointer">
            {(news.length > 0 ? [...news, ...news] : [
              { id: '1', category: 'BOX OFFICE', title: 'Shah Rukh Khan starrer King enters principal production with global pre-sales surge.', timestamp: 'Live' },
              { id: '2', category: 'PRODUCTION', title: 'Prabhas Spirit & Kalki 2 production budget benchmarks confirmed by producers.', timestamp: 'Live' },
              { id: '3', category: 'CASTING', title: 'Thalapathy Vijay completes final schedule for cinematic release.', timestamp: 'Live' },
            ]).map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectNews(item.id)}
                className="text-xs md:text-sm text-[#e5e2e1] hover:text-[#f2ca50] transition-colors inline-flex items-center gap-2"
              >
                <span className="text-[#f2ca50] font-bold font-mono">[{item.category}]</span>
                <span className="font-medium">{item.title}</span>
                <span className="text-[11px] font-mono text-[#99907c]">· {item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Aligned Watchlist Icon */}
        {/* <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-[#4d4635]/30">
          <button
            onClick={onOpenWatchlist}
            className="text-[#f2ca50] hover:text-[#ffe088] p-1.5 rounded-lg hover:bg-[#201f1f] transition-colors cursor-pointer"
            title="Open Watchlist"
            aria-label="Bookmark Watchlist"
          >
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </button>
        </div> */}
      </div>

      {/* 2. Hero Section & Command Panels */}
      <section
        id="dashboard-hero-section"
        className="relative w-full rounded-2xl overflow-hidden bg-[#1c1b1b] border border-[#f2ca50]/20 min-h-[300px] sm:min-h-[340px] md:min-h-[380px] flex flex-col justify-between shadow-2xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-100 hover:scale-102 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCh_JKurjhZM8yZUnaGeoWyh2B-SCWPXwXdVLYtRonFK3fAuvEsdc1BXkzlAeXxfGHO4tjFSSoMzfCiHxfeA9bFP1vdR5YaSs0H6y3ceWDg8X7RFYhwJWopD6vCCMRSNYcWwIPLmaJyvJ1M8Fe0-6o7gEmV5S0_sfcjKL4MdI1o2kzLIXxAe3R72YTuYWe0JtviJ7QIoxuguTS_lMkdn9sfw-kI_cnPdoaV0k4IVYMV8xj9VKO7MOErCw')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/90 to-[#131313]/40" />

        {/* Top Floating Badge */}
        <div className="relative pt-4 px-4 sm:pt-6 sm:px-6 md:pt-8 md:px-8 z-10 flex flex-wrap items-center gap-2">
          <span className="font-wordmark text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#f2ca50] bg-[#131313]/80 px-2.5 py-1 rounded-md border border-[#f2ca50]/30 backdrop-blur-sm">
            ENTERTAINMENT INTELLIGENCE · STARWIRE
          </span>
          <div className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          <span className="hidden sm:inline-block font-data-label text-[8px] sm:text-[9px] text-[#d0c5af] uppercase tracking-widest bg-[#131313]/60 px-2 py-0.5 rounded">
            REAL-TIME ANALYTICS
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative p-4 sm:p-5 md:p-8 z-10 max-w-4xl pt-2 sm:pt-4">
          <h1
            id="hero-greeting-heading"
            className="font-headline-xl text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#FAF9F6] mb-1.5 leading-tight tracking-tight break-words font-bold"
          >
            Good Evening, {user.userName.split(' ')[0]}.
          </h1>
          <p className="font-body-lg text-[11px] sm:text-xs md:text-sm text-[#d0c5af] mb-3 sm:mb-4 max-w-xl font-light leading-relaxed">
            Live box office momentum, StarScore™ talent equity benchmarks, and industry alerts.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            <div
              id="stat-box-following"
              onClick={onOpenFollowing}
              className="glass-panel border border-[#4d4635]/30 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-0.5 min-w-[95px] sm:min-w-[110px] hover:border-[#f2ca50]/50 transition-all cursor-pointer group"
            >
              <span className="font-data-label text-[9px] sm:text-[10px] text-[#d0c5af] uppercase tracking-wider group-hover:text-[#f2ca50] transition-colors">
                Tracked Stars
              </span>
              <span className="font-headline-md text-lg sm:text-xl text-[#f2ca50] font-bold">
                {followingIds.length}
              </span>
            </div>

            <div
              id="stat-box-watchlist"
              onClick={onOpenWatchlist}
              className="glass-panel border border-[#4d4635]/30 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-0.5 min-w-[95px] sm:min-w-[110px] hover:border-[#f2ca50]/50 transition-all cursor-pointer group"
            >
              <span className="font-data-label text-[9px] sm:text-[10px] text-[#d0c5af] uppercase tracking-wider group-hover:text-[#f2ca50] transition-colors">
                Saved Intel
              </span>
              <span className="font-headline-md text-lg sm:text-xl text-[#f2ca50] font-bold">
                {watchlistCount}
              </span>
            </div>

            <div
              id="stat-box-updates"
              onClick={onViewAllNews}
              className="glass-panel border border-[#4d4635]/30 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-0.5 min-w-[95px] sm:min-w-[110px] hover:border-[#f2ca50]/50 transition-all cursor-pointer group"
            >
              <span className="font-data-label text-[9px] sm:text-[10px] text-[#d0c5af] uppercase tracking-wider group-hover:text-[#f2ca50] transition-colors">
                Live Briefs
              </span>
              <span className="font-headline-md text-lg sm:text-xl text-[#f2ca50] font-bold">
                {news.length}
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5 ml-auto">
              <button
                id="hero-ai-intelligence-btn"
                onClick={() => onOpenIntelligence()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] hover:scale-102 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>AI Starwire Intelligence</span>
              </button>

              <button
                onClick={onExploreStars}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#d4af37]/40 text-[#f2ca50] hover:bg-[#d4af37]/10 font-data-label text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Talent Index</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. StarScore™ & BuzzMeter™ Command Indicators */}
      <section id="starscore-buzzmeter-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-wordmark text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">PROPRIETARY METRICS</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
                ALGORITHMIC ENGINE
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] mt-1">
              StarScore™ &amp; BuzzMeter™ Command Indicators
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1c1b1b] p-1 rounded-xl border border-[#4d4635]/30">
            {(['24H', '7D', '30D', 'YTD'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setBuzzTimeframe(period)}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all cursor-pointer ${buzzTimeframe === period
                  ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-sm'
                  : 'text-[#d0c5af] hover:text-[#FAF9F6]'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Indicator Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Aggregate Industry BuzzMeter Gauge */}
          <div
            id="buzzmeter-radial-card"
            className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl p-6 flex flex-col justify-between transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">
                  Aggregate Velocity
                </span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] mt-0.5">
                  Industry BuzzMeter™
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded font-bold">
                APEX VELOCITY
              </span>
            </div>

            {/* Circular SVG Gauge Visual */}
            <div className="flex items-center justify-center my-4 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="#2a2a2a"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="#f2ca50"
                  strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - averageBuzzScore / 100)}`}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] font-bold">
                  {averageBuzzScore}
                </span>
                <span className="text-[10px] font-mono text-[#f2ca50] font-bold tracking-wider">
                  / 100 INDEX
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#4d4635]/25 grid grid-cols-3 text-center gap-2">
              <div>
                <span className="text-[9px] font-mono text-[#99907c] uppercase block">Positive Polarity</span>
                <span className="text-xs font-mono font-bold text-[#10B981]">84.2%</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#99907c] uppercase block">Surge Delta</span>
                <span className="text-xs font-mono font-bold text-[#f2ca50]">+18.4%</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-[#99907c] uppercase block">Peak Volume</span>
                <span className="text-xs font-mono font-bold text-[#FAF9F6]">4.2M/hr</span>
              </div>
            </div>
          </div>

          {/* Card 2: StarScore™ Apex Power Leaderboard */}
          <div
            id="starscore-leaderboard-card"
            className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl p-6 flex flex-col justify-between transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">
                  Talent Equity Score
                </span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] mt-0.5">
                  StarScore™ Top Rankings
                </h3>
              </div>
              <button
                onClick={onViewTrending}
                className="text-[11px] font-mono text-[#f2ca50] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Compare</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

            {/* Micro Rankings List */}
            <div className="space-y-3 my-1">
              {stars.slice(0, 3).map((star, idx) => (
                <div
                  key={star.id}
                  onClick={() => onSelectStar(star.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#4d4635]/20 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#99907c] w-4">
                      #{idx + 1}
                    </span>
                    <img
                      src={star.avatarImage}
                      alt={star.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#f2ca50]/30"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors truncate max-w-[110px]">
                        {star.name}
                      </div>
                      <div className="text-[10px] text-[#99907c] font-mono">{star.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm text-[#f2ca50]">
                        {star.starScore}
                      </div>
                      <div className="text-[10px] font-mono text-[#10B981]">
                        +{star.buzzDelta}%
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-[#99907c] group-hover:text-[#f2ca50] group-hover:translate-x-0.5 transition-all">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-[11px] font-mono text-[#d0c5af]">
              <span>Index Ceiling: <strong>100.0 MAX</strong></span>
              <span className="text-[#10B981]">Confidence: 99.4%</span>
            </div>
          </div>

          {/* Card 3: Multi-Platform Engagement Matrix */}
          <div
            id="multi-platform-engagement-card"
            className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl p-6 flex flex-col justify-between transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-widest block font-bold">
                  Cross-Channel Heatmap
                </span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6] mt-0.5">
                  Platform Reach Share
                </h3>
              </div>

              <div className="flex items-center gap-1 bg-[#201f1f] p-0.5 rounded-lg border border-[#4d4635]/30 text-[10px] font-mono">
                {(['Global', 'Domestic', 'Overseas'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActivePlatformFilter(m)}
                    className={`px-2 py-0.5 rounded transition-all cursor-pointer ${activePlatformFilter === m
                      ? 'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/30 font-bold'
                      : 'text-[#99907c] hover:text-[#FAF9F6]'
                      }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Progress Bars */}
            <div className="space-y-3 my-2">
              {platformBuzz.map((item) => (
                <div key={item.platform} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#FAF9F6] font-medium">{item.platform}</span>
                    <span className="text-[#f2ca50] font-bold">{item.percentage}% ({item.sentiment})</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.shortName === 'Insta'
                        ? 'bg-[#10B981]'
                        : item.shortName === 'X'
                          ? 'bg-[#f2ca50]'
                          : 'bg-[#b4c5ff]'
                        }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-[11px] font-mono text-[#99907c]">
              <span>Data Synced: <strong>Real-Time API</strong></span>
              <span className="text-[#10B981] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Live Stream
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trending Stars Spotlight Section (Restricted to TOP 3 Stars - Guaranteed Data Return) */}
      <section id="trending-stars-spotlight-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-wordmark text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">TALENT MOMENTUM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-bold uppercase">
                TOP 3 RANKED
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] mt-1">
              Trending Stars &amp; Talent Index
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'ALL', label: 'All Top Talent (Global)' },
                { key: 'Pan India', label: 'Pan India' },
                { key: 'Bollywood', label: 'Bollywood' },
                { key: 'RISING', label: 'Top Gainers' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStarCategoryFilter(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider rounded-xl transition-all cursor-pointer ${starCategoryFilter === tab.key
                  ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                  : 'bg-[#1c1b1b] text-[#d0c5af] border border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={onExploreStars}
              className="px-3.5 py-1.5 text-xs font-mono text-[#f2ca50] hover:bg-[#f2ca50]/10 border border-[#f2ca50]/30 rounded-xl transition-all ml-auto flex items-center gap-1 cursor-pointer"
            >
              <span>View All 50+</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Trending Stars Grid (Renders Top 3 Stars Only with Fallback Guard) */}
        {filteredTrendingStars.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard type="star" />
            <SkeletonCard type="star" />
            <SkeletonCard type="star" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTrendingStars.map((star, index) => {
              const isFollowing = followingIds.includes(star.id);
              return (
                <div
                  key={star.id}
                  id={`trending-star-card-${star.id}`}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 rounded-2xl p-6 flex flex-col justify-between transition-all star-card group relative overflow-hidden"
                >
                  {/* Top Rank & Verification Badges */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#2a2a2a] text-[#FAF9F6] border border-[#4d4635]/30">
                          #{index + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-bold uppercase">
                          {star.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        <span>+{star.buzzDelta}%</span>
                      </div>
                    </div>

                    {/* Star Avatar and Identity */}
                    <div
                      onClick={() => onSelectStar(star.id)}
                      className="flex items-center gap-4 cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={star.avatarImage}
                          alt={star.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors shadow-lg"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        {star.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-[#131313] rounded-full p-0.5">
                            <span className="material-symbols-outlined text-[16px] text-[#f2ca50] fill-current">
                              verified
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-tight">
                          {star.name}
                        </h3>
                        <p className="text-xs text-[#99907c] font-mono mt-0.5">
                          {star.industry} Industry · {star.roles.join(' / ')}
                        </p>
                      </div>
                    </div>

                    {/* Key Metrics Chips */}
                    <div className="mt-5 grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20">
                      <div>
                        <span className="text-[10px] font-mono text-[#99907c] uppercase block">StarScore™</span>
                        <span className="text-lg font-mono font-bold text-[#f2ca50]">{star.starScore}</span>
                        <span className="text-[10px] text-[#99907c] font-mono"> /100</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#99907c] uppercase block">Audience Reach</span>
                        <span className="text-lg font-mono font-bold text-[#FAF9F6]">{star.reach}</span>
                        <span className="text-[10px] text-[#10B981] font-mono"> global</span>
                      </div>
                    </div>

                    {/* Active Signals Tag */}
                    <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#d0c5af]">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        {star.activeSignals.audienceSentiment}
                      </span>
                      <span className="text-[11px] text-[#99907c]">Debut: {star.debutYear}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-[#4d4635]/25 flex items-center gap-2">
                    <button
                      onClick={() => onSelectStar(star.id)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-bold font-data-label text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View Dossier</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={() => onOpenIntelligence(star.name)}
                      className="p-2.5 rounded-xl border border-[#4d4635]/40 hover:border-[#f2ca50] text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#f2ca50]/10 transition-all cursor-pointer"
                      title={`AI Analysis for ${star.name}`}
                      aria-label={`AI Analysis for ${star.name}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </button>

                    <button
                      onClick={() => onToggleFollow(star.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${isFollowing
                        ? 'border-[#f2ca50] bg-[#f2ca50]/15 text-[#f2ca50]'
                        : 'border-[#4d4635]/40 text-[#99907c] hover:text-[#FAF9F6] hover:border-[#f2ca50]/40'
                        }`}
                      title={isFollowing ? 'Tracking Star' : 'Follow Star'}
                      aria-label={isFollowing ? 'Tracking Star' : 'Follow Star'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isFollowing ? 'bookmark_added' : 'bookmark_add'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Live TMDB Theatrical Releases (Restricted strictly to TOP 3 Movies) */}
      <section id="tmdb-live-theatrical-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-wordmark text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">LIVE TMDB STREAM</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold uppercase flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                TOP 3 TITLES
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] mt-1">
              Live Theatrical Releases &amp; Box Office
            </h2>
          </div>

          {/* TMDB Stream Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { key: 'popular', label: 'Popular' },
                { key: 'top_rated', label: 'Top Rated' },
                { key: 'upcoming', label: 'Upcoming' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTmdbCategory(tab.key)}
                className={`px-3.5 py-1.5 text-xs font-mono tracking-wider rounded-xl transition-all cursor-pointer ${tmdbCategory === tab.key
                  ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                  : 'bg-[#1c1b1b] text-[#d0c5af] border border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={onViewAllMovies}
              className="px-3.5 py-1.5 text-xs font-mono text-[#f2ca50] hover:bg-[#f2ca50]/10 border border-[#f2ca50]/30 rounded-xl transition-all ml-auto flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All TMDB</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Skeleton Loading State or Top 3 Movies Grid */}
        {loadingTmdb ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard type="movie" />
            <SkeletonCard type="movie" />
            <SkeletonCard type="movie" />
          </div>
        ) : tmdbMovies.length === 0 ? (
          <div className="p-8 text-center bg-[#1c1b1b] rounded-2xl border border-[#4d4635]/30 text-[#d0c5af] font-mono text-sm">
            Connecting to TMDB API stream... Please check your network connection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tmdbMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => setSelectedTmdbMovie(movie)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all star-card group cursor-pointer shadow-lg"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#201f1f]">
                  <img
                    src={getTMDBImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                  {/* Rating Tag */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded-md text-xs font-mono font-bold backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[13px] text-[#f2ca50] fill-current">star</span>
                    <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>

                  {/* Language */}
                  <div className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#FAF9F6] uppercase backdrop-blur-xs font-bold">
                    {movie.original_language}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-tight line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-[#99907c] font-light mt-1 line-clamp-2 leading-snug">
                      {movie.overview || 'Live TMDB theatrical profile and commercial tracker.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#4d4635]/25 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#99907c]">Release: {movie.release_date || 'N/A'}</span>
                    <span className="text-[#f2ca50] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      <span>Details</span>
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5b. TMDB Popular Talent Radar */}
      {tmdbPeople.length > 0 && (
        <section className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 hover:border-[#f2ca50]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-wordmark text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">TMDB RADAR</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f2ca50]/15 text-[#f2ca50] border border-[#f2ca50]/30 font-bold uppercase">
                  LIVE API
                </span>
              </div>
              <h3 className="font-headline-md text-xl text-[#FAF9F6] mt-0.5">
                Global &amp; Regional Trending Actors
              </h3>
            </div>
            <button
              onClick={onExploreStars}
              className="text-xs font-mono text-[#f2ca50] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All TMDB Stars</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tmdbPeople.map((person) => (
              <div
                key={person.id}
                onClick={onExploreStars}
                className="p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 hover:border-[#f2ca50]/60 transition-all cursor-pointer group flex flex-col items-center text-center"
              >
                <img
                  src={getTMDBImageUrl(person.profile_path, 'w185')}
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#f2ca50]/30 group-hover:border-[#f2ca50] transition-colors mb-2"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
                <div className="font-semibold text-xs text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-1">
                  {person.name}
                </div>
                <div className="text-[10px] font-mono text-[#10B981] mt-0.5">
                  ★ {person.popularity?.toFixed(0)} Pop.
                </div>
                <div className="text-[9px] text-[#99907c] font-mono mt-0.5 line-clamp-1">
                  {person.known_for?.map((k) => k.title || k.name).join(', ') || person.known_for_department}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Latest Entertainment Updates & Analysis (Restricted strictly to TOP 3 News Cards) */}
      <section id="entertainment-updates-section" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-wordmark text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase">INDUSTRY DISPATCHES</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#b4c5ff]/15 text-[#b4c5ff] border border-[#b4c5ff]/30 font-bold uppercase">
                TOP 3 BRIEFS
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] mt-1">
              Latest Entertainment Updates &amp; Analysis
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'BOX OFFICE', 'PRODUCTION', 'CASTING', 'STREAMING'].map((cat) => (
              <button
                key={cat}
                onClick={() => setNewsCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wider rounded-xl transition-all cursor-pointer ${newsCategoryFilter === cat
                  ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                  : 'bg-[#1c1b1b] text-[#d0c5af] border border-[#4d4635]/30 hover:border-[#f2ca50]/40'
                  }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={onViewAllNews}
              className="px-3.5 py-1.5 text-xs font-mono text-[#f2ca50] hover:bg-[#f2ca50]/10 border border-[#f2ca50]/30 rounded-xl transition-all ml-auto flex items-center gap-1 cursor-pointer"
            >
              <span>Full Intel Wire</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* News Grid (Strictly Top 3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              id={`news-wire-card-${item.id}`}
              onClick={() => onSelectNews(item.id)}
              className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all star-card group cursor-pointer"
            >
              {/* News Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-[#201f1f]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className="font-data-label text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-[#131313]/90 backdrop-blur-sm border border-white/10"
                    style={{ color: item.categoryColor }}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#d0c5af] backdrop-blur-xs">
                  {item.readTime}
                </div>
              </div>

              {/* News Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-[#99907c] mb-1.5">
                    {item.timestamp}
                  </div>
                  <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#d0c5af] font-light mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Footer Impact */}
                <div className="mt-5 pt-4 border-t border-[#4d4635]/25 flex items-center justify-between">
                  {item.impactScore ? (
                    <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                      {item.impactScore}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#99907c]">Executive Brief</span>
                  )}

                  <span className="text-xs font-mono text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Analysis</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Regional Market Breakdown */}
      <section
        id="regional-performance-section"
        className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 md:p-8 hover:border-[#f2ca50]/40 transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-headline-md text-xl text-[#FAF9F6]">
              Territory Box Office Footprint
            </h3>
            <p className="text-xs text-[#99907c] font-mono mt-0.5">
              Regional theatrical contribution and multilingual gross distribution
            </p>
          </div>
          <span className="text-xs font-mono text-[#f2ca50] bg-[#f2ca50]/15 px-3 py-1 rounded-lg border border-[#f2ca50]/30 self-start sm:self-auto">
            ₹4,440 Cr Cumulative Tracked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regionalStats.map((reg) => (
            <div key={reg.region} className="p-4 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-data-value text-[#FAF9F6] font-semibold">{reg.region} Territory</span>
                <span className="font-mono text-[#f2ca50] font-bold">{reg.volume}</span>
              </div>
              <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${reg.region === 'South'
                    ? 'bg-[#10B981]'
                    : reg.region === 'North'
                      ? 'bg-[#f2ca50]'
                      : 'bg-[#b4c5ff]'
                    }`}
                  style={{ width: `${reg.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#99907c]">
                <span>Market Share</span>
                <span className="text-[#FAF9F6] font-bold">{reg.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TMDB Live Movie Modal */}
      {selectedTmdbMovie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedTmdbMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={getTMDBImageUrl(selectedTmdbMovie.poster_path, 'w500')}
                alt={selectedTmdbMovie.title}
                className="w-full sm:w-48 aspect-[2/3] object-cover rounded-xl border border-[#4d4635]/30 shadow-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 font-bold">
                    TMDB LIVE RELEASE
                  </span>
                  <span className="text-xs font-mono text-[#99907c]">
                    ID #{selectedTmdbMovie.id}
                  </span>
                </div>

                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6]">
                  {selectedTmdbMovie.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1 text-[#f2ca50]">
                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                    <strong className="text-sm">{selectedTmdbMovie.vote_average?.toFixed(1)}/10</strong>
                    <span className="text-[#99907c]">({selectedTmdbMovie.vote_count} votes)</span>
                  </div>
                  <div className="text-[#d0c5af]">
                    Release: <strong>{selectedTmdbMovie.release_date || 'TBD'}</strong>
                  </div>
                  <div className="text-[#10B981]">
                    Language: <strong className="uppercase">{selectedTmdbMovie.original_language}</strong>
                  </div>
                </div>

                <p className="text-sm text-[#d0c5af] font-light leading-relaxed pt-2">
                  {selectedTmdbMovie.overview || 'No extended synopsis available from TMDB repository.'}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const movieName = selectedTmdbMovie.title;
                      setSelectedTmdbMovie(null);
                      onOpenIntelligence(movieName);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>AI Box Office Projection</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTmdbMovie(null);
                      onViewAllMovies();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2a2a2a] text-[#FAF9F6] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#3a3a3a] transition-all cursor-pointer"
                  >
                    <span>Open in Box Office Tracker</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
