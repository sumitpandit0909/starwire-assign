import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewsBrief, TMDBMovie } from '../../types';
import { getTMDBImageUrl, fetchTrendingMovies } from '../../services/tmdbService';

interface WatchlistViewProps {
  watchlistNews: NewsBrief[];
  onSelectNews: (newsId: string) => void;
  onRemoveBookmark: (newsId: string) => void;
  onOpenIntelligence?: (title?: string) => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistNews,
  onSelectNews,
  onRemoveBookmark,
}) => {
  const navigate = useNavigate();
  const [trendingWatchlistMovies, setTrendingWatchlistMovies] = useState<TMDBMovie[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadWatchlistTMDB() {
      try {
        const moviesRes = await fetchTrendingMovies('week', 1);
        if (isMounted) {
          setTrendingWatchlistMovies(moviesRes.results?.slice(0, 4) || []);
        }
      } catch (e) {
        console.warn('TMDB Watchlist load error:', e);
      }
    }
    loadWatchlistTMDB();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div id="watchlist-view-container" className="space-y-10 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#4d4635]/25 pb-6">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6]">
            Watchlist &amp; Saved Intelligence
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Your saved industry reports, executive news briefs, and box office intelligence archives.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1c1b1b] px-4 py-2 rounded-xl border border-[#4d4635]/30 text-xs font-mono">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">bookmark</span>
          <span className="text-[#FAF9F6] font-bold">{watchlistNews.length} Saved Briefs</span>
        </div>
      </div>

      {/* Saved News Briefs */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#4d4635]/30 pb-3">
          <h2 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">article</span>
            <span>Saved Executive Briefs</span>
          </h2>
          <span className="text-xs font-mono text-[#10B981]">
            {watchlistNews.length} Bookmarks
          </span>
        </div>

        {watchlistNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchlistNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item.id)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden p-5 flex gap-4 cursor-pointer group transition-all shadow-xl"
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
                        className="text-xs text-[#99907c] hover:text-[#EF4444] p-1 transition-colors"
                        title="Remove from Watchlist"
                      >
                        ✕
                      </button>
                    </div>
                    <h4 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-2 mt-1 font-semibold">
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
              Bookmark crucial industry news, box office deep-dives, and market briefs from the dashboard or news feed.
            </p>
          </div>
        )}
      </div>

      {/* TMDB Trending Movies Watchlist Radar */}
      {trendingWatchlistMovies.length > 0 && (
        <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 space-y-4 shadow-xl pt-6">
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
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="p-3 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 hover:border-[#f2ca50] transition-all flex gap-3 items-center group cursor-pointer"
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
  );
};
