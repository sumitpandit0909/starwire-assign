import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TMDBMovie } from '../../types';
import { getTMDBImageUrl, fetchMovieDetails, fetchSimilarMovies } from '../../services/tmdbService';

interface MovieDetailsViewProps {
  movieId: string;
  onOpenIntelligence: (movieTitle?: string) => void;
}

export const MovieDetailsView: React.FC<MovieDetailsViewProps> = ({
  movieId,
  onOpenIntelligence,
}) => {
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any | null>(null);
  const [similarMovies, setSimilarMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [details, similarRes] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchSimilarMovies(movieId),
        ]);

        if (isMounted) {
          setMovie(details);
          setSimilarMovies(similarRes.results?.slice(0, 4) || []);
        }
      } catch (err) {
        console.warn('Error loading movie details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-[#f2ca50] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-sm text-[#d0c5af]">Fetching live TMDB movie records...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-headline-lg text-2xl text-[#FAF9F6]">Movie Not Found</h2>
        <p className="text-xs font-mono text-[#d0c5af]">Unable to retrieve TMDB details for ID #{movieId}.</p>
        <button
          onClick={() => navigate('/movies')}
          className="px-4 py-2 rounded-xl bg-[#f2ca50] text-[#131313] font-bold text-xs cursor-pointer"
        >
          ← Back to Movies
        </button>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (val?: number) => {
    if (!val || val === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Format runtime helper
  const formatRuntime = (mins?: number) => {
    if (!mins) return 'N/A';
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs}h ${m}m` : `${m}m`;
  };

  return (
    <div id="movie-details-view" className="space-y-12 animate-fade-in pb-16">
      {/* Back Button Navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#d0c5af] hover:text-[#f2ca50] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1c1b1b] border border-[#4d4635]/30 shadow-2xl">
        {movie.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <img
              src={getTMDBImageUrl(movie.backdrop_path, 'original', 'backdrop')}
              alt={movie.title}
              className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-[#1c1b1b]/80 to-transparent" />
          </div>
        )}

        {/* Content Body */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Image */}
          <div className="w-full sm:w-64 aspect-[2/3] shrink-0 rounded-2xl overflow-hidden border-2 border-[#f2ca50]/40 shadow-2xl bg-[#201f1f]">
            <img
              src={getTMDBImageUrl(movie.poster_path, 'w500', 'poster')}
              alt={movie.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Details Content */}
          <div className="flex-1 space-y-5">
            <div>
              {movie.status && (
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 font-bold">
                  {movie.status}
                </span>
              )}
              <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl text-[#FAF9F6] font-bold mt-2 tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-sm font-mono text-[#f2ca50] italic mt-1 font-light">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Genres Pill List */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((g: any) => (
                  <span
                    key={g.id}
                    className="text-xs font-mono px-3 py-1 rounded-lg bg-[#2a2a2a] text-[#d0c5af] border border-[#4d4635]/40"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#131313]/80 border border-[#4d4635]/30 backdrop-blur-md text-xs font-mono">
              <div>
                <span className="text-[#99907c] block text-[10px] uppercase">TMDB Rating</span>
                <span className="text-base font-bold text-[#f2ca50] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px] fill-current">star</span>
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'} / 10</span>
                </span>
                <span className="text-[10px] text-[#99907c]">({movie.vote_count} votes)</span>
              </div>

              <div>
                <span className="text-[#99907c] block text-[10px] uppercase">Release Date</span>
                <span className="text-sm font-bold text-[#FAF9F6] mt-0.5 block">
                  {movie.release_date || 'TBA'}
                </span>
              </div>

              <div>
                <span className="text-[#99907c] block text-[10px] uppercase">Runtime</span>
                <span className="text-sm font-bold text-[#FAF9F6] mt-0.5 block">
                  {formatRuntime(movie.runtime)}
                </span>
              </div>

              <div>
                <span className="text-[#99907c] block text-[10px] uppercase">Origin</span>
                <span className="text-sm font-bold text-[#10B981] mt-0.5 block uppercase">
                  {movie.origin_country?.[0] || movie.original_language || 'Global'}
                </span>
              </div>
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider font-bold">Synopsis</h3>
              <p className="text-sm sm:text-base text-[#d0c5af] font-light leading-relaxed">
                {movie.overview || 'No extended synopsis available from TMDB repository.'}
              </p>
            </div>

            {/* Financials & Production */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 text-xs font-mono">
                <span className="text-[#99907c] block text-[10px] uppercase">Budget</span>
                <span className="text-base font-bold text-[#FAF9F6]">{formatCurrency(movie.budget)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#201f1f] border border-[#4d4635]/20 text-xs font-mono">
                <span className="text-[#99907c] block text-[10px] uppercase">Worldwide Revenue</span>
                <span className="text-base font-bold text-[#10B981]">{formatCurrency(movie.revenue)}</span>
              </div>
            </div>

            {/* Production Companies */}
            {movie.production_companies && movie.production_companies.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#99907c] uppercase block mb-2">Production Studios</span>
                <div className="flex flex-wrap items-center gap-3">
                  {movie.production_companies.map((co: any) => (
                    <div key={co.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#201f1f] border border-[#4d4635]/20 text-xs font-mono text-[#d0c5af]">
                      {co.logo_path && (
                        <img
                          src={getTMDBImageUrl(co.logo_path, 'w185', 'logo')}
                          alt={co.name}
                          className="h-4 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <span>{co.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onOpenIntelligence(movie.title)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f2ca50] hover:bg-[#d4af37] text-[#131313] font-bold font-data-label text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>AI Box Office Projection</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section (Top 4 Similar Movies) */}
      <div className="space-y-6 pt-6 border-t border-[#4d4635]/30">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold">
            Similar Movies
          </h2>
          <span className="text-xs font-mono text-[#d0c5af]">
            4 Recommended Films
          </span>
        </div>

        {similarMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {similarMovies.map((simMovie, idx) => (
              <div
                key={simMovie.id}
                onClick={() => navigate(`/movie/${simMovie.id}`)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer transition-all hover:scale-102 group shadow-xl"
              >
                {/* Poster Artwork with Score Badge */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#201f1f]">
                  <img
                    src={getTMDBImageUrl(simMovie.poster_path, 'w500', 'poster')}
                    alt={simMovie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent opacity-80" />

                  {/* Rating Badge */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold backdrop-blur-sm">
                    <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                    <span>{simMovie.vote_average ? simMovie.vote_average.toFixed(1) : 'NR'}</span>
                  </div>

                  {/* Release Date */}
                  <div className="absolute bottom-2.5 left-2.5 text-[11px] font-mono text-[#d0c5af] bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs">
                    {simMovie.release_date || 'Upcoming'}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-1 font-semibold">
                      {simMovie.title}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#4d4635]/25 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#99907c]">#{idx + 1} Similar</span>
                    <span className="text-[#f2ca50] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold">
                      <span>View</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs font-mono text-[#d0c5af]">No similar movies returned by TMDB for this title.</p>
        )}
      </div>
    </div>
  );
};
