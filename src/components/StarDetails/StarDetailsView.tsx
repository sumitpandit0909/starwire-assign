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

// Shimmer Skeleton Loader for Star Details Page
const SkeletonStarDetails: React.FC = () => (
  <div className="flex flex-col min-h-screen -mt-8 -mx-4 md:-mx-12 animate-pulse pb-12">
    <div className="px-4 md:px-12 py-4 border-b border-[#4d4635]/20 bg-[#131313]">
      <div className="h-5 w-44 bg-[#2a2a2a] rounded" />
    </div>

    <div className="h-[400px] md:h-[480px] bg-[#1c1b1b] relative p-6 md:p-12 flex flex-col justify-end">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-8 max-w-[1440px] mx-auto w-full">
        <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl bg-[#2a2a2a] shrink-0 border-2 border-[#4d4635]/30" />
        <div className="space-y-4 flex-1">
          <div className="h-6 bg-[#2a2a2a] rounded w-28" />
          <div className="h-10 bg-[#2a2a2a] rounded w-1/2" />
          <div className="h-4 bg-[#2a2a2a] rounded w-1/3" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 bg-[#2a2a2a] rounded-xl w-32" />
            <div className="h-10 bg-[#2a2a2a] rounded-xl w-36" />
          </div>
        </div>
      </div>
    </div>

    <div className="px-4 md:px-12 max-w-[1440px] mx-auto w-full mt-8 space-y-8">
      {/* 4 Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl p-5 space-y-2 h-24">
            <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
            <div className="h-6 bg-[#2a2a2a] rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Main Bio & Chart Skeleton */}
      <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="h-7 bg-[#2a2a2a] rounded w-48" />
        <div className="space-y-2">
          <div className="h-4 bg-[#2a2a2a] rounded w-full" />
          <div className="h-4 bg-[#2a2a2a] rounded w-5/6" />
          <div className="h-4 bg-[#2a2a2a] rounded w-2/3" />
        </div>
        <div className="h-56 bg-[#201f1f] rounded-2xl border border-[#4d4635]/20" />
      </div>
    </div>
  </div>
);

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
  const [loadingTmdb, setLoadingTmdb] = useState<boolean>(true);

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

  if (loadingTmdb) {
    return <SkeletonStarDetails />;
  }

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
  const displayBio = tmdbPerson?.biography || star.dossierBio;
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

          {/* Identity & Main Actions */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 text-xs font-mono font-bold uppercase tracking-wider">
                {star.category || tmdbPerson?.known_for_department || 'GLOBAL CINEMA'}
              </span>
              {star.language && (
                <span className="px-3 py-0.5 rounded-full bg-[#201f1f] text-[#d0c5af] border border-[#4d4635]/40 text-xs font-mono">
                  {star.language}
                </span>
              )}
            </div>

            <h1 className="font-headline-xl text-3xl md:text-5xl lg:text-6xl text-[#FAF9F6] font-bold tracking-tight">
              {displayName}
            </h1>

            <p className="text-xs md:text-sm text-[#d0c5af] font-mono flex items-center gap-4">
              <span>Primary Role: <strong className="text-[#FAF9F6]">{star.roles?.[0] || tmdbPerson?.known_for_department || 'Actor'}</strong></span>
              {tmdbPerson?.place_of_birth && (
                <span>Born: <strong className="text-[#FAF9F6]">{tmdbPerson.place_of_birth}</strong></span>
              )}
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="follow-star-cta-btn"
                onClick={() => onToggleFollow(star.id)}
                className={`px-6 py-3 rounded-xl font-data-label text-xs uppercase tracking-wider font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                  isFollowing
                    ? 'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]'
                    : 'bg-[#f2ca50] text-[#131313] hover:bg-[#d4af37]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isFollowing ? 'bookmark_added' : 'bookmark_add'}
                </span>
                <span>{isFollowing ? 'Following Dossier' : 'Follow Star Dossier'}</span>
              </button>

              <button
                id="run-ai-intelligence-cta-btn"
                onClick={() => onOpenIntelligence(displayName)}
                className="px-6 py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-data-label text-xs uppercase tracking-wider font-bold transition-all border border-[#4d4635]/40 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Run Gemini AI Intelligence</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Metrics & Telemetry Grid */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto w-full space-y-8 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">TMDB Popularity / StarScore</span>
            <div className="text-2xl font-bold font-mono text-[#f2ca50] flex items-center gap-2">
              <span>★ {tmdbPerson?.popularity ? tmdbPerson.popularity.toFixed(0) : star.starScore}</span>
              <span className="text-xs text-[#10B981] font-normal">+{star.buzzDelta}%</span>
            </div>
          </div>

          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Global Reach</span>
            <div className="text-2xl font-bold font-mono text-[#FAF9F6]">
              {star.globalReachCount || '45M'}
            </div>
          </div>

          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Audience Sentiment</span>
            <div className="text-base font-bold font-mono text-[#10B981] truncate">
              {star.activeSignals?.audienceSentiment || 'Overwhelmingly Positive'}
            </div>
          </div>

          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
            <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Social Buzz Rate</span>
            <div className="text-base font-bold font-mono text-[#f2ca50] truncate">
              {star.activeSignals?.socialBuzzRate || 'High Velocity'}
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#4d4635]/30 gap-8">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`pb-4 text-sm font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'dossier'
                ? 'text-[#f2ca50] font-bold border-b-2 border-[#f2ca50]'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Executive Dossier &amp; Bio
          </button>
          <button
            onClick={() => setActiveTab('tmdb_credits')}
            className={`pb-4 text-sm font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'tmdb_credits'
                ? 'text-[#f2ca50] font-bold border-b-2 border-[#f2ca50]'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            TMDB Filmography ({castCredits.length})
          </button>
        </div>

        {/* Tab 1: Dossier Bio & Trajectory Chart */}
        {activeTab === 'dossier' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="font-headline-md text-xl text-[#FAF9F6] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50]">description</span>
                <span>Biography &amp; Career Intel</span>
              </h2>
              <p className="text-sm text-[#d0c5af] font-light leading-relaxed whitespace-pre-line">
                {displayBio || 'No extended biography recorded in TMDB registry.'}
              </p>

              {/* Score Trajectory Graph */}
              <div className="pt-6 border-t border-[#4d4635]/25 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
                    Historical Score Trajectory
                  </span>
                  <div className="flex gap-1 bg-[#131313] p-1 rounded-lg border border-[#4d4635]/30">
                    {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer ${
                          activeTimeframe === tf ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full bg-[#131313] rounded-xl p-4 border border-[#4d4635]/20 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#f2ca50"
                      strokeWidth="2"
                      points={polylineCoords}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Key Details */}
            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 space-y-6 shadow-xl h-fit">
              <h3 className="font-headline-md text-lg text-[#FAF9F6] font-bold pb-2 border-b border-[#4d4635]/25">
                Talent Dossier Meta
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[#99907c] block uppercase">Full Name</span>
                  <span className="text-[#FAF9F6] font-bold text-sm">{displayName}</span>
                </div>

                {tmdbPerson?.birthday && (
                  <div>
                    <span className="text-[#99907c] block uppercase">Date of Birth</span>
                    <span className="text-[#FAF9F6]">{tmdbPerson.birthday}</span>
                  </div>
                )}

                {tmdbPerson?.place_of_birth && (
                  <div>
                    <span className="text-[#99907c] block uppercase">Place of Birth</span>
                    <span className="text-[#FAF9F6]">{tmdbPerson.place_of_birth}</span>
                  </div>
                )}

                <div>
                  <span className="text-[#99907c] block uppercase">Known For Department</span>
                  <span className="text-[#f2ca50] font-bold">{tmdbPerson?.known_for_department || star.category}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: TMDB Live Filmography Credits */}
        {activeTab === 'tmdb_credits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
              <span>Live TMDB Filmography ({castCredits.length} Credits)</span>
            </div>

            {castCredits.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {castCredits.slice(0, 20).map((credit: any) => (
                  <div
                    key={`${credit.id}-${credit.character}`}
                    className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    <div className="relative aspect-[2/3] w-full bg-[#201f1f]">
                      <img
                        src={getTMDBImageUrl(credit.poster_path, 'w342')}
                        alt={credit.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {credit.vote_average > 0 && (
                        <div className="absolute top-2 right-2 bg-[#131313]/90 text-[#f2ca50] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                          ★ {credit.vote_average.toFixed(1)}
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h4 className="font-headline-md text-xs text-[#FAF9F6] font-bold line-clamp-1">
                        {credit.title}
                      </h4>
                      <p className="text-[10px] text-[#99907c] font-mono truncate mt-0.5">
                        Role: {credit.character || 'Self'}
                      </p>
                      <p className="text-[10px] text-[#d0c5af] font-mono mt-1">
                        {credit.release_date ? credit.release_date.split('-')[0] : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#d0c5af]">No filmography credits returned by TMDB for this person.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
