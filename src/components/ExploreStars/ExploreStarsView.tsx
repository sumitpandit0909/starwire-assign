import React, { useState, useEffect } from 'react';
import { Star, TMDBPerson } from '../../types';
import {
  getTMDBImageUrl,
  fetchPopularPeople,
  searchTMDB,
} from '../../services/tmdbService';

interface ExploreStarsViewProps {
  stars?: Star[];
  onSelectStar: (starId: string) => void;
  followingIds: string[];
  onToggleFollow: (starId: string, e?: React.MouseEvent) => void;
  onOpenIntelligence?: (name?: string) => void;
}

// Convert Star objects to TMDBPerson format for fallback safety
function mapStarsToTMDBPeople(starsList?: Star[]): TMDBPerson[] {
  if (!starsList || starsList.length === 0) return [];
  return starsList.map((s, idx) => ({
    id: parseInt(s.tmdbId?.toString() || `${idx + 1000}`, 10) || idx + 1000,
    name: s.name,
    profile_path: s.avatarImage,
    popularity: s.starScore,
    known_for_department: s.roles[0] || 'Actor',
    known_for: (s.films || []).map((f, fIdx) => ({
      id: fIdx + 100,
      title: f.title,
      original_title: f.title,
      overview: `${s.name} stars in ${f.title}.`,
      poster_path: f.posterUrl || null,
      backdrop_path: null,
      release_date: `${f.year}-01-01`,
      vote_average: 8.0,
      vote_count: 500,
      popularity: 20,
      original_language: 'en',
    })),
  }));
}

// Shimmer Skeleton Loading Card
const SkeletonStarCard: React.FC = () => {
  return (
    <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-96">
      <div className="bg-[#2a2a2a] h-60 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#2a2a2a] rounded w-3/4" />
        <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
        <div className="h-9 bg-[#201f1f] rounded-xl mt-2" />
      </div>
    </div>
  );
};

