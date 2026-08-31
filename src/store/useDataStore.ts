import { create } from 'zustand';
import { TabView, Star, NewsBrief, RegionalPerformance, PlatformBuzz } from '../types';
import { fetchLiveNews, fetchLiveStars, fetchMarketPulse, FALLBACK_STARS, FALLBACK_NEWS } from '../services/tmdbService';

interface DataState {
  currentTab: TabView;
  selectedStarId: string;
  stars: Star[];
  news: NewsBrief[];
  regionalStats: RegionalPerformance[];
  platformBuzz: PlatformBuzz[];
  loadingData: boolean;

  // UI state
  isDarkMode: boolean;
  toastMessage: string | null;
  activeNewsModalId: string | null;
  isIntelligenceOpen: boolean;
  intelligenceTargetStar: string | undefined;
  isSearchModalOpen: boolean;
  isMobileNavOpen: boolean;
  watchlistSubTab: 'following' | 'watchlist';

  // Actions
  setCurrentTab: (tab: TabView) => void;
  setSelectedStarId: (starId: string) => void;
  setWatchlistSubTab: (subTab: 'following' | 'watchlist') => void;
  loadLiveData: () => Promise<void>;
  toggleDarkMode: () => void;
  showToast: (message: string) => void;
  openIntelligenceModal: (starName?: string) => void;
  closeIntelligenceModal: () => void;
  openNewsModal: (newsId: string) => void;
  closeNewsModal: () => void;
  setSearchModalOpen: (isOpen: boolean) => void;
  setMobileNavOpen: (isOpen: boolean) => void;
}

const CACHE_NEWS_KEY = 'starwire_cache_news';
const CACHE_STARS_KEY = 'starwire_cache_stars';
const CACHE_REGIONAL_KEY = 'starwire_cache_regional';
const CACHE_BUZZ_KEY = 'starwire_cache_buzz';

const getCachedItems = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length === 0 ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};

const setCachedItems = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to cache ${key} in localStorage:`, e);
  }
};

const initialStars = getCachedItems<Star[]>(CACHE_STARS_KEY, FALLBACK_STARS);
const initialNews = getCachedItems<NewsBrief[]>(CACHE_NEWS_KEY, FALLBACK_NEWS);
const initialRegional = getCachedItems<RegionalPerformance[]>(CACHE_REGIONAL_KEY, []);
const initialBuzz = getCachedItems<PlatformBuzz[]>(CACHE_BUZZ_KEY, []);

export const useDataStore = create<DataState>((set, get) => ({
  currentTab: 'landing',
  selectedStarId: initialStars.length > 0 ? initialStars[0].id : '',
  stars: initialStars,
  news: initialNews,
  regionalStats: initialRegional,
  platformBuzz: initialBuzz,
  loadingData: false,

  isDarkMode: (() => {
    const saved = localStorage.getItem('starwire-theme');
    return saved ? saved === 'dark' : true;
  })(),
  toastMessage: null,
  activeNewsModalId: null,
  isIntelligenceOpen: false,
  intelligenceTargetStar: undefined,
  isSearchModalOpen: false,
  isMobileNavOpen: false,
  watchlistSubTab: 'following',

  setCurrentTab: (tab: TabView) => {
    set({ currentTab: tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setSelectedStarId: (starId: string) => {
    set({ selectedStarId: starId, currentTab: 'star-details' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setWatchlistSubTab: (subTab: 'following' | 'watchlist') => {
    set({ watchlistSubTab: subTab, currentTab: 'watchlist' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  loadLiveData: async () => {
    if (get().stars.length === 0) {
      set({ loadingData: true });
    }
    try {
      const [newsRes, starsRes, marketRes] = await Promise.all([
        fetchLiveNews('ALL', '', 1),
        fetchLiveStars(),
        fetchMarketPulse(),
      ]);

      const fetchedNews = (newsRes.articles && newsRes.articles.length > 0) ? newsRes.articles : (get().news.length > 0 ? get().news : FALLBACK_NEWS);
      const fetchedStars = (starsRes && starsRes.length > 0) ? starsRes : (get().stars.length > 0 ? get().stars : FALLBACK_STARS);
      const fetchedRegional = marketRes?.regionalStats || get().regionalStats;
      const fetchedBuzz = marketRes?.platformBuzz || get().platformBuzz;

      set({
        news: fetchedNews,
        stars: fetchedStars,
        selectedStarId: get().selectedStarId || (fetchedStars.length > 0 ? fetchedStars[0].id : ''),
        regionalStats: fetchedRegional,
        platformBuzz: fetchedBuzz,
      });

      // Write to persistent localStorage cache
      setCachedItems(CACHE_NEWS_KEY, fetchedNews);
      setCachedItems(CACHE_STARS_KEY, fetchedStars);
      setCachedItems(CACHE_REGIONAL_KEY, fetchedRegional);
      setCachedItems(CACHE_BUZZ_KEY, fetchedBuzz);
    } catch (err) {
      console.error('Error loading live data:', err);
    } finally {
      set({ loadingData: false });
    }
  },

  toggleDarkMode: () => {
    const nextState = !get().isDarkMode;
    set({ isDarkMode: nextState });

    const root = document.documentElement;
    if (nextState) {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.remove('dark');
      document.body.classList.add('dark');
      localStorage.setItem('starwire-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('starwire-theme', 'light');
    }
  },

  showToast: (msg: string) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 2800);
  },

  openIntelligenceModal: (starName?: string) => {
    set({ intelligenceTargetStar: starName, isIntelligenceOpen: true });
  },

  closeIntelligenceModal: () => {
    set({ isIntelligenceOpen: false, intelligenceTargetStar: undefined });
  },

  openNewsModal: (newsId: string) => {
    set({ activeNewsModalId: newsId });
  },

  closeNewsModal: () => {
    set({ activeNewsModalId: null });
  },

  setSearchModalOpen: (isOpen: boolean) => {
    set({ isSearchModalOpen: isOpen });
  },

  setMobileNavOpen: (isOpen: boolean) => {
    set({ isMobileNavOpen: isOpen });
  },
}));
