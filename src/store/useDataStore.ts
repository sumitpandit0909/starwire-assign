import { create } from 'zustand';
import { TabView, Star, NewsBrief, RegionalPerformance, PlatformBuzz } from '../types';
import { fetchLiveNews, fetchLiveStars, fetchMarketPulse } from '../services/tmdbService';

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

export const useDataStore = create<DataState>((set, get) => ({
  currentTab: 'landing',
  selectedStarId: '',
  stars: [],
  news: [],
  regionalStats: [],
  platformBuzz: [],
  loadingData: true,

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
    set({ loadingData: true });
    try {
      const [newsRes, starsRes, marketRes] = await Promise.all([
        fetchLiveNews('ALL', '', 1),
        fetchLiveStars(),
        fetchMarketPulse(),
      ]);

      set({
        news: newsRes.articles || [],
        stars: starsRes || [],
        selectedStarId: starsRes && starsRes.length > 0 ? starsRes[0].id : '',
        regionalStats: marketRes?.regionalStats || [],
        platformBuzz: marketRes?.platformBuzz || [],
      });
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
      document.body.classList.remove('light');
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
