import React, { useState, useEffect } from 'react';
import { Star, TMDBPerson, TMDBMovie } from '../../types';
import {
  getTMDBImageUrl,
  fetchTrendingPeople,
  fetchPopularPeople,
  fetchTrendingMovies,
} from '../../services/tmdbService';

interface TrendingViewProps {
  stars: Star[];
  onSelectStar: (starId: string) => void;
  onOpenIntelligence: (starName?: string) => void;
}

export const TrendingView: React.FC<TrendingViewProps> = ({
  stars,
  onSelectStar,
  onOpenIntelligence,
}) => {
  const [activeTab, setActiveTab] = useState<'tmdb_people' | 'tmdb_movies' | 'starscore'>('tmdb_people');
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');
  
  // Real TMDB data states
  const [trendingPeople, setTrendingPeople] = useState<TMDBPerson[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Fetch TMDB live data
  useEffect(() => {
    let isMounted = true;
    async function loadTrendingTMDB() {
      setLoading(true);
      try {
        if (activeTab === 'tmdb_people') {
          const res = await fetchTrendingPeople(1);
          if (isMounted) {
            setTrendingPeople(res.results || []);
          }
        } else if (activeTab === 'tmdb_movies') {
          const res = await fetchTrendingMovies(timeWindow, 1);
          if (isMounted) {
            setTrendingMovies(res.results || []);
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
  }, [activeTab, timeWindow]);

  const sortedStars = [...stars].sort((a, b) => b.buzzDelta - a.buzzDelta);

  return (
    <div id="trending-view-container" className="space-y-8 animate-fade-in">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6]">
              Real-Time Trending &amp; Momentum
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono flex items-center gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
              TMDB LIVE STREAM
            </span>
          </div>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Live velocity surges, global talent popularity, and weekly box office momentum powered by TMDB API.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#1c1b1b] p-1.5 rounded-2xl border border-[#4d4635]/30">
          <button
            onClick={() => setActiveTab('tmdb_people')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'tmdb_people'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>TMDB Trending Talent</span>
          </button>

          <button
            onClick={() => setActiveTab('tmdb_movies')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'tmdb_movies'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">movie</span>
            <span>TMDB Trending Movies</span>
          </button>

          <button
            onClick={() => setActiveTab('starscore')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'starscore'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">insights</span>
            <span>StarScore™ Surge</span>
          </button>
        </div>
      </div>

      {/* TMDB TRENDING PEOPLE VIEW */}
      {activeTab === 'tmdb_people' && (
        <div className="space-y-8">
          {/* Top 3 Live Talent Podium */}
          {!loading && trendingPeople.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingPeople.slice(0, 3).map((person, idx) => (
                <div
                  key={person.id}
                  className="bg-[#1c1b1b] border border-[#f2ca50]/30 hover:border-[#f2ca50] rounded-2xl p-6 relative overflow-hidden group transition-all flex flex-col justify-between shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2ca50]/10 rounded-bl-full blur-xl" />
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-3xl font-bold text-[#f2ca50]">#{idx + 1}</span>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
                      TMDB LIVE
                    </span>
                  </div>

                  <div className="flex items-center gap-4 my-2">
                    <img
                      src={getTMDBImageUrl(person.profile_path, 'w185')}
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

                  <div className="mt-3 text-xs text-[#d0c5af] font-light line-clamp-1">
                    Known for: <strong className="text-[#FAF9F6] font-normal">{person.known_for?.map(k => k.title || k.name).join(', ') || 'N/A'}</strong>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#4d4635]/25 flex justify-between items-center">
                    <span className="text-xs font-mono text-[#d0c5af]">
                      TMDB Popularity: <strong className="text-[#f2ca50]">{person.popularity?.toFixed(1)}</strong>
                    </span>
                    <button
                      onClick={() => onOpenIntelligence(person.name)}
                      className="text-xs font-mono text-[#f2ca50] hover:underline flex items-center gap-1"
                    >
                      <span>AI Intelligence</span>
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full TMDB Live Table */}
          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 overflow-x-auto shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#4d4635]/30">
              <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
                TMDB Global Talent Popularity Index (Live API)
              </span>
              <span className="text-xs font-mono text-[#10B981]">
                {trendingPeople.length} Stars Loaded
              </span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-[#d0c5af] font-mono text-sm">
                Fetching live trending talent from TMDB...
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#4d4635]/30 text-[#99907c] uppercase tracking-wider">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Talent Profile</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Top Known For Works</th>
                    <th className="pb-3">TMDB Popularity</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4d4635]/15">
                  {trendingPeople.map((person, i) => (
                    <tr
                      key={person.id}
                      className="hover:bg-[#201f1f] transition-colors group"
                    >
                      <td className="py-4 pl-2 font-bold text-[#f2ca50]">#{i + 1}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getTMDBImageUrl(person.profile_path, 'w185')}
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
                              ID #{person.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-[#d0c5af]">
                        {person.known_for_department || 'Acting'}
                      </td>
                      <td className="py-4 text-[#d0c5af] max-w-xs truncate">
                        {person.known_for?.map(k => k.title || k.name).join(', ') || 'N/A'}
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#f2ca50]/15 text-[#f2ca50] font-bold border border-[#f2ca50]/30">
                          ★ {person.popularity?.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 text-right pr-2">
                        <button
                          onClick={() => onOpenIntelligence(person.name)}
                          className="px-3 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] transition-all font-bold"
                        >
                          AI Intel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TMDB TRENDING MOVIES VIEW */}
      {activeTab === 'tmdb_movies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-[#d0c5af]">
              Live TMDB Theatrical Window:
            </div>
            <div className="flex items-center gap-2 bg-[#1c1b1b] p-1 rounded-xl border border-[#4d4635]/30">
              <button
                onClick={() => setTimeWindow('day')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  timeWindow === 'day' ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af]'
                }`}
              >
                Today (24H)
              </button>
              <button
                onClick={() => setTimeWindow('week')}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  timeWindow === 'week' ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af]'
                }`}
              >
                This Week (7D)
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-[#d0c5af] font-mono text-sm">
              Loading TMDB trending movies stream...
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
                      {movie.release_date ? movie.release_date.split('-')[0] : 'Upcoming'}
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
                      <span className="text-[#99907c]">Votes: {movie.vote_count}</span>
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

      {/* STARSCORE PROPRIETARY VIEW */}
      {activeTab === 'starscore' && (
        <div className="space-y-8">
          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedStars.slice(0, 3).map((star, idx) => (
              <div
                key={star.id}
                onClick={() => onSelectStar(star.id)}
                className="bg-[#1c1b1b] border border-[#f2ca50]/30 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-[#f2ca50] transition-all flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f2ca50]/10 rounded-bl-full blur-xl" />
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-3xl font-bold text-[#f2ca50]">#{idx + 1}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                    +{star.buzzDelta}% SURGE
                  </span>
                </div>

                <div className="flex items-center gap-4 my-2">
                  <img
                    src={star.avatarImage}
                    alt={star.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#f2ca50]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                      {star.name}
                    </h3>
                    <p className="text-xs text-[#d0c5af]">{star.category} • {star.industry}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#4d4635]/25 flex justify-between items-center">
                  <span className="text-xs font-mono text-[#d0c5af]">StarScore: <strong className="text-[#f2ca50]">{star.starScore}</strong></span>
                  <span className="text-xs font-mono text-[#FAF9F6]">Reach: <strong>{star.reach}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Trending Table */}
          <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#4d4635]/30 text-[#99907c] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Rank</th>
                  <th className="pb-3">Talent</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">StarScore</th>
                  <th className="pb-3">24h Velocity</th>
                  <th className="pb-3">Sentiment</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4d4635]/15">
                {sortedStars.map((star, i) => (
                  <tr
                    key={star.id}
                    onClick={() => onSelectStar(star.id)}
                    className="hover:bg-[#201f1f] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-2 font-bold text-[#f2ca50]">#{i + 1}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={star.avatarImage}
                          alt={star.name}
                          className="w-9 h-9 rounded-lg object-cover border border-[#4d4635]/40"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-headline-sm text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors block">
                            {star.name}
                          </span>
                          <span className="text-[10px] text-[#99907c]">{star.roles.join(', ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-[#d0c5af]">{star.category}</td>
                    <td className="py-4">
                      <span className="font-bold text-[#f2ca50]">{star.starScore}</span>
                      <span className="text-[#99907c]">/100</span>
                    </td>
                    <td className="py-4 text-[#10B981] font-bold">+{star.buzzDelta}%</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px]">
                        {star.activeSignals.audienceSentiment}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenIntelligence(star.name);
                        }}
                        className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#d0c5af] hover:text-[#131313] transition-colors"
                        title="AI Velocity Intelligence"
                      >
                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TMDB Movie Detail Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all"
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
                    TMDB TRENDING
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider hover:bg-[#d4af37] transition-all"
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
    </div>
  );
};
