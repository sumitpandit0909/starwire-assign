import React, { useState, useEffect } from 'react';
import { Star, NewsBrief, TMDBMovie, TMDBPerson } from '../../types';
import { searchTMDB, getTMDBImageUrl } from '../../services/tmdbService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: Star[];
  news: NewsBrief[];
  onSelectStar: (starId: string) => void;
  onSelectNews: (newsId: string) => void;
  onOpenIntelligence?: (targetName?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stars,
  news,
  onSelectStar,
  onSelectNews,
  onOpenIntelligence,
}) => {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'curated' | 'tmdb'>('all');
  const [tmdbResults, setTmdbResults] = useState<(TMDBMovie | TMDBPerson)[]>([]);
  const [isSearchingTMDB, setIsSearchingTMDB] = useState<boolean>(false);

  // Debounced TMDB Live Search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setTmdbResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingTMDB(true);
      try {
        const res = await searchTMDB(query, 'multi', 1);
        if (res.results) {
          setTmdbResults(res.results.slice(0, 6));
        }
      } catch (e) {
        console.error('TMDB Search error:', e);
      } finally {
        setIsSearchingTMDB(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredStars = query.trim()
    ? stars.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase()) ||
          s.industry.toLowerCase().includes(query.toLowerCase())
      )
    : stars.slice(0, 4);

  const filteredNews = query.trim()
    ? news.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
    : news.slice(0, 2);

  return (
    <div
      id="global-search-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        id="global-search-modal-content"
        className="bg-[#1c1b1b] border border-[#d4af37]/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden p-6 space-y-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.2em] uppercase font-bold">
              STARWIRE SEARCH MATRIX
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
              TMDB LIVE READY
            </span>
          </div>
          <button onClick={onClose} className="text-[#d0c5af] hover:text-[#FAF9F6] text-xs font-mono">
            ESC ✕
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="flex items-center gap-3 bg-[#2a2a2a] border border-[#4d4635]/40 rounded-xl px-4 py-3 focus-within:border-[#f2ca50]">
          <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search talent, films, TMDB global database, news..."
            className="w-full bg-transparent border-none text-[#FAF9F6] outline-none text-base font-body-md placeholder:text-[#d0c5af]/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#d0c5af] hover:text-[#FAF9F6] text-xs font-mono"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Mode Filters */}
        <div className="flex items-center gap-2 border-b border-[#4d4635]/25 pb-3">
          <button
            onClick={() => setSearchMode('all')}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
              searchMode === 'all' ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            All Intelligence ({filteredStars.length + tmdbResults.length})
          </button>
          <button
            onClick={() => setSearchMode('curated')}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
              searchMode === 'curated' ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Curated Dossiers ({filteredStars.length})
          </button>
          <button
            onClick={() => setSearchMode('tmdb')}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
              searchMode === 'tmdb' ? 'bg-[#f2ca50] text-[#131313] font-bold' : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            TMDB Global ({tmdbResults.length})
          </button>
        </div>

        {/* TMDB Live Results Section */}
        {(searchMode === 'all' || searchMode === 'tmdb') && query.trim().length >= 2 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-[#10B981] tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">public</span>
                <span>TMDB Global Database Results</span>
              </span>
              <span>{isSearchingTMDB ? 'Searching...' : `${tmdbResults.length} Found`}</span>
            </div>

            {tmdbResults.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {tmdbResults.map((item: any) => {
                  const isMovie = 'title' in item;
                  const title = isMovie ? item.title : item.name;
                  const imagePath = isMovie ? item.poster_path : item.profile_path;
                  const subtext = isMovie
                    ? `Movie · ${item.release_date?.split('-')[0] || 'TBA'} · ★ ${item.vote_average?.toFixed(1) || 'NR'}`
                    : `Talent · ${item.known_for_department || 'Actor'} · Pop: ${Math.round(item.popularity || 0)}`;

                  return (
                    <div
                      key={`${item.id}-${isMovie ? 'movie' : 'person'}`}
                      onClick={() => {
                        if (onOpenIntelligence) onOpenIntelligence(title);
                        onClose();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors group border border-transparent hover:border-[#10B981]/40"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={getTMDBImageUrl(imagePath, 'w185', isMovie ? 'poster' : 'profile')}
                          alt={title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#4d4635]/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-[#FAF9F6] group-hover:text-[#10B981] transition-colors">
                            {title}
                          </h4>
                          <p className="text-xs text-[#d0c5af]">{subtext}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-[#f2ca50] flex items-center gap-1">
                        <span>AI Intel</span>
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : isSearchingTMDB ? (
              <div className="p-3 text-center text-xs text-[#d0c5af] font-mono">
                Querying TMDB Gateway...
              </div>
            ) : null}
          </div>
        )}

        {/* Curated Talent Section */}
        {(searchMode === 'all' || searchMode === 'curated') && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs font-mono uppercase text-[#f2ca50] tracking-wider">
              <span>STARWIRE Curated Talent Dossiers</span>
              <span>{filteredStars.length} Found</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {filteredStars.map((star) => (
                <div
                  key={star.id}
                  onClick={() => {
                    onSelectStar(star.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors group border border-transparent hover:border-[#f2ca50]/30"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={star.avatarImage}
                      alt={star.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#f2ca50]/30"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors">
                        {star.name}
                      </h4>
                      <p className="text-xs text-[#d0c5af]">
                        {star.roles.join(' • ')} · {star.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-[#f2ca50]">
                      Score: {star.starScore}
                    </span>
                    <span className="text-[11px] font-mono text-[#10B981] block">
                      +{star.buzzDelta}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Intelligence Section */}
        {filteredNews.length > 0 && searchMode === 'all' && (
          <div className="space-y-3 pt-2 border-t border-[#4d4635]/25">
            <div className="text-xs font-mono uppercase text-[#d0c5af] tracking-wider">
              Industry Intelligence Briefs
            </div>
            <div className="space-y-2">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNews(item.id);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#201f1f] hover:bg-[#2a2a2a] cursor-pointer transition-colors text-xs space-y-1"
                >
                  <span className="text-[10px] font-mono font-bold" style={{ color: item.categoryColor }}>
                    {item.category}
                  </span>
                  <p className="font-medium text-[#FAF9F6] hover:text-[#f2ca50] transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
