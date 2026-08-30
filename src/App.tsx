import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useStars } from './hooks/useStars';
import { useNews } from './hooks/useNews';
import { useDataStore } from './store/useDataStore';

// Views
import { SideNav } from './components/Navigation/SideNav';
import { TopNav } from './components/Navigation/TopNav';
import { LandingPageView } from './components/Landing/LandingPageView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ExploreStarsView } from './components/ExploreStars/ExploreStarsView';
import { StarDetailsView } from './components/StarDetails/StarDetailsView';
import { RequestAccessView } from './components/Auth/RequestAccessView';
import { WatchlistView } from './components/Watchlist/WatchlistView';
import { TrendingView } from './components/Trending/TrendingView';
import { MoviesView } from './components/Movies/MoviesView';
import { NewsListView } from './components/News/NewsListView';

// Modals
import { IntelligenceModal } from './components/Modals/IntelligenceModal';
import { NewsDetailModal } from './components/Modals/NewsDetailModal';
import { SearchModal } from './components/Modals/SearchModal';

export function App() {
  // Hooks & Stores
  const {
    user,
    isAuthenticated,
    followingIds,
    watchlistNewsIds,
    initializeAuth,
    logout,
    toggleFollowStar,
    toggleBookmarkNews,
  } = useAuth();

  const { stars, selectedStar, selectStar } = useStars();
  const { news, activeNewsModalId, activeModalNews, openNewsModal, closeNewsModal } = useNews();

  const currentTab = useDataStore((state) => state.currentTab);
  const setCurrentTab = useDataStore((state) => state.setCurrentTab);
  const regionalStats = useDataStore((state) => state.regionalStats);
  const platformBuzz = useDataStore((state) => state.platformBuzz);
  const isDarkMode = useDataStore((state) => state.isDarkMode);
  const toggleDarkMode = useDataStore((state) => state.toggleDarkMode);
  const toastMessage = useDataStore((state) => state.toastMessage);
  const showToast = useDataStore((state) => state.showToast);
  const isIntelligenceOpen = useDataStore((state) => state.isIntelligenceOpen);
  const intelligenceTargetStar = useDataStore((state) => state.intelligenceTargetStar);
  const openIntelligenceModal = useDataStore((state) => state.openIntelligenceModal);
  const closeIntelligenceModal = useDataStore((state) => state.closeIntelligenceModal);
  const isSearchModalOpen = useDataStore((state) => state.isSearchModalOpen);
  const setSearchModalOpen = useDataStore((state) => state.setSearchModalOpen);
  const isMobileNavOpen = useDataStore((state) => state.isMobileNavOpen);
  const setMobileNavOpen = useDataStore((state) => state.setMobileNavOpen);
  const watchlistSubTab = useDataStore((state) => state.watchlistSubTab);
  const setWatchlistSubTab = useDataStore((state) => state.setWatchlistSubTab);
  const loadLiveData = useDataStore((state) => state.loadLiveData);

  // Initialize Auth & Data on load
  useEffect(() => {
    initializeAuth();
    loadLiveData();
  }, [initializeAuth, loadLiveData]);

  // Authentication Access Control Guard
  useEffect(() => {
    // If not authenticated and trying to access inner terminal tabs, redirect to auth screen
    if (!isAuthenticated && currentTab !== 'landing' && currentTab !== 'auth') {
      setCurrentTab('auth');
    }
  }, [isAuthenticated, currentTab, setCurrentTab]);

  const handleLogout = () => {
    logout();
    showToast('Signed out of session.');
    setCurrentTab('landing');
  };

  // Selected following stars and watchlist briefs
  const followingStarsList = stars.filter((s) => followingIds.includes(s.id));
  const watchlistNewsList = news.filter((n) => watchlistNewsIds.includes(n.id));

  // Dedicated Landing Page View
  if (currentTab === 'landing') {
    return (
      <div className={isDarkMode ? 'dark' : 'light'}>
        <LandingPageView
          onEnterTerminal={() => {
            if (isAuthenticated) {
              setCurrentTab('dashboard');
            } else {
              setCurrentTab('auth');
            }
          }}
          onSelectStar={(starId) => selectStar(starId)}
          onOpenIntelligence={(starName) => openIntelligenceModal(starName)}
          onRequestAccess={() => setCurrentTab('auth')}
          stars={stars}
          news={news}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleDarkMode}
          isAuthenticated={isAuthenticated}
        />
        
        <IntelligenceModal
          isOpen={isIntelligenceOpen}
          onClose={closeIntelligenceModal}
          stars={stars}
          initialStarName={intelligenceTargetStar}
        />
      </div>
    );
  }

  // Dedicated Auth View
  if (currentTab === 'auth') {
    return (
      <div className={isDarkMode ? 'dark' : 'light'}>
        <RequestAccessView
          onSuccess={() => {
            showToast('VIP Access Confirmed. Synced with MongoDB.');
            setCurrentTab('dashboard');
          }}
          onCancelToDashboard={() => {
            if (isAuthenticated) {
              setCurrentTab('dashboard');
            } else {
              setCurrentTab('landing');
            }
          }}
        />
      </div>
    );
  }

  // Inner Terminal App (Guarded by authentication)
  return (
    <div
      id="starwire-app-root"
      className={`min-h-screen ${isDarkMode ? 'dark bg-[#131313] text-[#e5e2e1]' : 'light bg-[#F9F8F5] text-[#141416]'} flex flex-col font-sans transition-colors duration-300`}
    >
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          id="toast-notification-banner"
          className="fixed bottom-6 right-6 z-50 bg-[#1c1b1b] border border-[#f2ca50] text-[#FAF9F6] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-mono"
        >
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <SideNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'following') {
            setWatchlistSubTab('following');
          } else if (tab === 'watchlist') {
            setWatchlistSubTab('watchlist');
          } else {
            setCurrentTab(tab);
          }
        }}
        user={user}
        onOpenIntelligence={() => openIntelligenceModal()}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleDarkMode}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      {/* Content Area with Top Header */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <TopNav
          user={user}
          onOpenSearch={() => setSearchModalOpen(true)}
          onToggleMobileNav={() => setMobileNavOpen(!isMobileNavOpen)}
          stars={stars}
          news={news}
          onSelectStar={selectStar}
          onSelectNews={(id) => openNewsModal(id)}
          followingIds={followingIds}
          watchlistIds={watchlistNewsIds}
          onOpenWatchlist={() => setWatchlistSubTab('watchlist')}
          onOpenFollowing={() => setWatchlistSubTab('following')}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleDarkMode}
          onLogout={handleLogout}
        />

        {/* Routed View Container */}
        <main className="flex-1 px-4 md:px-12 py-8 max-w-[1440px] mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              user={user}
              stars={stars}
              news={news}
              regionalStats={regionalStats}
              platformBuzz={platformBuzz}
              onSelectStar={selectStar}
              onSelectNews={(newsId) => openNewsModal(newsId)}
              onExploreStars={() => setCurrentTab('explore')}
              onViewTrending={() => setCurrentTab('trending')}
              onViewAllMovies={() => setCurrentTab('movies')}
              onViewAllNews={() => setCurrentTab('news')}
              onOpenFollowing={() => setWatchlistSubTab('following')}
              onOpenWatchlist={() => setWatchlistSubTab('watchlist')}
              onOpenIntelligence={openIntelligenceModal}
              onToggleFollow={toggleFollowStar}
              followingIds={followingIds}
              watchlistCount={watchlistNewsIds.length}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreStarsView
              stars={stars}
              onSelectStar={selectStar}
              followingIds={followingIds}
              onToggleFollow={toggleFollowStar}
            />
          )}

          {currentTab === 'star-details' && selectedStar && (
            <StarDetailsView
              star={selectedStar}
              allStars={stars}
              onSelectStar={selectStar}
              onBackToExplore={() => setCurrentTab('explore')}
              isFollowing={followingIds.includes(selectedStar.id)}
              onToggleFollow={(id) => toggleFollowStar(id)}
              onOpenIntelligence={openIntelligenceModal}
            />
          )}

          {currentTab === 'watchlist' && (
            <WatchlistView
              followingStars={followingStarsList}
              watchlistNews={watchlistNewsList}
              onSelectStar={selectStar}
              onSelectNews={(newsId) => openNewsModal(newsId)}
              onUnfollowStar={toggleFollowStar}
              onRemoveBookmark={toggleBookmarkNews}
              onExploreStars={() => setCurrentTab('explore')}
              activeSubTab={watchlistSubTab}
              setActiveSubTab={setWatchlistSubTab}
            />
          )}

          {currentTab === 'trending' && (
            <TrendingView
              stars={stars}
              onSelectStar={selectStar}
              onOpenIntelligence={openIntelligenceModal}
            />
          )}

          {currentTab === 'movies' && (
            <MoviesView
              stars={stars}
              onSelectStar={selectStar}
              onOpenIntelligence={openIntelligenceModal}
            />
          )}

          {currentTab === 'news' && (
            <NewsListView
              news={news}
              onSelectNews={(id) => openNewsModal(id)}
              watchlistIds={watchlistNewsIds}
              onToggleBookmark={toggleBookmarkNews}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <IntelligenceModal
        isOpen={isIntelligenceOpen}
        onClose={closeIntelligenceModal}
        stars={stars}
        initialStarName={intelligenceTargetStar}
      />

      <NewsDetailModal
        news={activeModalNews}
        onClose={closeNewsModal}
        onBookmark={(id) => toggleBookmarkNews(id)}
        isBookmarked={activeNewsModalId ? watchlistNewsIds.includes(activeNewsModalId) : false}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        stars={stars}
        news={news}
        onSelectStar={selectStar}
        onSelectNews={(id) => openNewsModal(id)}
        onOpenIntelligence={openIntelligenceModal}
      />
    </div>
  );
}

export default App;
