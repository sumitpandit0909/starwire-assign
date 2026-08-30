import React, { useState, useEffect } from 'react';
import { Star, NewsBrief, TMDBPerson, TMDBMovie } from '../../types';
import {
  getTMDBImageUrl,
  fetchPopularPeople,
  fetchTrendingMovies,
} from '../../services/tmdbService';

interface WatchlistViewProps {
  followingStars: Star[];
  watchlistNews: NewsBrief[];
  onSelectStar: (starId: string) => void;
  onSelectNews: (newsId: string) => void;
  onUnfollowStar: (starId: string, e: React.MouseEvent) => void;
  onRemoveBookmark: (newsId: string) => void;
  onExploreStars: () => void;
  onOpenIntelligence?: (starName?: string) => void;
  activeSubTab: 'following' | 'watchlist';
  setActiveSubTab: (tab: 'following' | 'watchlist') => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  followingStars,
  watchlistNews,
  onSelectStar,
  onSelectNews,
  onUnfollowStar,
  onRemoveBookmark,
  onExploreStars,
  onOpenIntelligence,
  activeSubTab,
  setActiveSubTab,
}) => {
  const [recommendedPeople, setRecommendedPeople] = useState<TMDBPerson[]>([]);
  const [trendingWatchlistMovies, setTrendingWatchlistMovies] = useState<TMDBMovie[]>([]);
  const [loadingTMDB, setLoadingTMDB] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadWatchlistTMDB() {
      setLoadingTMDB(true);
      try {
        const [peopleRes, moviesRes] = await Promise.all([
          fetchPopularPeople(1),
          fetchTrendingMovies('week', 1),
        ]);
        if (isMounted) {
          setRecommendedPeople(peopleRes.results?.slice(0, 6) || []);
          setTrendingWatchlistMovies(moviesRes.results?.slice(0, 4) || []);
        }
      } catch (e) {
        console.warn('TMDB Watchlist load error:', e);
      } finally {
        if (isMounted) setLoadingTMDB(false);
      }
    }
    loadWatchlistTMDB();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="watchlist-view-container" className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#4d4635]/25 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6]">
              {activeSubTab === 'following' ? 'Monitored Talent Dossiers' : 'Watchlist & Intelligence Archives'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              LIVE SYNC
            </span>
          </div>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Your customized surveillance feeds for talent trajectories, market briefs, and live TMDB tracking.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 bg-[#1c1b1b] p-1.5 rounded-2xl border border-[#4d4635]/30">
          <button
            onClick={() => setActiveSubTab('following')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeSubTab === 'following'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Following ({followingStars.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeSubTab === 'watchlist'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">bookmark</span>
            <span>Saved Briefs ({watchlistNews.length})</span>
          </button>
        </div>
      </div>

      {/* SubTab 1: Following Stars */}
      {activeSubTab === 'following' && (
        <div className="space-y-10">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
                Actively Monitored Talent Profiles ({followingStars.length})
              </span>
              <button
                onClick={onExploreStars}
                className="text-xs font-mono text-[#f2ca50] hover:underline flex items-center gap-1"
              >
                <span>+ Follow More Stars from TMDB</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {followingStars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {followingStars.map((star) => (
                  <div
                    key={star.id}
                    onClick={() => onSelectStar(star.id)}
                    className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl overflow-hidden p-5 flex flex-col justify-between cursor-pointer group transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={star.avatarImage}
                        alt={star.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#f2ca50]/40 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#f2ca50] tracking-wider block">
                          {star.category}
                        </span>
                        <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-tight">
                          {star.name}
                        </h3>
                        <p className="text-xs text-[#d0c5af] font-mono mt-0.5">{star.roles[0]}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#4d4635]/20 text-center">
                      <div>
                        <span className="text-[10px] text-[#99907c] block font-mono">SCORE</span>
                        <span className="text-sm font-bold text-[#f2ca50] font-mono">{star.starScore}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#99907c] block font-mono">BUZZ</span>
                        <span className="text-sm font-bold text-[#10B981] font-mono">+{star.buzzDelta}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#99907c] block font-mono">REACH</span>
                        <span className="text-sm font-bold text-[#FAF9F6] font-mono">{star.reach}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStar(star.id);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] text-xs font-mono uppercase tracking-wider transition-all font-bold"
                      >
                        View Dossier
                      </button>
                      <button
                        onClick={(e) => onUnfollowStar(star.id, e)}
                        className="px-3 py-2 rounded-xl border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10 text-xs font-mono transition-colors"
                        title="Unfollow Talent"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-[#1c1b1b] rounded-2xl border border-[#4d4635]/30 space-y-4 shadow-xl">
                <span className="material-symbols-outlined text-[48px] text-[#d0c5af]/40">
                  person_add
                </span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6]">No Talent Followed Yet</h3>
                <p className="text-sm text-[#d0c5af] max-w-md mx-auto font-light">
                  Follow stars from the live TMDB database or Explore Stars index to monitor real-time score shifts.
                </p>
                <button
                  onClick={onExploreStars}
                  className="px-6 py-2.5 rounded-xl bg-[#f2ca50] text-[#131313] text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#d4af37] transition-all"
                >
                  Browse TMDB Star Index
                </button>
              </div>
            )}
          </div>

          {/* TMDB Recommended Talent Spotlight */}
          {recommendedPeople.length > 0 && (
            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#f2ca50] uppercase tracking-widest block font-bold">
                    TMDB LIVE SPOTLIGHT
                  </span>
                  <h3 className="font-headline-md text-lg text-[#FAF9F6]">
                    Recommended Trending Talent to Follow
                  </h3>
                </div>
                <button
                  onClick={onExploreStars}
                  className="text-xs font-mono text-[#f2ca50] hover:underline"
                >
                  View All TMDB Stars
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendedPeople.map((person) => (
                  <div
                    key={person.id}
                    onClick={onExploreStars}
                    className="p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 hover:border-[#f2ca50] transition-all cursor-pointer group flex flex-col items-center text-center"
                  >
                    <img
                      src={getTMDBImageUrl(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-14 h-14 rounded-full object-cover border border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors mb-2"
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Saved News Briefs & Watchlist */}
      {activeSubTab === 'watchlist' && (
        <div className="space-y-10">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">
                Saved Executive Intelligence Briefs ({watchlistNews.length})
              </span>
            </div>

            {watchlistNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {watchlistNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectNews(item.id)}
                    className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl overflow-hidden p-5 flex gap-4 cursor-pointer group transition-all shadow-xl"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-28 h-28 rounded-xl object-cover shrink-0 border border-[#4d4635]/30 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span
                            className="text-[10px] font-mono font-bold uppercase tracking-widest"
                            style={{ color: item.categoryColor }}
                          >
                            {item.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveBookmark(item.id);
                            }}
                            className="text-xs text-[#99907c] hover:text-[#EF4444]"
                            title="Remove from Watchlist"
                          >
                            ✕
                          </button>
                        </div>
                        <h4 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-2 mt-1">
                          {item.title}
                        </h4>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#d0c5af] pt-2 border-t border-[#4d4635]/15">
                        <span>{item.timestamp}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-[#1c1b1b] rounded-2xl border border-[#4d4635]/30 space-y-4 shadow-xl">
                <span className="material-symbols-outlined text-[48px] text-[#d0c5af]/40">
                  bookmark_border
                </span>
                <h3 className="font-headline-md text-xl text-[#FAF9F6]">No Saved Intelligence Briefs</h3>
                <p className="text-sm text-[#d0c5af] max-w-md mx-auto font-light">
                  Save crucial industry reports, theatrical data, and box office deep-dives from the dashboard or news stream.
                </p>
              </div>
            )}
          </div>

          {/* TMDB Trending Movies Watchlist Radar */}
          {trendingWatchlistMovies.length > 0 && (
            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#f2ca50] uppercase tracking-widest block font-bold">
                    TMDB THEATRICAL RADAR
                  </span>
                  <h3 className="font-headline-md text-lg text-[#FAF9F6]">
                    Global Box Office Trending Releases
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingWatchlistMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 hover:border-[#f2ca50] transition-all flex gap-3 items-center group"
                  >
                    <img
                      src={getTMDBImageUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      className="w-12 aspect-[2/3] rounded-lg object-cover border border-[#4d4635]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors truncate">
                        {movie.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#f2ca50] mt-0.5">
                        ★ {movie.vote_average?.toFixed(1)}/10
                      </div>
                      <div className="text-[10px] text-[#99907c] font-mono">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'Upcoming'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
