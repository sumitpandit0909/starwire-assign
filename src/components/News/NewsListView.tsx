import React, { useState, useEffect } from 'react';
import { NewsBrief, TMDBMovie } from '../../types';
import {
  getTMDBImageUrl,
  fetchIndianCinema,
  fetchNowPlaying,
  fetchUpcoming,
} from '../../services/tmdbService';

interface NewsListViewProps {
  news: NewsBrief[];
  onSelectNews: (newsId: string) => void;
  watchlistIds: string[];
  onToggleBookmark: (newsId: string, e: React.MouseEvent) => void;
  onOpenIntelligence?: (movieName?: string) => void;
}

export const NewsListView: React.FC<NewsListViewProps> = ({
  news,
  onSelectNews,
  watchlistIds,
  onToggleBookmark,
  onOpenIntelligence,
}) => {
  const [wireType, setWireType] = useState<'briefs' | 'tmdb_releases'>('briefs');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [tmdbReleases, setTmdbReleases] = useState<TMDBMovie[]>([]);
  const [loadingTmdb, setLoadingTmdb] = useState<boolean>(false);
  const [tmdbTab, setTmdbTab] = useState<'now_playing' | 'upcoming' | 'indian'>('indian');

  const categories = ['ALL', 'BOX OFFICE', 'PRODUCTION', 'CASTING', 'OTT & STREAMING'];

  const filteredNews = selectedCategory === 'ALL'
    ? news
    : news.filter((n) => n.category.toUpperCase() === selectedCategory);

  useEffect(() => {
    if (wireType !== 'tmdb_releases') return;
    let isMounted = true;
    async function loadTMDBReleases() {
      setLoadingTmdb(true);
      try {
        let res: { results: TMDBMovie[] } = { results: [] };
        if (tmdbTab === 'indian') {
          res = await fetchIndianCinema(1, 'release_date.desc', 'hi|ta|te|ml|kn');
        } else if (tmdbTab === 'now_playing') {
          res = await fetchNowPlaying(1);
        } else if (tmdbTab === 'upcoming') {
          res = await fetchUpcoming(1);
        }
        if (isMounted) {
          setTmdbReleases(res.results || []);
        }
      } catch (e) {
        console.warn('Error loading TMDB releases:', e);
      } finally {
        if (isMounted) setLoadingTmdb(false);
      }
    }
    loadTMDBReleases();
    return () => {
      isMounted = false;
    };
  }, [wireType, tmdbTab]);

  return (
    <div id="news-list-view-container" className="space-y-8 animate-fade-in">
      {/* Header & Source Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6]">
              Industry Intelligence &amp; Theatrical Wire
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              TMDB CONNECTED
            </span>
          </div>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Curated market analysis, studio developments, packaging rumors, and live TMDB release wire.
          </p>
        </div>

        {/* Wire Mode Switcher */}
        <div className="flex items-center bg-[#1c1b1b] p-1.5 rounded-2xl border border-[#4d4635]/30">
          <button
            onClick={() => setWireType('briefs')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              wireType === 'briefs'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">newspaper</span>
            <span>Executive Briefs</span>
          </button>

          <button
            onClick={() => setWireType('tmdb_releases')}
            className={`px-4 py-2 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5 ${
              wireType === 'tmdb_releases'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">theaters</span>
            <span>TMDB Live Release Wire</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE BRIEFS MODE */}
      {wireType === 'briefs' && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex gap-4 overflow-x-auto pb-2 border-b border-[#4d4635]/25 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-data-label text-xs uppercase tracking-wider pb-2 transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-bold'
                    : 'text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => {
              const isSaved = watchlistIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectNews(item.id)}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all shadow-xl"
                >
                  <div className="h-48 overflow-hidden relative bg-[#2a2a2a]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-black/30" />
                    <div className="absolute top-4 left-4">
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#131313]/90 border border-white/10"
                        style={{ color: item.categoryColor }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => onToggleBookmark(item.id, e)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center backdrop-blur-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isSaved ? 'bookmark_added' : 'bookmark'}
                      </span>
                    </button>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-headline-md text-xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#d0c5af] line-clamp-3 mt-2 font-light">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-[#d0c5af] pt-4 border-t border-[#4d4635]/20">
                      <span>{item.timestamp}</span>
                      <span>{item.readTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TMDB LIVE RELEASE WIRE MODE */}
      {wireType === 'tmdb_releases' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#4d4635]/25 pb-3">
            <div className="flex gap-4">
              {(
                [
                  { id: 'indian', label: 'Indian Cinema Releases' },
                  { id: 'now_playing', label: 'Global In Theatres' },
                  { id: 'upcoming', label: 'Anticipated Upcoming' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTmdbTab(tab.id)}
                  className={`font-data-label text-xs uppercase tracking-wider pb-2 transition-all whitespace-nowrap ${
                    tmdbTab === tab.id
                      ? 'text-[#f2ca50] border-b-2 border-[#f2ca50] font-bold'
                      : 'text-[#d0c5af] hover:text-[#f2ca50]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-[#10B981]">
              Live TMDB Telemetry
            </span>
          </div>

          {loadingTmdb ? (
            <div className="py-12 text-center text-xs font-mono text-[#d0c5af]">
              Connecting to TMDB release stream...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tmdbReleases.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative bg-[#201f1f]">
                    <img
                      src={getTMDBImageUrl(movie.backdrop_path || movie.poster_path, 'w500')}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-black/30" />

                    <div className="absolute top-3 left-3 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      ★ {movie.vote_average?.toFixed(1) || 'N/A'}/10
                    </div>

                    <div className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#FAF9F6] uppercase font-bold">
                      {movie.original_language}
                    </div>

                    <div className="absolute bottom-2 left-3 text-xs font-mono text-[#FAF9F6]">
                      {movie.release_date || 'TBD'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-[#d0c5af] line-clamp-3 mt-2 font-light leading-relaxed">
                        {movie.overview || 'Live TMDB theatrical profile and release telemetry.'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-mono text-[#d0c5af] pt-3 border-t border-[#4d4635]/20">
                      <span>Votes: {movie.vote_count || 0}</span>
                      {onOpenIntelligence && (
                        <button
                          onClick={() => onOpenIntelligence(movie.title)}
                          className="text-[#f2ca50] hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                          <span>AI Telemetry</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
