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
  updateUserProfile: (updates: Partial<UserStats>) => void;
}

const DEFAULT_USER: UserStats = {
  userName: 'Sumit Pandit',
  userRole: 'Managing Director, Horizon Media Group',
  membershipLevel: 'Elite Terminal Access',
  followingCount: 0,
  watchlistCount: 0,
  updatesCount: 28,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  age: undefined,
  email: 'sumit.pandit@starwire.ai',
  phone: '+91 98765 43210',
};

const PROFILE_KEY = 'starwire_user_profile';
const GUEST_FOLLOWING_KEY = 'starwire_guest_following';
const GUEST_WATCHLIST_KEY = 'starwire_guest_watchlist';

const getSavedProfile = (): Partial<UserStats> => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

const getSavedGuestFollowing = (): string[] => {
  try {
    const data = localStorage.getItem(GUEST_FOLLOWING_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const getSavedGuestWatchlist = (): string[] => {
  try {
    const data = localStorage.getItem(GUEST_WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveProfileToStorage = (profile: UserStats) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage:', e);
  }
};

const saveGuestFollowingToStorage = (ids: string[]) => {
  try {
    localStorage.setItem(GUEST_FOLLOWING_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save guest following to localStorage:', e);
  }
};

const saveGuestWatchlistToStorage = (ids: string[]) => {
  try {
    localStorage.setItem(GUEST_WATCHLIST_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to save guest watchlist to localStorage:', e);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    const savedUser = getSavedUser();
    const savedProfile = getSavedProfile();
    return {
      ...DEFAULT_USER,
      ...savedProfile,
      userName: savedUser?.Name || savedUser?.name || savedProfile.userName || DEFAULT_USER.userName,
      avatarUrl: savedUser?.ProfileImage || savedProfile.avatarUrl || DEFAULT_USER.avatarUrl,
    };
  })(),
  token: getAuthToken(),
  isAuthenticated: Boolean(getAuthToken()),
  followingIds: getSavedGuestFollowing(),
  watchlistNewsIds: getSavedGuestWatchlist(),
  loadingAuth: false,

  initializeAuth: async () => {
    set({ loadingAuth: true });
    const token = getAuthToken();
    if (token) {
      const me = await apiGetMe();
      if (me) {
        const savedProfile = getSavedProfile();
        const updatedUser: UserStats = {
          ...DEFAULT_USER,
          ...savedProfile,
          userName: me.Name || me.name || savedProfile.userName || DEFAULT_USER.userName,
          avatarUrl: me.ProfileImage || savedProfile.avatarUrl || DEFAULT_USER.avatarUrl,
          email: me.Email || savedProfile.email || DEFAULT_USER.email,
          phone: me.Mobile || savedProfile.phone || DEFAULT_USER.phone,
        };

        set({
          user: updatedUser,
          token,
          isAuthenticated: true,
        });
        saveProfileToStorage(updatedUser);

        // Load followed stars and bookmarks from MongoDB
        const activity = await apiGetUserActivity();
        if (activity) {
          const followList = activity.followedStars || [];
          const newsList = activity.bookmarkedNews || [];
          set({
            followingIds: followList,
            watchlistNewsIds: newsList,
          });
          saveGuestFollowingToStorage(followList);
          saveGuestWatchlistToStorage(newsList);
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
      const savedProfile = getSavedProfile();
      const newUser: UserStats = {
        ...DEFAULT_USER,
        ...savedProfile,
        userName: res.user.Name,
        email: res.user.Email || data.Email,
        phone: res.user.Mobile || data.Mobile,
        avatarUrl: res.user.ProfileImage || DEFAULT_USER.avatarUrl,
      };

      set({
        token: res.token,
        user: newUser,
        isAuthenticated: true,
      });
      saveProfileToStorage(newUser);

      // Sync guest activity to new MongoDB account
      if (guestFollowing.length > 0 || guestBookmarks.length > 0) {
        const synced = await apiSyncUserActivity(guestFollowing, guestBookmarks);
        if (synced && synced.status === 'ok') {
          const followList = synced.followedStars || [];
          const newsList = synced.bookmarkedNews || [];
          set({
            followingIds: followList,
            watchlistNewsIds: newsList,
          });
          saveGuestFollowingToStorage(followList);
          saveGuestWatchlistToStorage(newsList);
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
      const savedProfile = getSavedProfile();
      const loggedUser: UserStats = {
        ...DEFAULT_USER,
        ...savedProfile,
        userName: res.user.Name,
        email: res.user.Email,
        phone: res.user.Mobile,
        avatarUrl: res.user.ProfileImage || DEFAULT_USER.avatarUrl,
      };

      set({
        token: res.token,
        user: loggedUser,
        isAuthenticated: true,
      });
      saveProfileToStorage(loggedUser);

      // Sync guest activity with MongoDB user record
      const synced = await apiSyncUserActivity(guestFollowing, guestBookmarks);
      if (synced && synced.status === 'ok') {
        const followList = synced.followedStars || [];
        const newsList = synced.bookmarkedNews || [];
        set({
          followingIds: followList,
          watchlistNewsIds: newsList,
        });
        saveGuestFollowingToStorage(followList);
        saveGuestWatchlistToStorage(newsList);
      } else {
        const activity = await apiGetUserActivity();
        if (activity) {
          const followList = activity.followedStars || [];
          const newsList = activity.bookmarkedNews || [];
          set({
            followingIds: followList,
            watchlistNewsIds: newsList,
          });
          saveGuestFollowingToStorage(followList);
          saveGuestWatchlistToStorage(newsList);
        }
      }
    }
    set({ loadingAuth: false });
    return res;
  },

  logout: () => {
    logoutUser();
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(GUEST_FOLLOWING_KEY);
    localStorage.removeItem(GUEST_WATCHLIST_KEY);
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
    saveGuestFollowingToStorage(updated);

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
    saveGuestWatchlistToStorage(updated);

    if (isAuthenticated) {
      await apiToggleBookmarkNews(newsId);
    }
    return !isBookmarked;
  },

  updateUserProfile: (updates: Partial<UserStats>) => {
    const updatedUser = {
      ...get().user,
      ...updates,
    };
    set({ user: updatedUser });
    saveProfileToStorage(updatedUser);
  },
}));
