import React, { useState } from 'react';
import { Star, TMDBMovie } from '../../types';
import { getTMDBImageUrl } from '../../services/tmdbService';
import { useMovies } from '../../hooks/useMovies';

interface MoviesViewProps {
  stars: Star[];
  onSelectStar: (starId: string) => void;
  onOpenIntelligence: (starName?: string) => void;
}

export const MoviesView: React.FC<MoviesViewProps> = ({
  stars,
  onSelectStar,
  onOpenIntelligence,
}) => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'tmdbTrending' | 'tmdbIndian' | 'tmdbNowPlaying' | 'tmdbUpcoming'>('benchmarks');
  const categoryParam: 'indian' | 'trending' | 'now_playing' | 'upcoming' = activeTab === 'tmdbIndian' ? 'indian' : activeTab === 'tmdbNowPlaying' ? 'now_playing' : activeTab === 'tmdbUpcoming' ? 'upcoming' : 'trending';
  const { movies: tmdbMovies, loading: isLoading } = useMovies(categoryParam);
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Aggregate all curated blockbuster movies from star dossiers
  const allFilms = stars.flatMap((star) =>
    (star.films || []).map((film) => ({
      ...film,
      starName: star.name,
      starId: star.id,
      category: star.category,
      avatar: star.avatarImage,
    }))
  );

  return (
    <div id="movies-view-container" className="space-y-8 animate-fade-in">
      {/* Header & Live TMDB Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-wordmark text-xs text-[#f2ca50] tracking-[0.3em] uppercase">BOX OFFICE TELEMETRY</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
              TMDB LIVE FEED
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] font-bold">
            Theatrical Box Office &amp; Pre-Sales Tracker
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light max-w-3xl">
            Tracking worldwide theatrical gross, Return on Investment (ROI), live TMDB ticket telemetry, and multi-territory receipts.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-[#1c1b1b] p-1.5 rounded-xl border border-[#4d4635]/30">
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'benchmarks'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            ₹1,000 Cr+ Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('tmdbIndian')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'tmdbIndian'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Pan-Indian Live TMDB
          </button>
          <button
            onClick={() => setActiveTab('tmdbTrending')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'tmdbTrending'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Trending Global
          </button>
          <button
            onClick={() => setActiveTab('tmdbNowPlaying')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'tmdbNowPlaying'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Now in Theatres
          </button>
          <button
            onClick={() => setActiveTab('tmdbUpcoming')}
            className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
              activeTab === 'tmdbUpcoming'
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'text-[#d0c5af] hover:text-[#FAF9F6]'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {activeTab === 'benchmarks' ? (
        /* Curated ₹1,000 Cr+ Benchmarks Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFilms.map((film, idx) => (
            <div
              key={`${film.title}-${idx}`}
              className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/50 rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 uppercase font-bold">
                    {film.verdict}
                  </span>
                  <span className="text-xs font-mono text-[#d0c5af]">{film.year}</span>
                </div>

                <h3 className="font-headline-md text-2xl text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors font-bold">
                  {film.title}
                </h3>

                <div
                  onClick={() => onSelectStar(film.starId)}
                  className="flex items-center gap-2.5 mt-3 cursor-pointer text-xs text-[#d0c5af] hover:text-[#f2ca50]"
                >
                  <img
                    src={film.avatar}
                    alt={film.starName}
                    className="w-7 h-7 rounded-full object-cover border border-[#f2ca50]/40"
                    referrerPolicy="no-referrer"
                  />
                  <span>Lead Talent: <strong className="text-[#FAF9F6]">{film.starName}</strong></span>
                </div>

                {film.director && (
                  <p className="text-[11px] font-mono text-[#99907c] mt-2">
                    Directed by: {film.director}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#4d4635]/25">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Worldwide Gross</span>
                    <span className="text-xl font-bold font-mono text-[#f2ca50]">{film.boxOffice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#99907c] uppercase block">Estimated ROI</span>
                    <span className="text-xl font-bold font-mono text-[#10B981]">{film.roi}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#4d4635]/15">
                  <span className="text-[11px] font-mono text-[#d0c5af]">
                    Audience Sentiment: <strong className="text-[#10B981]">{film.sentiment}%</strong>
                  </span>
                  <button
                    onClick={() => onOpenIntelligence(film.title)}
                    className="text-xs font-mono text-[#f2ca50] hover:underline flex items-center gap-1"
                  >
                    <span>AI Intel</span>
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-3 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs text-[#d0c5af]">Loading live records from TMDB...</p>
        </div>
      ) : tmdbMovies.length > 0 ? (
        /* Live TMDB Movies Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tmdbMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50]/60 rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all hover:scale-102 group shadow-xl"
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

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-[#131313]/90 text-[#f2ca50] border border-[#f2ca50]/40 backdrop-blur-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}</span>
                  </span>

                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/80 text-[#d0c5af] backdrop-blur-sm uppercase">
                    {movie.original_language || 'EN'}
                  </span>
                </div>

                {/* Release Date */}
                <div className="absolute bottom-3 left-3 text-[11px] font-mono text-[#d0c5af] bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                  {movie.release_date || 'Upcoming'}
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1 font-semibold">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-[#d0c5af] mt-1.5 line-clamp-2 font-light leading-relaxed">
                    {movie.overview || 'No synopsis recorded in TMDB registry.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#99907c]">Pop: {Math.round(movie.popularity)}</span>
                  <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Intel</span>
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
          <p className="text-xs text-[#d0c5af]">Try switching to Pan-Indian Live TMDB or Global Trending.</p>
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
              className="absolute top-4 right-4 p-2 rounded-full bg-[#2a2a2a] text-[#FAF9F6] hover:text-[#f2ca50] transition-colors"
              aria-label="Close"
            >
              ✕
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f2ca50] hover:bg-[#ffe088] text-[#131313] font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    <span>Run Gemini AI Box Office Intel</span>
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
