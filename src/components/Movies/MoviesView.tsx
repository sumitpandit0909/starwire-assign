import React, { useState } from 'react';
import { Star, TMDBMovie } from '../../types';
import { getTMDBImageUrl } from '../../services/tmdbService';
import { useMovies } from '../../hooks/useMovies';

interface MoviesViewProps {
  stars?: Star[];
  onSelectStar?: (starId: string) => void;
  onOpenIntelligence: (starName?: string) => void;
}

// Shimmer Skeleton Card Placeholder for Movies
const SkeletonMovieCard: React.FC = () => (
  <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-96">
    <div className="bg-[#2a2a2a] h-60 w-full" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-[#2a2a2a] rounded w-3/4" />
      <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
      <div className="h-8 bg-[#201f1f] rounded-xl mt-2" />
    </div>
  </div>
);

export const MoviesView: React.FC<MoviesViewProps> = ({
  onOpenIntelligence,
}) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'top_rated' | 'upcoming'>('popular');
  const { movies: tmdbMovies, loading: isLoading } = useMovies(activeTab);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  return (
    <div id="movies-view-container" className="space-y-8 animate-fade-in pb-12">
      {/* Header & Rightmost Tab Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
            Movies &amp; Box Office
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Discover popular films, top rated cinema classics, and upcoming theatrical releases from TMDB.
          </p>
        </div>

        {/* Clean 3 Tabs: Popular | Top Rated | Upcoming */}
        <div className="flex items-center bg-[#1c1b1b] p-1 rounded-xl border border-[#4d4635]/30 self-start md:self-auto ml-auto">
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'popular'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>Popular</span>
          </button>

          <button
            onClick={() => setActiveTab('top_rated')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'top_rated'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span>Top Rated</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Upcoming</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
        <span>
          {activeTab === 'popular'
            ? 'Popular Movies worldwide'
            : activeTab === 'top_rated'
            ? 'Top Rated Cinema All-Time'
            : 'Upcoming Theatrical Releases'}
        </span>
        <span>{tmdbMovies.length} Movies Loaded</span>
      </div>

      {/* Content Grid / Skeleton Loading */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonMovieCard key={n} />
          ))}
        </div>
      ) : tmdbMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {tmdbMovies.map((movie, idx) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all hover:scale-102 group shadow-xl"
            >
              {/* Poster Artwork with Score Badge */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#201f1f]">
                <img
                  src={getTMDBImageUrl(movie.poster_path, 'w500', 'poster')}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent opacity-80" />

                {/* Rank Badge */}
                <div className="absolute top-2.5 left-2.5 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold">
                  #{idx + 1}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                </div>

                {/* Release Date */}
                <div className="absolute bottom-2.5 left-2.5 text-[11px] font-mono text-[#d0c5af] bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                  {movie.release_date || 'Upcoming'}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1 font-semibold">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-[#99907c] mt-1.5 line-clamp-2 font-light leading-relaxed">
                    {movie.overview || 'No synopsis recorded in TMDB registry.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#99907c]">
                    {movie.popularity ? `Pop: ${Math.round(movie.popularity)}` : `Votes: ${movie.vote_count}`}
                  </span>
                  <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                    <span>Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 text-center space-y-2">
          <p className="text-[#FAF9F6] font-medium">No live TMDB results returned for this category.</p>
          <p className="text-xs text-[#d0c5af]">Try switching between Popular, Top Rated, or Upcoming.</p>
        </div>
      )}

      {/* Selected TMDB Movie Detail Modal */}
      {selectedMovie && (
        <div
          id="movies-tmdb-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="bg-[#1c1b1b] border border-[#f2ca50]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-5 p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={getTMDBImageUrl(selectedMovie.poster_path, 'w500', 'poster')}
                alt={selectedMovie.title}
                className="w-36 h-52 sm:w-48 sm:h-72 rounded-xl object-cover border border-[#f2ca50]/30 shadow-lg shrink-0 self-center sm:self-start"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#f2ca50] text-[#131313]">
                    ★ {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'NR'} / 10
                  </span>
                  <span className="text-xs font-mono text-[#d0c5af]">
                    ({selectedMovie.vote_count} Votes)
                  </span>
                </div>

                <h3 className="font-headline-md text-2xl md:text-3xl text-[#FAF9F6] leading-tight font-bold">
                  {selectedMovie.title}
                </h3>

                {selectedMovie.original_title !== selectedMovie.title && (
                  <p className="text-xs text-[#99907c] font-mono">
                    Original: {selectedMovie.original_title}
                  </p>
                )}

                <div className="text-xs font-mono text-[#d0c5af]">
                  Release: <strong>{selectedMovie.release_date || 'TBA'}</strong> · Lang: <strong>{selectedMovie.original_language?.toUpperCase()}</strong>
                </div>

                <p className="text-xs md:text-sm text-[#d0c5af] font-light leading-relaxed pt-2 border-t border-[#4d4635]/25">
                  {selectedMovie.overview || 'No synopsis available.'}
                </p>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const title = selectedMovie.title;
                      setSelectedMovie(null);
                      onOpenIntelligence(title);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
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
