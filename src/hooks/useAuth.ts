import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDataStore } from '../store/useDataStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const followingIds = useAuthStore((state) => state.followingIds);
  const watchlistNewsIds = useAuthStore((state) => state.watchlistNewsIds);
  const loadingAuth = useAuthStore((state) => state.loadingAuth);

  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const signUp = useAuthStore((state) => state.signUp);
  const signIn = useAuthStore((state) => state.signIn);
  const logout = useAuthStore((state) => state.logout);
  const toggleFollowStarStore = useAuthStore((state) => state.toggleFollowStar);
  const toggleBookmarkNewsStore = useAuthStore((state) => state.toggleBookmarkNews);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  const stars = useDataStore((state) => state.stars);
  const news = useDataStore((state) => state.news);
  const showToast = useDataStore((state) => state.showToast);

  const toggleFollowStar = async (starId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const star = stars.find((s) => s.id === starId);
    const isNowFollowing = await toggleFollowStarStore(starId);
    if (isNowFollowing) {
      showToast(`Added ${star?.name || 'Talent'} to VIP Watchlist (Saved to MongoDB)`);
    } else {
      showToast(`Removed ${star?.name || 'Talent'} from Monitored Dossiers`);
    }
  };

  const toggleBookmarkNews = async (newsId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowBookmarked = await toggleBookmarkNewsStore(newsId);
    if (isNowBookmarked) {
      showToast('Brief saved to Intelligence Watchlist (Synced with MongoDB)');
    } else {
      showToast('Brief removed from Saved Archive');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    followingIds,
    watchlistNewsIds,
    loadingAuth,
    initializeAuth,
    signUp,
    signIn,
    logout,
    toggleFollowStar,
    toggleBookmarkNews,
    updateUserProfile,
  };
}
