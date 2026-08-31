import React, { useState, useEffect } from 'react';
import { Star, TMDBPerson } from '../../types';
import {
  getTMDBImageUrl,
  fetchPersonDetails,
  fetchPopularPeople,
} from '../../services/tmdbService';

interface FollowingViewProps {
  followingIds: string[];
  stars: Star[];
  onSelectStar: (starId: string) => void;
  onToggleFollow: (starId: string, e?: React.MouseEvent) => void;
  onOpenIntelligence: (starName?: string) => void;
}

// Skeleton Shimmer Card Placeholder for Following Page
const SkeletonFollowingCard: React.FC = () => (
  <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl p-6 animate-pulse flex flex-col justify-between h-56">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-[#2a2a2a]" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-[#2a2a2a] rounded w-2/3" />
        <div className="h-3 bg-[#2a2a2a] rounded w-1/3" />
      </div>
    </div>
    <div className="h-10 bg-[#201f1f] rounded-xl mt-4" />
  </div>
);

export const FollowingView: React.FC<FollowingViewProps> = ({
  followingIds,
  stars,
  onSelectStar,
  onToggleFollow,
  onOpenIntelligence,
}) => {
  const [followedStarsList, setFollowedStarsList] = useState<any[]>([]);
  const [recommendedPeople, setRecommendedPeople] = useState<TMDBPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Asynchronously resolve all followed star IDs (handling static IDs & TMDB IDs)
  useEffect(() => {
    let isMounted = true;
    async function resolveFollowedStars() {
      setLoading(true);
      try {
        const resolvedPromises = followingIds.map(async (rawId) => {
          // 1. Check local static stars array
          const staticMatch = stars.find(
            (s) => s.id === rawId || s.tmdbId?.toString() === rawId || `tmdb-${s.tmdbId}` === rawId
          );
          if (staticMatch) {
            return {
              id: staticMatch.id,
              name: staticMatch.name,
              avatarImage: staticMatch.avatarImage,
              category: staticMatch.category || 'Global Cinema',
              starScore: staticMatch.starScore || 90,
              isTMDB: false,
            };
          }

          // 2. Extract numeric TMDB person ID
          const cleanTmdbId = rawId.startsWith('tmdb-') ? rawId.replace('tmdb-', '') : rawId;

          // Fetch TMDB person profile if cleanTmdbId is numeric
          if (/^\d+$/.test(cleanTmdbId)) {
            const personDetails = await fetchPersonDetails(cleanTmdbId);
            if (personDetails) {
              return {
                id: rawId,
                tmdbId: cleanTmdbId,
                name: personDetails.name,
                avatarImage: getTMDBImageUrl(personDetails.profile_path, 'w185', 'profile'),
                category: personDetails.known_for_department || 'Acting',
                starScore: Math.round(personDetails.popularity || 85),
                isTMDB: true,
              };
            }
          }

          // Fallback formatted placeholder if details fetch fails
          const fallbackName = rawId
            .replace(/^tmdb-/, '')
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

          return {
            id: rawId,
            name: fallbackName,
            avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
            category: 'Talent Dossier',
            starScore: 88,
            isTMDB: false,
          };
        });

        const resolved = await Promise.all(resolvedPromises);
        if (isMounted) {
          setFollowedStarsList(resolved);
        }

        // Fetch popular recommendations excluding already followed ones
        const popularRes = await fetchPopularPeople(1);
        if (isMounted && popularRes.results) {
          const filteredRecs = popularRes.results.filter(
            (p) => !followingIds.includes(p.id.toString()) && !followingIds.includes(`tmdb-${p.id}`)
          );
          setRecommendedPeople(filteredRecs.slice(0, 8));
        }
      } catch (err) {
        console.warn('Error resolving followed stars:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    resolveFollowedStars();
    return () => {
      isMounted = false;
    };
  }, [followingIds, stars]);

  return (
    <div id="following-view-container" className="space-y-10 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
            Following &amp; Talent Subscriptions
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Manage your followed stars, real-time telemetry updates, and discover recommended talent.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1c1b1b] px-4 py-2 rounded-xl border border-[#4d4635]/30 text-xs font-mono">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">star</span>
          <span className="text-[#FAF9F6] font-bold">{followingIds.length} Stars Followed</span>
        </div>
      </div>

      {/* SECTION 1: Followed Stars */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-3">
          <h2 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">groups</span>
            <span>Your Followed Talent</span>
          </h2>
          <span className="text-xs font-mono text-[#10B981]">
            {followedStarsList.length} Active Dossiers
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <SkeletonFollowingCard key={n} />
            ))}
          </div>
        ) : followedStarsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {followedStarsList.map((star) => (
              <div
                key={star.id}
                onClick={() => onSelectStar(star.tmdbId || star.id)}
                className="bg-[#1c1b1b] border border-[#f2ca50]/30 hover:border-[#f2ca50] rounded-2xl p-6 flex flex-col justify-between transition-all group shadow-xl cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 font-bold uppercase">
                      ★ {star.starScore} Score
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollow(star.id, e);
                      }}
                      className="text-xs font-mono text-[#d0c5af] hover:text-[#EF4444] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">bookmark_remove</span>
                      <span>Unfollow</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 my-2">
                    <img
                      src={star.avatarImage}
                      alt={star.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors shadow-md"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div>
                      <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors font-bold line-clamp-1">
                        {star.name}
                      </h3>
                      <p className="text-xs text-[#99907c] font-mono">{star.category}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex justify-between items-center text-xs font-mono">
                  <span className="text-[#f2ca50] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View Dossier</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenIntelligence(star.name);
                    }}
                    className="text-[#d0c5af] hover:text-[#f2ca50] flex items-center gap-1 cursor-pointer"
                  >
                    <span>AI Intel</span>
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-[#1c1b1b] border border-[#4d4635]/30 text-center space-y-3">
            <p className="text-[#FAF9F6] font-medium text-base">You are not following any talent dossiers yet.</p>
            <p className="text-xs text-[#d0c5af]">Explore recommendations below or visit Explore Stars to build your watchlist.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: Recommended Stars to Follow */}
      <div className="space-y-6 pt-6 border-t border-[#4d4635]/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f2ca50]">person_add</span>
              <span>Recommended Stars to Follow</span>
            </h2>
            <p className="text-xs font-mono text-[#d0c5af] mt-1">Trending talent curated based on live TMDB popularity rankings.</p>
          </div>
        </div>

        {recommendedPeople.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedPeople.map((person) => (
              <div
                key={person.id}
                onClick={() => onSelectStar(person.id.toString())}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-lg cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getTMDBImageUrl(person.profile_path, 'w185', 'profile')}
                    alt={person.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#4d4635]/40 group-hover:border-[#f2ca50] transition-colors shadow-md"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-headline-md text-base text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors font-semibold line-clamp-1">
                      {person.name}
                    </h3>
                    <p className="text-xs text-[#99907c] font-mono">{person.known_for_department || 'Acting'}</p>
                    <span className="text-[10px] font-mono text-[#10B981] font-bold">
                      ★ {person.popularity ? person.popularity.toFixed(0) : '85'} Pop
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#d0c5af] group-hover:text-[#FAF9F6]">
                    View Profile ↗
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(`tmdb-${person.id}`, e);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] transition-all font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">bookmark_add</span>
                    <span>+ Follow</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
