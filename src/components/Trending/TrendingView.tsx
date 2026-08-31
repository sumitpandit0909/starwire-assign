import React, { useState, useEffect } from 'react';
import { Star, TMDBPerson, TMDBMovie } from '../../types';
import {
  getTMDBImageUrl,
  fetchTrendingPeople,
  fetchTrendingMovies,
  fetchTrendingTV,
} from '../../services/tmdbService';

interface TrendingViewProps {
  stars?: Star[];
  onSelectStar: (starId: string) => void;
  followingIds?: string[];
  onToggleFollow?: (starId: string, e?: React.MouseEvent) => void;
  onOpenIntelligence: (starName?: string) => void;
}

// Shimmer Skeleton Card Placeholder
const SkeletonTrendingCard: React.FC = () => (
  <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-96">
    <div className="bg-[#2a2a2a] h-60 w-full" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-[#2a2a2a] rounded w-3/4" />
      <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
      <div className="h-8 bg-[#201f1f] rounded-xl mt-2" />
    </div>
  </div>
);

// Shimmer Skeleton Podium Placeholder
const SkeletonPodiumCard: React.FC = () => (
  <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl p-6 animate-pulse flex flex-col justify-between h-52">
    <div className="flex justify-between items-start">
      <div className="h-8 w-10 bg-[#2a2a2a] rounded" />
      <div className="h-5 w-16 bg-[#2a2a2a] rounded-full" />
    </div>
    <div className="flex items-center gap-4 my-2">
      <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a]" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-[#2a2a2a] rounded w-2/3" />
        <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
      </div>
    </div>
    <div className="h-4 bg-[#201f1f] rounded w-full mt-2" />
  </div>
);