export const ExploreStarsView: React.FC<ExploreStarsViewProps> = ({
  stars = [],
  onSelectStar,
  followingIds,
  onToggleFollow,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [people, setPeople] = useState<TMDBPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load TMDB People (Popular or Search Query)
  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      setLoading(true);
      const query = searchQuery.trim();

      try {
        if (query.length >= 2) {
          const res = await searchTMDB(query, 'person', page);
          if (isCurrent) {
            const results = (res.results as TMDBPerson[]) || [];
            setPeople(results);
            setTotalPages(Math.min(res.total_results ? Math.ceil(res.total_results / 20) : 1, 500));
          }
        } else {
          const res = await fetchPopularPeople(page);
          if (isCurrent) {
            if (res.results && res.results.length > 0) {
              setPeople(res.results);
              setTotalPages(Math.min(res.total_results ? Math.ceil(res.total_results / 20) : 1, 500));
            } else if (page === 1) {
              setPeople(mapStarsToTMDBPeople(stars));
            } else {
              setPeople([]);
            }
          }
        }
      } catch (err) {
        console.warn('Error loading TMDB stars in ExploreStarsView:', err);
        if (isCurrent && query.length < 2 && page === 1) {
          setPeople(mapStarsToTMDBPeople(stars));
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        loadData();
      }, 300);
      return () => {
        clearTimeout(timer);
        isCurrent = false;
      };
    } else {
      loadData();
      return () => {
        isCurrent = false;
      };
    }
  }, [searchQuery, page, stars]);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleStarClick = (person: TMDBPerson) => {
    onSelectStar(person.id.toString());
  };

  return (
    <div id="explore-stars-container" className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div>
        <h1
          id="explore-page-title"
          className="font-headline-xl-mobile md:font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight"
        >
          Explore Stars
        </h1>
        <p className="font-body-lg text-[15px] text-[#d0c5af] font-light mt-1">
          Search and discover actors, actresses, and filmmakers worldwide.
        </p>
      </div>

      {/* Live Search Input */}
      <div className="w-full rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 focus-within:border-[#f2ca50] px-5 py-3.5 flex items-center shadow-lg transition-colors">
        <span className="material-symbols-outlined text-[#f2ca50] mr-3 text-[22px]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search any star by name (e.g. Shah Rukh Khan, Zendaya, Prabhas, Tom Cruise)..."
          className="bg-transparent border-none text-[#FAF9F6] w-full focus:outline-none text-sm sm:text-base placeholder:text-[#99907c]"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange('')}
            className="text-[#99907c] hover:text-[#FAF9F6] text-xs font-mono px-2 py-1 bg-[#2a2a2a] rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
        <span>
          {searchQuery.trim().length >= 2
            ? `Search Results for "${searchQuery}"`
            : 'All Stars'}
        </span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {/* Grid of Stars / Skeleton Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonStarCard key={n} />
          ))}
        </div>
      ) : people.length === 0 ? (
        <div className="p-12 text-center bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl text-[#d0c5af] font-mono text-sm">
          No stars found matching "{searchQuery}". Try searching another name.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map((person) => {
            const isFollowed = followingIds.includes(`tmdb-${person.id}`) || followingIds.includes(person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            return (
              <div
                key={person.id}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl"
              >
                {/* Profile Image Header - Direct Page Navigation */}
                <div
                  onClick={() => handleStarClick(person)}
                  className="relative aspect-[3/4] w-full overflow-hidden bg-[#201f1f] cursor-pointer"
                >
                  <img
                    src={getTMDBImageUrl(person.profile_path, 'w500')}
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent" />

                  {/* Popularity Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-[#131313]/90 text-[#f2ca50] border border-white/10 px-2 py-0.5 rounded text-xs font-mono font-bold backdrop-blur-sm">
                    ★ {person.popularity ? person.popularity.toFixed(0) : 'N/A'}
                  </div>

                  {/* Department */}
                  <div className="absolute bottom-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-[#FAF9F6] uppercase font-bold">
                    {person.known_for_department || 'Actor'}
                  </div>
                </div>

                {/* Info & Action Buttons */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3
                      onClick={() => handleStarClick(person)}
                      className="font-headline-md text-base sm:text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-tight cursor-pointer line-clamp-1"
                    >
                      {person.name}
                    </h3>

                    <div className="mt-1.5 text-xs text-[#99907c] line-clamp-2">
                      {person.known_for && person.known_for.length > 0 ? (
                        <span>
                          Known for: <strong className="text-[#d0c5af] font-normal">{person.known_for.map((k) => k.title || k.name).join(', ')}</strong>
                        </span>
                      ) : (
                        'Movie Actor / Filmmaker'
                      )}
                    </div>
                  </div>

                  {/* Simple Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center gap-2">
                    <button
                      onClick={() => handleStarClick(person)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-bold text-xs uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>

                    <button
                      onClick={(e) => onToggleFollow(`tmdb-${person.id}`, e)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isFollowed
                          ? 'border-[#f2ca50] bg-[#f2ca50]/15 text-[#f2ca50]'
                          : 'border-[#4d4635]/40 text-[#99907c] hover:text-[#FAF9F6] hover:border-[#f2ca50]/40'
                      }`}
                      title={isFollowed ? 'Following Star' : 'Follow Star'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isFollowed ? 'person_remove' : 'person_add'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {!loading && people.length > 0 && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#4d4635]/20">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((prev) => Math.max(1, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#4d4635]/30 text-xs font-mono text-[#FAF9F6] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span>Previous</span>
          </button>

          <span className="px-4 py-2 text-xs font-mono text-[#f2ca50] bg-[#1c1b1b] border border-[#4d4635]/30 rounded-xl">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((prev) => Math.min(totalPages, prev + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-[#1c1b1b] border border-[#4d4635]/30 text-xs font-mono text-[#FAF9F6] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f2ca50] hover:text-[#131313] transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
};
