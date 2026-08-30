import { create } from 'zustand';
import { UserStats } from '../types';
import {
  apiSignUp,
  apiSignIn,
  apiGetMe,
  apiToggleFollowStar,
  apiToggleBookmarkNews,
  apiSyncUserActivity,
  apiGetUserActivity,
  getAuthToken,
  getSavedUser,
  logoutUser,
  SignUpData,
  SignInData,
  AuthResponse,
} from '../services/authService';

interface AuthState {
  user: UserStats;
  token: string | null;
  isAuthenticated: boolean;
  followingIds: string[];
  watchlistNewsIds: string[];
  loadingAuth: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  logout: () => void;
  toggleFollowStar: (starId: string, starName?: string) => Promise<boolean>;
  toggleBookmarkNews: (newsId: string) => Promise<boolean>;
}

const DEFAULT_USER: UserStats = {
  userName: 'Sumit Pandit',
  userRole: 'Managing Director, Horizon Media Group',
  membershipLevel: 'Elite Terminal Access',
  followingCount: 0,
  watchlistCount: 0,
  updatesCount: 28,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getSavedUser()
    ? {
        ...DEFAULT_USER,
        userName: getSavedUser().Name || getSavedUser().name || DEFAULT_USER.userName,
        avatarUrl: getSavedUser().ProfileImage || DEFAULT_USER.avatarUrl,
      }
    : DEFAULT_USER,
  token: getAuthToken(),
  isAuthenticated: Boolean(getAuthToken()),
  followingIds: [],
  watchlistNewsIds: [],
  loadingAuth: false,

  initializeAuth: async () => {
    set({ loadingAuth: true });
    const token = getAuthToken();
    if (token) {
      const me = await apiGetMe();
      if (me) {
        set({
          user: {
            ...DEFAULT_USER,
            userName: me.Name || me.name || DEFAULT_USER.userName,
            avatarUrl: me.ProfileImage || DEFAULT_USER.avatarUrl,
          },
          token,
          isAuthenticated: true,
        });

        // Load followed stars and bookmarks from MongoDB
        const activity = await apiGetUserActivity();
        if (activity) {
          set({
            followingIds: activity.followedStars || [],
            watchlistNewsIds: activity.bookmarkedNews || [],
          });
        }
      }
    }
    set({ loadingAuth: false });
  },

  signUp: async (data: SignUpData) => {
    set({ loadingAuth: true });
    const guestFollowing = get().followingIds;
    const guestBookmarks = get().watchlistNewsIds;

    const res = await apiSignUp(data);
    if (res.status === 'ok' && res.token && res.user) {
      set({
        token: res.token,
        user: {
          ...DEFAULT_USER,
          userName: res.user.Name,
          avatarUrl: res.user.ProfileImage || DEFAULT_USER.avatarUrl,
        },
        isAuthenticated: true,
      });

      // Sync guest activity to new MongoDB account
      if (guestFollowing.length > 0 || guestBookmarks.length > 0) {
        const synced = await apiSyncUserActivity(guestFollowing, guestBookmarks);
        if (synced && synced.status === 'ok') {
          set({
            followingIds: synced.followedStars || [],
            watchlistNewsIds: synced.bookmarkedNews || [],
          });
        }
      }
    }
    set({ loadingAuth: false });
    return res;
  },

  signIn: async (data: SignInData) => {
    set({ loadingAuth: true });
    const guestFollowing = get().followingIds;
    const guestBookmarks = get().watchlistNewsIds;

    const res = await apiSignIn(data);
    if (res.status === 'ok' && res.token && res.user) {
      set({
        token: res.token,
        user: {
          ...DEFAULT_USER,
          userName: res.user.Name,
          avatarUrl: res.user.ProfileImage || DEFAULT_USER.avatarUrl,
        },
        isAuthenticated: true,
      });

      // Sync guest activity with MongoDB user record
      const synced = await apiSyncUserActivity(guestFollowing, guestBookmarks);
      if (synced && synced.status === 'ok') {
        set({
          followingIds: synced.followedStars || [],
          watchlistNewsIds: synced.bookmarkedNews || [],
        });
      } else {
        const activity = await apiGetUserActivity();
        if (activity) {
          set({
            followingIds: activity.followedStars || [],
            watchlistNewsIds: activity.bookmarkedNews || [],
          });
        }
      }
    }
    set({ loadingAuth: false });
    return res;
  },

  logout: () => {
    logoutUser();
    set({
      user: DEFAULT_USER,
      token: null,
      isAuthenticated: false,
      followingIds: [],
      watchlistNewsIds: [],
    });
  },

  toggleFollowStar: async (starId: string) => {
    const { followingIds, isAuthenticated } = get();
    const isFollowing = followingIds.includes(starId);

    const updated = isFollowing
      ? followingIds.filter((id) => id !== starId)
      : [...followingIds, starId];

    set({ followingIds: updated });

    if (isAuthenticated) {
      await apiToggleFollowStar(starId);
    }
    return !isFollowing;
  },

  toggleBookmarkNews: async (newsId: string) => {
    const { watchlistNewsIds, isAuthenticated } = get();
    const isBookmarked = watchlistNewsIds.includes(newsId);

    const updated = isBookmarked
      ? watchlistNewsIds.filter((id) => id !== newsId)
      : [...watchlistNewsIds, newsId];

    set({ watchlistNewsIds: updated });

    if (isAuthenticated) {
      await apiToggleBookmarkNews(newsId);
    }
    return !isBookmarked;
  },
}));