export const TrendingView: React.FC<TrendingViewProps> = ({
  onSelectStar,
  followingIds = [],
  onToggleFollow,
  onOpenIntelligence,
}) => {
  const [activeTab, setActiveTab] = useState<'people' | 'movies' | 'tv'>('people');
  
  // Real TMDB data states sorted by popularity
  const [trendingPeople, setTrendingPeople] = useState<TMDBPerson[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Selected Item Modal
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);
  const [selectedTV, setSelectedTV] = useState<any | null>(null);

  // Fetch TMDB live trending data (Daily Window) & Sort by Popularity
  useEffect(() => {
    let isMounted = true;
    async function loadTrendingTMDB() {
      setLoading(true);
      try {
        if (activeTab === 'people') {
          const res = await fetchTrendingPeople('day', 1);
          if (isMounted) {
            const sorted = [...(res.results || [])].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            setTrendingPeople(sorted);
          }
        } else if (activeTab === 'movies') {
          const res = await fetchTrendingMovies('day', 1);
          if (isMounted) {
            const sorted = [...(res.results || [])].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
            setTrendingMovies(sorted);
          }
        } else if (activeTab === 'tv') {
          const res = await fetchTrendingTV('day', 1);
          if (isMounted) {
            const sorted = [...(res.results || [])].sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
            setTrendingTV(sorted);
          }
        }
      } catch (e) {
        console.warn('Error fetching TMDB trending data:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadTrendingTMDB();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <div id="trending-view-container" className="space-y-8 animate-fade-in pb-12">
      {/* Header Layout (Tabs moved to rightmost) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
            Trending Content
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Real-time trending people, movies, and TV shows updated daily from TMDB.
          </p>
        </div>

        {/* Rightmost Clean Tabs: People | Movies | TV */}
        <div className="flex items-center bg-[#1c1b1b] p-1 rounded-xl border border-[#4d4635]/30 self-start md:self-auto ml-auto">
          <button
            onClick={() => setActiveTab('people')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'people'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>People</span>
          </button>

          <button
            onClick={() => setActiveTab('movies')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'movies'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">movie</span>
            <span>Movies</span>
          </button>

          <button
            onClick={() => setActiveTab('tv')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tv'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">tv</span>
            <span>TV</span>
          </button>
        </div>
      </div>

      {/* 1. PEOPLE TAB */}
      {activeTab === 'people' && (
        <div className="space-y-8">
          {/* Skeleton Loading State */}
          {loading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <SkeletonPodiumCard key={n} />
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <SkeletonTrendingCard key={n} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Top 3 Live Talent Podium */}
              {trendingPeople.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {trendingPeople.slice(0, 3).map((person, idx) => {
                    const isFollowed = followingIds.includes(`tmdb-${person.id}`) || followingIds.includes(person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    return (
                      <div
                        key={person.id}
                        onClick={() => onSelectStar(person.id.toString())}
                        className="bg-[#1c1b1b] border border-[#f2ca50]/30 hover:border-[#f2ca50] rounded-2xl p-6 relative overflow-hidden group transition-all flex flex-col justify-between shadow-xl cursor-pointer"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2ca50]/10 rounded-bl-full blur-xl" />
                        <div className="flex justify-between items-start mb-4">
                          <span className="font-mono text-3xl font-bold text-[#f2ca50]">#{idx + 1}</span>
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
                            ★ {person.popularity ? person.popularity.toFixed(0) : 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 my-2">
                          <img
                            src={getTMDBImageUrl(person.profile_path, 'w185', 'profile')}
                            alt={person.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors shadow-md"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                          <div>
                            <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                              {person.name}
                            </h3>
                            <p className="text-xs text-[#99907c] font-mono">{person.known_for_department || 'Acting'}</p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#4d4635]/25 flex justify-between items-center">
                          <span className="text-xs font-mono text-[#f2ca50] font-bold">
                            View Profile ↗
                          </span>
                          {onToggleFollow && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFollow(`tmdb-${person.id}`, e);
                              }}
                              className={`px-3 py-1.5 rounded-xl border transition-all font-bold text-xs cursor-pointer flex items-center gap-1 ${
                                isFollowed
                                  ? 'bg-[#f2ca50]/15 text-[#f2ca50] border-[#f2ca50]'
                                  : 'bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] border-[#4d4635]/40'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {isFollowed ? 'bookmark_added' : 'bookmark_add'}
                              </span>
                              <span>{isFollowed ? 'Following' : 'Follow'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Full TMDB Live Table for People (Removed Known For & Replaced Actions with Follow) */}
              <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 overflow-x-auto shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#4d4635]/30">
                  <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
                    Trending People (Sorted by Popularity)
                  </span>
                  <span className="text-xs font-mono text-[#10B981]">
                    {trendingPeople.length} Stars Loaded
                  </span>
                </div>

                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#4d4635]/30 text-[#99907c] uppercase tracking-wider">
                      <th className="pb-3 pl-2">Rank</th>
                      <th className="pb-3">Person Profile</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">TMDB Popularity</th>
                      <th className="pb-3 text-right pr-2">Follow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4d4635]/15">
                    {trendingPeople.map((person, i) => {
                      const isFollowed = followingIds.includes(`tmdb-${person.id}`) || followingIds.includes(person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      return (
                        <tr
                          key={person.id}
                          onClick={() => onSelectStar(person.id.toString())}
                          className="hover:bg-[#201f1f] transition-colors cursor-pointer group"
                        >
                          <td className="py-4 pl-2 font-bold text-[#f2ca50]">#{i + 1}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getTMDBImageUrl(person.profile_path, 'w185', 'profile')}
                                alt={person.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#4d4635]/40 group-hover:border-[#f2ca50] transition-colors"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                                }}
                              />
                              <div>
                                <span className="font-headline-sm text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors block">
                                  {person.name}
                                </span>
                                <span className="text-[10px] text-[#99907c]">
                                  TMDB ID #{person.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-[#d0c5af]">
                            {person.known_for_department || 'Acting'}
                          </td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-md bg-[#f2ca50]/15 text-[#f2ca50] font-bold border border-[#f2ca50]/30">
                              ★ {person.popularity?.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-4 text-right pr-2">
                            {onToggleFollow && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFollow(`tmdb-${person.id}`, e);
                                }}
                                className={`px-4 py-1.5 rounded-xl border transition-all font-bold text-xs cursor-pointer flex items-center gap-1 ml-auto ${
                                  isFollowed
                                    ? 'bg-[#f2ca50]/15 text-[#f2ca50] border-[#f2ca50]'
                                    : 'bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] border-[#4d4635]/40'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[15px]">
                                  {isFollowed ? 'bookmark_added' : 'bookmark_add'}
                                </span>
                                <span>{isFollowed ? 'Following' : 'Follow'}</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. MOVIES TAB */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
            <span>Trending Movies (Sorted by Popularity)</span>
            <span>{trendingMovies.length} Movies Loaded</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SkeletonTrendingCard key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingMovies.map((movie, idx) => (
                <div
                  key={movie.id}
                  onClick={() => setSelectedMovie(movie)}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all group cursor-pointer shadow-lg"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#201f1f]">
                    <img
                      src={getTMDBImageUrl(movie.poster_path, 'w500')}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      #{idx + 1}
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                      <span>{movie.vote_average?.toFixed(1)}</span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 text-[11px] font-mono text-[#d0c5af]">
                      Pop: {movie.popularity?.toFixed(0)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-[#99907c] font-light mt-1 line-clamp-2">
                        {movie.overview || 'Live TMDB box office record.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#99907c]">{movie.release_date ? movie.release_date.split('-')[0] : 'Upcoming'}</span>
                      <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. TV SHOWS TAB */}
      {activeTab === 'tv' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
            <span>Trending TV Shows (Sorted by Popularity)</span>
            <span>{trendingTV.length} TV Shows Loaded</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <SkeletonTrendingCard key={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingTV.map((show, idx) => (
                <div
                  key={show.id}
                  onClick={() => setSelectedTV(show)}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all group cursor-pointer shadow-lg"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#201f1f]">
                    <img
                      src={getTMDBImageUrl(show.poster_path, 'w500')}
                      alt={show.name || show.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      #{idx + 1}
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                      <span>{show.vote_average?.toFixed(1)}</span>
                    </div>

                    <div className="absolute bottom-2 left-2.5 text-[11px] font-mono text-[#d0c5af]">
                      Pop: {show.popularity?.toFixed(0)}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-1">
                        {show.name || show.original_name}
                      </h3>
                      <p className="text-xs text-[#99907c] font-light mt-1 line-clamp-2">
                        {show.overview || 'Live TMDB television series stream.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#99907c]">
                        {show.origin_country && show.origin_country[0] ? `Origin: ${show.origin_country[0]}` : `Votes: ${show.vote_count}`}
                      </span>
                      <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TMDB Movie Detail Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={getTMDBImageUrl(selectedMovie.poster_path, 'w500')}
                alt={selectedMovie.title}
                className="w-full sm:w-48 aspect-[2/3] object-cover rounded-xl border border-[#4d4635]/30 shadow-lg"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 font-bold">
                    TRENDING MOVIE
                  </span>
                  <span className="text-xs font-mono text-[#99907c]">
                    ID #{selectedMovie.id}
                  </span>
                </div>

                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6]">
                  {selectedMovie.title}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1 text-[#f2ca50]">
                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                    <strong className="text-sm">{selectedMovie.vote_average?.toFixed(1)}/10</strong>
                    <span className="text-[#99907c]">({selectedMovie.vote_count} votes)</span>
                  </div>
                  <div className="text-[#d0c5af]">
                    Release: <strong>{selectedMovie.release_date || 'TBD'}</strong>
                  </div>
                  <div className="text-[#10B981]">
                    Language: <strong className="uppercase">{selectedMovie.original_language}</strong>
                  </div>
                </div>

                <p className="text-sm text-[#d0c5af] font-light leading-relaxed pt-2">
                  {selectedMovie.overview || 'No extended synopsis available from TMDB repository.'}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const name = selectedMovie.title;
                      setSelectedMovie(null);
                      onOpenIntelligence(name);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>AI Box Office Projection</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TMDB TV Detail Modal */}
      {selectedTV && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedTV(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={getTMDBImageUrl(selectedTV.poster_path, 'w500')}
                alt={selectedTV.name || selectedTV.original_name}
                className="w-full sm:w-48 aspect-[2/3] object-cover rounded-xl border border-[#4d4635]/30 shadow-lg"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 font-bold">
                    TRENDING TV SHOW
                  </span>
                  <span className="text-xs font-mono text-[#99907c]">
                    ID #{selectedTV.id}
                  </span>
                </div>

                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6]">
                  {selectedTV.name || selectedTV.original_name}
                </h2>

                <div className="flex flex-wrap gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1 text-[#f2ca50]">
                    <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                    <strong className="text-sm">{selectedTV.vote_average?.toFixed(1)}/10</strong>
                    <span className="text-[#99907c]">({selectedTV.vote_count} votes)</span>
                  </div>
                  <div className="text-[#d0c5af]">
                    First Aired: <strong>{selectedTV.first_air_date || 'TBD'}</strong>
                  </div>
                  {selectedTV.origin_country && selectedTV.origin_country[0] && (
                    <div className="text-[#10B981]">
                      Country: <strong className="uppercase">{selectedTV.origin_country[0]}</strong>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#d0c5af] font-light leading-relaxed pt-2">
                  {selectedTV.overview || 'No extended synopsis available from TMDB repository.'}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const name = selectedTV.name || selectedTV.original_name;
                      setSelectedTV(null);
                      onOpenIntelligence(name);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>AI Show Intelligence</span>
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
