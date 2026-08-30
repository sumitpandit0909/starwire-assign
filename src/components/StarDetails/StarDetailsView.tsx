import React, { useState, useEffect } from 'react';
import { Star, TMDBPerson } from '../../types';
import {
  getTMDBImageUrl,
  fetchPersonDetails,
  searchTMDB,
} from '../../services/tmdbService';

interface StarDetailsViewProps {
  star: Star;
  allStars: Star[];
  onSelectStar: (starId: string) => void;
  onBackToExplore: () => void;
  isFollowing: boolean;
  onToggleFollow: (starId: string) => void;
  onOpenIntelligence: (starName?: string) => void;
}

export const StarDetailsView: React.FC<StarDetailsViewProps> = ({
  star,
  allStars,
  onSelectStar,
  onBackToExplore,
  isFollowing,
  onToggleFollow,
  onOpenIntelligence,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');
  const [activeTab, setActiveTab] = useState<'dossier' | 'filmography' | 'tmdb_credits'>('dossier');
  const [tmdbPerson, setTmdbPerson] = useState<TMDBPerson | null>(null);
  const [loadingTmdb, setLoadingTmdb] = useState<boolean>(false);

  // Fetch real-time TMDB details via /api/tmdb/person/:id
  useEffect(() => {
    let isMounted = true;
    async function loadTMDBInfo() {
      setLoadingTmdb(true);
      try {
        const targetId = star.tmdbId || star.id;
        if (targetId && !isNaN(Number(targetId))) {
          const p = await fetchPersonDetails(targetId);
          if (isMounted && p && p.id) {
            setTmdbPerson(p);
            return;
          }
        }
        // Search TMDB by name if TMDB ID is not numeric
        const res = await searchTMDB(star.name, 'person', 1);
        if (isMounted && res.results && res.results.length > 0) {
          const firstResult = res.results[0] as TMDBPerson;
          if (firstResult.id) {
            const detailed = await fetchPersonDetails(firstResult.id);
            setTmdbPerson(detailed || firstResult);
          } else {
            setTmdbPerson(firstResult);
          }
        }
      } catch (e) {
        console.warn('Error fetching TMDB star details:', e);
      } finally {
        if (isMounted) setLoadingTmdb(false);
      }
    }
    loadTMDBInfo();
    return () => {
      isMounted = false;
    };
  }, [star]);

  // Trajectory points based on active timeframe
  const trajectoryPoints = star.history?.[activeTimeframe] || [
    { label: 'Nov 23', value: 220 },
    { label: 'Jan 24', value: 238 },
    { label: 'Mar 24', value: 252 },
    { label: 'May 24', value: 265 },
    { label: 'Jul 24', value: 274 },
    { label: 'Sep 24', value: 286 },
  ];

  // Calculate SVG polyline coordinates
  const minVal = Math.min(...trajectoryPoints.map((p) => p.value)) * 0.9;
  const maxVal = Math.max(...trajectoryPoints.map((p) => p.value)) * 1.05;
  const polylineCoords = trajectoryPoints
    .map((p, idx) => {
      const x = (idx / (trajectoryPoints.length - 1)) * 100;
      const y = 38 - ((p.value - minVal) / (maxVal - minVal)) * 32;
      return `${x},${y}`;
    })
    .join(' ');

  const displayName = tmdbPerson?.name || star.name;
  const bioText = tmdbPerson?.biography || star.dossierBio;
  const castCredits = tmdbPerson?.movie_credits?.cast || [];

  return (
    <div id="star-details-container" className="flex flex-col min-h-screen -mt-8 -mx-4 md:-mx-12 animate-fade-in pb-12">
      {/* Back Navigation Bar */}
      <div className="px-4 md:px-12 py-3 bg-[#131313]/90 backdrop-blur border-b border-[#4d4635]/20 flex items-center justify-between sticky top-16 z-20">
        <button
          id="back-to-explore-btn"
          onClick={onBackToExplore}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Explore Stars</span>
        </button>

        {/* Talent Quick Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-[#d0c5af] hidden sm:inline">
            Quick Switch:
          </span>
          <select
            id="talent-quick-switch"
            value={star.id}
            onChange={(e) => onSelectStar(e.target.value)}
            className="bg-[#1c1b1b] border border-[#4d4635]/40 text-[#f2ca50] text-xs font-mono rounded px-2.5 py-1 outline-none cursor-pointer"
          >
            {allStars.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cinematic Header & Profile Section */}
      <section
        id="star-cinematic-header"
        className="relative w-full h-[480px] md:h-[580px] overflow-hidden flex flex-col justify-end"
      >
        {/* Cover Image */}
        <div
          className="absolute inset-0 bg-cover bg-center w-full h-full transform scale-100 hover:scale-102 transition-transform duration-1000"
          style={{
            backgroundImage: `url('${
              star.coverImage ||
              getTMDBImageUrl(tmdbPerson?.profile_path, 'original') ||
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80'
            }')`,
          }}
        />
        {/* Deep Atmospheric Gradient Overlay */}
        <div className="absolute inset-0 cinematic-gradient" />

        {/* Profile Content Overlay */}
        <div className="relative z-10 w-full px-4 md:px-12 max-w-[1440px] mx-auto pb-12 flex flex-col md:flex-row items-start md:items-end gap-8">
          {/* Avatar Container with Golden Accent Ring */}
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden border-2 border-[#f2ca50] shadow-2xl relative shrink-0 bg-[#2a2a2a]">
            <img
              src={getTMDBImageUrl(tmdbPerson?.profile_path) || star.dossierImage || star.avatarImage}
              alt={displayName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Info Block */}
          <div className="flex-1 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-[#f2ca50]/15 text-[#f2ca50] font-data-label text-[11px] px-3 py-1 rounded uppercase tracking-wider border border-[#f2ca50]/30 font-semibold backdrop-blur-md">
                  {star.roles.join(' · ')} · {star.category}
                </span>
                {tmdbPerson?.popularity && (
                  <span className="flex items-center text-[#10B981] text-xs font-mono font-medium bg-[#10B981]/10 px-2.5 py-0.5 rounded border border-[#10B981]/30">
                    ★ TMDB Pop: {tmdbPerson.popularity.toFixed(1)}
                  </span>
                )}
              </div>
              <h1 className="font-headline-xl-mobile md:font-headline-xl text-3xl md:text-5xl text-[#FAF9F6] tracking-tight">
                {displayName}
              </h1>
              {tmdbPerson?.place_of_birth && (
                <p className="text-xs text-[#d0c5af] font-mono">
                  Born in {tmdbPerson.place_of_birth} {tmdbPerson.birthday ? `(${tmdbPerson.birthday})` : ''}
                </p>
              )}
            </div>

            {/* CTA Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                id="details-follow-btn"
                onClick={() => onToggleFollow(star.id)}
                className={`px-8 py-3.5 rounded-xl transition-all duration-300 font-data-value text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
                  isFollowing
                    ? 'bg-[#1c1b1b] text-[#f2ca50] border border-[#f2ca50]'
                    : 'bg-[#f2ca50] text-[#131313] font-bold bloom-hover'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFollowing ? 'check' : 'person_add'}
                </span>
                <span>{isFollowing ? 'Following' : 'Follow Star'}</span>
              </button>

              <button
                id="details-query-intel-btn"
                onClick={() => onOpenIntelligence(displayName)}
                className="px-4 py-3.5 rounded-xl bg-[#2a2a2a] text-[#FAF9F6] hover:text-[#f2ca50] border border-[#4d4635]/40 transition-colors font-data-label text-xs uppercase cursor-pointer"
                title="AI Career Analysis"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Main Content Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Intelligence Metrics Bento Grid */}
          <section id="star-intelligence-metrics-section">
            <h2 className="font-headline-md text-xl md:text-2xl text-[#FAF9F6] mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#f2ca50] text-[28px]">
                monitoring
              </span>
              Star Intelligence Metrics
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Metric 1: Star Score */}
              <div className="bg-[#1c1b1b] rounded-2xl p-5 gold-border-subtle flex flex-col justify-between h-36 relative overflow-hidden group hover:bg-[#201f1f] transition-all">
                <span className="font-data-label text-[11px] text-[#d0c5af] uppercase tracking-wider">
                  StarScore™
                </span>
                <div className="flex items-end gap-2">
                  <span className="font-headline-lg text-3xl md:text-4xl text-[#f2ca50] font-bold leading-none">
                    {star.starScore}
                  </span>
                  <span className="text-[#10B981] text-xs font-mono flex items-center pb-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +{star.buzzDelta}%
                  </span>
                </div>
              </div>

              {/* Metric 2: TMDB Popularity */}
              <div className="bg-[#1c1b1b] rounded-2xl p-5 gold-border-subtle flex flex-col justify-between h-36 relative overflow-hidden group hover:bg-[#201f1f] transition-all">
                <span className="font-data-label text-[11px] text-[#d0c5af] uppercase tracking-wider">
                  TMDB Popularity
                </span>
                <div>
                  <div className="flex items-end gap-1.5 mb-2">
                    <span className="font-headline-lg text-3xl md:text-4xl text-[#FAF9F6] font-bold leading-none">
                      {tmdbPerson?.popularity ? tmdbPerson.popularity.toFixed(0) : star.buzzMeter || 84}
                    </span>
                    <span className="text-[#d0c5af] text-xs font-mono pb-1">Index</span>
                  </div>
                  <div className="w-full bg-[#353534] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#f2ca50] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (tmdbPerson?.popularity || 80) * 1.2)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Metric 3: Audience Reach */}
              <div className="bg-[#1c1b1b] rounded-2xl p-5 gold-border-subtle flex flex-col justify-between h-36 relative overflow-hidden group hover:bg-[#201f1f] transition-all">
                <span className="font-data-label text-[11px] text-[#d0c5af] uppercase tracking-wider">
                  Audience Reach
                </span>
                <div className="flex items-end gap-2">
                  <span className="font-headline-lg text-3xl md:text-4xl text-[#FAF9F6] font-bold leading-none">
                    {star.globalReachCount || star.reach}
                  </span>
                </div>
              </div>

              {/* Metric 4: Filmography Count */}
              <div className="bg-[#1c1b1b] rounded-2xl p-5 gold-border-subtle flex flex-col justify-between h-36 relative overflow-hidden group hover:bg-[#201f1f] transition-all">
                <span className="font-data-label text-[11px] text-[#d0c5af] uppercase tracking-wider">
                  Movies &amp; Works
                </span>
                <div className="flex items-end gap-2">
                  <span className="font-headline-lg text-3xl md:text-4xl text-[#FAF9F6] font-bold leading-none">
                    {castCredits.length || star.films?.length || 12}
                  </span>
                  <span className="text-[#d0c5af] text-xs font-mono pb-1">Films</span>
                </div>
              </div>
            </div>
          </section>

          {/* Dossier Tabs & Narrative Section */}
          <section className="bg-[#1c1b1b] rounded-2xl p-6 md:p-8 gold-border-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-[#4d4635]/25 pb-4">
              <div className="flex gap-4 md:gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('dossier')}
                  className={`font-data-label text-[12px] uppercase tracking-widest pb-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'dossier'
                      ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-bold'
                      : 'text-[#d0c5af] hover:text-[#f2ca50]'
                  }`}
                >
                  Biography &amp; Overview
                </button>
                <button
                  onClick={() => setActiveTab('tmdb_credits')}
                  className={`font-data-label text-[12px] uppercase tracking-widest pb-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'tmdb_credits'
                      ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-bold'
                      : 'text-[#d0c5af] hover:text-[#f2ca50]'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span>TMDB Movie Credits ({castCredits.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('filmography')}
                  className={`font-data-label text-[12px] uppercase tracking-widest pb-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'filmography'
                      ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-bold'
                      : 'text-[#d0c5af] hover:text-[#f2ca50]'
                  }`}
                >
                  Box Office Milestones
                </button>
              </div>

              {tmdbPerson?.birthday && (
                <span className="text-[11px] font-mono text-[#d0c5af] hidden sm:inline">
                  Born: {tmdbPerson.birthday}
                </span>
              )}
            </div>

            {activeTab === 'dossier' && (
              <div className="space-y-6">
                <div className="font-body-lg text-[15px] md:text-[17px] text-[#d0c5af] leading-relaxed font-light whitespace-pre-line">
                  {bioText}
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#4d4635]/20 text-xs font-mono">
                  <div>
                    <span className="text-[#99907c] uppercase text-[10px] block">Birth Date</span>
                    <span className="text-[#FAF9F6] font-semibold">{tmdbPerson?.birthday || star.birthDate || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[#99907c] uppercase text-[10px] block">Place of Birth</span>
                    <span className="text-[#f2ca50] font-semibold truncate block">{tmdbPerson?.place_of_birth || star.industry}</span>
                  </div>
                  <div>
                    <span className="text-[#99907c] uppercase text-[10px] block">Primary Department</span>
                    <span className="text-[#FAF9F6] font-semibold">{tmdbPerson?.known_for_department || star.roles[0]}</span>
                  </div>
                  <div>
                    <span className="text-[#99907c] uppercase text-[10px] block">IMDb Profile</span>
                    {tmdbPerson?.imdb_id ? (
                      <a
                        href={`https://www.imdb.com/name/${tmdbPerson.imdb_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#f2ca50] hover:underline font-semibold"
                      >
                        View IMDb Page ↗
                      </a>
                    ) : (
                      <span className="text-[#FAF9F6] font-semibold">Verified</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tmdb_credits' && (
              <div className="space-y-4">
                {loadingTmdb ? (
                  <div className="py-8 text-center text-xs font-mono text-[#d0c5af] animate-pulse">
                    Loading complete TMDB movie credits...
                  </div>
                ) : castCredits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {castCredits.slice(0, 24).map((credit: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#201f1f] border border-[#4d4635]/30 rounded-xl overflow-hidden p-3 flex gap-3 items-center group hover:border-[#f2ca50]/60 transition-all"
                      >
                        <img
                          src={getTMDBImageUrl(credit.poster_path, 'w185')}
                          alt={credit.title || credit.name}
                          className="w-14 aspect-[2/3] object-cover rounded-lg border border-[#4d4635]/40"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline-sm text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors truncate">
                            {credit.title || credit.name}
                          </h4>
                          <div className="text-[11px] text-[#99907c] font-mono mt-0.5 truncate">
                            {credit.character ? `as ${credit.character}` : credit.release_date ? credit.release_date.split('-')[0] : 'Feature Film'}
                          </div>
                          {credit.vote_average ? (
                            <div className="text-[11px] font-mono text-[#f2ca50] mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                              <span>{credit.vote_average.toFixed(1)} / 10</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs font-mono text-[#d0c5af] bg-[#201f1f] rounded-xl border border-[#4d4635]/20">
                    TMDB credits loaded. Use AI Analysis to summarize box office milestones.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'filmography' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#4d4635]/30 text-[#99907c] uppercase tracking-wider">
                        <th className="pb-3">Feature Title</th>
                        <th className="pb-3">Year</th>
                        <th className="pb-3">Gross Box Office</th>
                        <th className="pb-3">Verdict</th>
                        <th className="pb-3">Estimated ROI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#4d4635]/15">
                      {(star.films || []).map((film) => (
                        <tr key={film.title} className="hover:bg-[#201f1f] transition-colors">
                          <td className="py-3.5 text-[#FAF9F6] font-semibold font-sans">{film.title}</td>
                          <td className="py-3.5 text-[#d0c5af]">{film.year}</td>
                          <td className="py-3.5 text-[#f2ca50] font-bold">{film.boxOffice}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px]">
                              {film.verdict}
                            </span>
                          </td>
                          <td className="py-3.5 text-[#d0c5af]">{film.roi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* StarScore Trajectory Card */}
          <div
            id="starscore-trajectory-card"
            className="bg-[#1c1b1b] rounded-2xl p-6 gold-border-subtle relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <h3 className="font-data-label text-[11px] text-[#d0c5af] uppercase tracking-widest">
                StarScore™ Trajectory
              </h3>
              <span className="text-[10px] font-mono text-[#10B981]">Apex Velocity</span>
            </div>

            {/* Interactive SVG Line Chart */}
            <div className="relative h-44 w-full flex items-end my-2">
              <div className="absolute inset-0 w-full h-full border-b border-l border-[#4d4635]/25" />
              
              <svg
                className="absolute inset-0 w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 40"
              >
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f2ca50" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f2ca50" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon points={`0,40 ${polylineCoords} 100,40`} fill="url(#chartGlow)" />
                <polyline
                  fill="none"
                  points={polylineCoords}
                  stroke="#C5A028"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="w-full flex justify-between text-[9px] font-mono text-[#d0c5af]/60 pt-2 z-10">
                {trajectoryPoints.map((p) => (
                  <span key={p.label}>{p.label}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#4d4635]/20 font-data-label text-xs text-[#d0c5af]">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2 py-1 transition-all cursor-pointer ${
                    activeTimeframe === tf
                      ? 'text-[#f2ca50] border-b border-[#f2ca50] font-bold'
                      : 'hover:text-[#FAF9F6]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Active Signals Card */}
          <div
            id="active-signals-card"
            className="bg-[#1c1b1b] rounded-2xl p-6 gold-border-subtle space-y-4"
          >
            <h3 className="font-data-label text-[11px] text-[#f2ca50] uppercase tracking-widest border-b border-[#4d4635]/25 pb-2">
              Active Signals
            </h3>

            <div className="flex items-center gap-4 p-3.5 bg-[#201f1f] rounded-xl border border-[#4d4635]/20 hover:border-[#10B981]/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0 border border-[#10B981]/30">
                <span className="material-symbols-outlined text-[#10B981] text-[20px]">
                  sentiment_satisfied
                </span>
              </div>
              <div>
                <div className="font-data-label text-[10px] text-[#d0c5af] uppercase tracking-wider">
                  Audience Sentiment
                </div>
                <div className="font-body-md text-[14px] text-[#FAF9F6] font-semibold mt-0.5">
                  {star.activeSignals?.audienceSentiment || 'Overwhelmingly Positive'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-[#201f1f] rounded-xl border border-[#4d4635]/20 hover:border-[#f2ca50]/40 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[#f2ca50]/15 flex items-center justify-center shrink-0 border border-[#f2ca50]/30">
                <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">
                  campaign
                </span>
              </div>
              <div>
                <div className="font-data-label text-[10px] text-[#d0c5af] uppercase tracking-wider">
                  Social Buzz Rate
                </div>
                <div className="font-body-md text-[14px] text-[#FAF9F6] font-semibold mt-0.5">
                  {star.activeSignals?.socialBuzzRate || 'High Velocity'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
