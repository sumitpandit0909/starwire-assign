import React, { useState, useMemo, useEffect } from 'react';
import { Star, TMDBPerson } from '../../types';
import {
  getTMDBImageUrl,
  fetchPopularPeople,
  fetchTrendingPeople,
  searchTMDB,
  fetchGeminiIntelligence,
} from '../../services/tmdbService';

interface ExploreStarsViewProps {
  stars: Star[];
  onSelectStar: (starId: string) => void;
  followingIds: string[];
  onToggleFollow: (starId: string, e?: React.MouseEvent) => void;
  onOpenIntelligence?: (name?: string) => void;
}

export const ExploreStarsView: React.FC<ExploreStarsViewProps> = ({
  stars,
  onSelectStar,
  followingIds,
  onToggleFollow,
  onOpenIntelligence,
}) => {
  const [sourceMode, setSourceMode] = useState<'tmdb' | 'curated'>('tmdb');
  const [activeTab, setActiveTab] = useState<'ALL' | 'BOLLYWOOD' | 'SOUTH' | 'PAN INDIA'>('ALL');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedSort, setSelectedSort] = useState<string>('Popularity');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // TMDB Live Data State
  const [tmdbPeople, setTmdbPeople] = useState<TMDBPerson[]>([]);
  const [loadingTmdb, setLoadingTmdb] = useState<boolean>(true);
  const [selectedTmdbPerson, setSelectedTmdbPerson] = useState<TMDBPerson | null>(null);
  const [tmdbPersonAnalysis, setTmdbPersonAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);

  // Load live TMDB People or search query
  useEffect(() => {
    let isMounted = true;
    async function loadTMDBPeople() {
      setLoadingTmdb(true);
      try {
        if (searchQuery.trim().length >= 2) {
          const res = await searchTMDB(searchQuery, 'person', 1);
          if (isMounted) {
            setTmdbPeople((res.results as TMDBPerson[]) || []);
          }
        } else {
          const res = await fetchPopularPeople(1);
          if (isMounted) {
            setTmdbPeople(res.results || []);
          }
        }
      } catch (err) {
        console.warn('TMDB load error in ExploreStars:', err);
      } finally {
        if (isMounted) setLoadingTmdb(false);
      }
    }

    const timer = setTimeout(() => {
      loadTMDBPeople();
    }, searchQuery ? 350 : 0);

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, [searchQuery]);

  // Load AI analysis when clicking a TMDB person
  const handleOpenTmdbPersonModal = async (person: TMDBPerson) => {
    setSelectedTmdbPerson(person);
    setTmdbPersonAnalysis('');
    setLoadingAnalysis(true);
    try {
      const intel = await fetchGeminiIntelligence(
        `Provide an executive talent equity and box office momentum analysis for actor/director ${person.name}. Highlight recent commercial performance, audience sentiment, and upcoming slate.`,
        person.name
      );
      setTmdbPersonAnalysis(intel);
    } catch (e) {
      setTmdbPersonAnalysis('Analysis currently unavailable.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const filteredStars = useMemo(() => {
    return stars
      .filter((star) => {
        // Tab filter
        if (activeTab === 'BOLLYWOOD' && star.category !== 'Bollywood') return false;
        if (activeTab === 'SOUTH' && star.category !== 'South') return false;
        if (activeTab === 'PAN INDIA' && star.category !== 'Pan India') return false;

        // Industry filter
        if (selectedIndustry !== 'All Industries' && star.industry !== selectedIndustry) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = star.name.toLowerCase().includes(q);
          const matchRole = star.roles.some((r) => r.toLowerCase().includes(q));
          const matchCategory = star.category.toLowerCase().includes(q);
          if (!matchName && !matchRole && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === 'Top Trending' || selectedSort === 'Popularity') {
          return b.buzzDelta - a.buzzDelta;
        }
        if (selectedSort === 'Highest Score') {
          return b.starScore - a.starScore;
        }
        if (selectedSort === 'Reach') {
          return parseFloat(b.reach) - parseFloat(a.reach);
        }
        return 0;
      });
  }, [stars, activeTab, selectedIndustry, selectedSort, searchQuery]);

  const displayedStars = filteredStars.slice(0, visibleCount);

  return (
    <div id="explore-stars-container" className="flex flex-col gap-8 md:gap-10 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              id="explore-page-title"
              className="font-headline-xl-mobile md:font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight"
            >
              Explore Talent &amp; Stars
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              TMDB LIVE INTEGRATED
            </span>
          </div>
          <p className="font-body-lg text-[15px] md:text-[17px] text-[#d0c5af] font-light mt-1">
            Discover the personalities shaping Indian &amp; Global cinema with live TMDB data and StarScore™ benchmarks.
          </p>
        </div>

        {/* Source Mode Toggle */}
        <div className="flex items-center bg-[#1c1b1b] p-1.5 rounded-2xl border border-[#4d4635]/30 self-start md:self-auto">
          <button
            onClick={() => setSourceMode('tmdb')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              sourceMode === 'tmdb'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">public</span>
            <span>TMDB Live Talent DB</span>
          </button>

          <button
            onClick={() => setSourceMode('curated')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              sourceMode === 'curated'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>StarScore™ Dossiers</span>
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="w-full focus-within:ring-1 focus-within:ring-[#f2ca50] rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 px-5 py-3.5 flex items-center shadow-lg">
        <span className="material-symbols-outlined text-[#f2ca50] mr-3 text-[22px]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            sourceMode === 'tmdb'
              ? 'Search any actor, actress, or director worldwide in TMDB...'
              : 'Search curated stars, films, roles...'
          }
          className="bg-transparent border-none text-[#FAF9F6] w-full focus:outline-none font-body-md text-sm sm:text-base placeholder:text-[#99907c]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#99907c] hover:text-[#FAF9F6] text-xs font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* TMDB LIVE TALENT VIEW */}
      {sourceMode === 'tmdb' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
              {searchQuery ? `TMDB Search Results for "${searchQuery}"` : 'TMDB Popular Global & Indian Talent'}
            </span>
            <span className="text-xs font-mono text-[#10B981]">
              {tmdbPeople.length} Profiles Available
            </span>
          </div>

          {loadingTmdb ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : tmdbPeople.length === 0 ? (
            <div className="p-12 text-center bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl text-[#d0c5af] font-mono text-sm">
              No TMDB profiles matched your query. Try searching another name.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {tmdbPeople.map((person) => {
                const isFollowed = followingIds.includes(`tmdb-${person.id}`);
                return (
                  <div
                    key={person.id}
                    className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all star-card group shadow-xl"
                  >
                    {/* Image Header */}
                    <div
                      onClick={() => handleOpenTmdbPersonModal(person)}
                      className="relative aspect-[3/4] w-full overflow-hidden bg-[#201f1f] cursor-pointer"
                    >
                      <img
                        src={getTMDBImageUrl(person.profile_path, 'w500')}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                      {/* TMDB Popularity Badge */}
                      <div className="absolute top-2.5 right-2.5 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold backdrop-blur-sm">
                        ★ {person.popularity?.toFixed(0)} Pop.
                      </div>

                      {/* Department */}
                      <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#FAF9F6] backdrop-blur-xs uppercase font-bold">
                        {person.known_for_department || 'Actor'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <h3
                          onClick={() => handleOpenTmdbPersonModal(person)}
                          className="font-headline-md text-base sm:text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-tight cursor-pointer"
                        >
                          {person.name}
                        </h3>

                        <div className="mt-2 text-xs text-[#99907c] line-clamp-2">
                          {person.known_for && person.known_for.length > 0 ? (
                            <span>
                              Works: <strong className="text-[#d0c5af] font-normal">{person.known_for.map(k => k.title || k.name).join(', ')}</strong>
                            </span>
                          ) : (
                            'TMDB Verified Theatrical Talent'
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenTmdbPersonModal(person)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-bold font-data-label text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                        >
                          <span>Profile &amp; AI</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>

                        <button
                          onClick={(e) => onToggleFollow(`tmdb-${person.id}`, e)}
                          className={`p-2 rounded-xl border transition-all ${
                            isFollowed
                              ? 'border-[#f2ca50] bg-[#f2ca50]/15 text-[#f2ca50]'
                              : 'border-[#4d4635]/40 text-[#99907c] hover:text-[#FAF9F6] hover:border-[#f2ca50]/40'
                          }`}
                          title={isFollowed ? 'Following Talent' : 'Follow Talent'}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isFollowed ? 'bookmark_added' : 'bookmark_add'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CURATED STARSCORE VIEW */}
      {sourceMode === 'curated' && (
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide border-b border-[#4d4635]/25">
            {(
              [
                { id: 'ALL', label: 'All Stars' },
                { id: 'BOLLYWOOD', label: 'Bollywood' },
                { id: 'SOUTH', label: 'South Cinema' },
                { id: 'PAN INDIA', label: 'Pan India' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-data-label text-xs uppercase tracking-wider whitespace-nowrap transition-colors relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#f2ca50] font-bold'
                    : 'text-[#d0c5af] hover:text-[#FAF9F6]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2ca50]" />
                )}
              </button>
            ))}
          </div>

          {/* Stars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedStars.map((star) => {
              const isFollowing = followingIds.includes(star.id);
              return (
                <div
                  key={star.id}
                  onClick={() => onSelectStar(star.id)}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all star-card group cursor-pointer shadow-lg"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#201f1f]">
                    <img
                      src={star.avatarImage}
                      alt={star.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      StarScore {star.starScore}
                    </div>

                    <div className="absolute top-3 right-3 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      +{star.buzzDelta}%
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                        {star.name}
                      </h3>
                      <p className="text-xs text-[#99907c] font-mono mt-0.5">
                        {star.industry} · {star.roles.join(', ')}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#d0c5af]">Reach: {star.reach}</span>
                      <button
                        onClick={(e) => onToggleFollow(star.id, e)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isFollowing
                            ? 'border-[#f2ca50] bg-[#f2ca50]/15 text-[#f2ca50]'
                            : 'border-[#4d4635]/40 text-[#99907c] hover:text-[#FAF9F6]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isFollowing ? 'bookmark_added' : 'bookmark_add'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleCount < filteredStars.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-6 py-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider transition-all"
              >
                Load More Dossiers
              </button>
            </div>
          )}
        </div>
      )}

      {/* TMDB Person Profile & AI Modal */}
      {selectedTmdbPerson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedTmdbPerson(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={getTMDBImageUrl(selectedTmdbPerson.profile_path, 'w500')}
                alt={selectedTmdbPerson.name}
                className="w-full sm:w-48 aspect-[3/4] object-cover rounded-xl border border-[#4d4635]/30 shadow-lg"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 font-bold">
                    TMDB TALENT DOSSIER
                  </span>
                  <span className="text-xs font-mono text-[#99907c]">
                    ID #{selectedTmdbPerson.id}
                  </span>
                </div>

                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6]">
                  {selectedTmdbPerson.name}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="text-[#f2ca50]">
                    TMDB Popularity: <strong>{selectedTmdbPerson.popularity?.toFixed(1)}</strong>
                  </div>
                  <div className="text-[#FAF9F6]">
                    Dept: <strong>{selectedTmdbPerson.known_for_department || 'Acting'}</strong>
                  </div>
                </div>

                {selectedTmdbPerson.known_for && (
                  <div className="pt-2">
                    <span className="text-xs font-mono text-[#99907c] block mb-1">
                      Prominent Filmography / Known Works:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTmdbPerson.known_for.map((work, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-[#201f1f] text-[#FAF9F6] border border-[#4d4635]/30 text-xs font-mono"
                        >
                          {work.title || work.name} {work.release_date ? `(${work.release_date.split('-')[0]})` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Intelligence Stream */}
                <div className="mt-4 p-4 rounded-xl bg-[#201f1f] border border-[#f2ca50]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#f2ca50] font-bold">
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>AI Starwire Talent Equity Analysis</span>
                  </div>

                  {loadingAnalysis ? (
                    <div className="text-xs text-[#d0c5af] font-mono animate-pulse">
                      Synthesizing box office equity, global appeal, and sentiment signals...
                    </div>
                  ) : (
                    <div className="text-xs text-[#FAF9F6] font-light leading-relaxed whitespace-pre-line">
                      {tmdbPersonAnalysis}
                    </div>
                  )}
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    onClick={() => {
                      onToggleFollow(`tmdb-${selectedTmdbPerson.id}`);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                    <span>{followingIds.includes(`tmdb-${selectedTmdbPerson.id}`) ? 'Following in Dashboard' : 'Follow Star in Dashboard'}</span>
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
