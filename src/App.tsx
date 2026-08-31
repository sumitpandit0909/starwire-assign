import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
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
import { FollowingView } from './components/Following/FollowingView';
import { TrendingView } from './components/Trending/TrendingView';
import { MoviesView } from './components/Movies/MoviesView';
import { MovieDetailsView } from './components/MovieDetails/MovieDetailsView';
import { NewsListView } from './components/News/NewsListView';

// Modals
import { IntelligenceModal } from './components/Modals/IntelligenceModal';
import { NewsDetailModal } from './components/Modals/NewsDetailModal';
import { SearchModal } from './components/Modals/SearchModal';

// Route Guard Component
const ProtectedRoute: React.FC<{ isAuthenticated: boolean; children: React.ReactNode }> = ({
  isAuthenticated,
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Dynamic Star Details Route Wrapper
const StarDetailsRouteWrapper: React.FC<{
  stars: any[];
  selectStar: (id: string) => void;
  followingIds: string[];
  toggleFollowStar: (id: string) => void;
  openIntelligenceModal: (name?: string) => void;
}> = ({ stars, selectStar, followingIds, toggleFollowStar, openIntelligenceModal }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const foundStar = stars.find((s) => s.id === id || s.tmdbId?.toString() === id);

  const star = foundStar || {
    id: id || 'tmdb-star',
    tmdbId: id,
    name: 'Star Dossier',
    category: 'Global',
    roles: ['Actor'],
    industry: 'Cinema',
    dossierBio: 'Fetching live intelligence profile from TMDB...',
    avatarImage: '',
    coverImage: '',
    buzzDelta: 12,
    starScore: 88,
    reach: '65M',
    starScoreTotal: 288,
    buzzMeter: 88,
    globalReachCount: '65M',
    engagementRate: '14.2%',
    engagementDelta: 2.1,
    debutYear: 2005,
    awardsCount: 8,
    language: 'English',
    topBrands: ['Global Houses'],
    activeSignals: { audienceSentiment: 'Overwhelmingly Positive', socialBuzzRate: 'High Velocity' },
    films: [],
  };

  return (
    <StarDetailsView
      star={star}
      allStars={stars}
      onSelectStar={(starId) => {
        selectStar(starId);
        navigate(`/star/${starId}`);
      }}
      onBackToExplore={() => navigate('/explore')}
      isFollowing={followingIds.includes(star.id) || followingIds.includes(`tmdb-${star.id}`)}
      onToggleFollow={(starId) => toggleFollowStar(starId)}
      onOpenIntelligence={openIntelligenceModal}
    />
  );
};

// Dynamic Movie Details Route Wrapper
const MovieDetailsRouteWrapper: React.FC<{
  openIntelligenceModal: (title?: string) => void;
}> = ({ openIntelligenceModal }) => {
  const { id } = useParams<{ id: string }>();
  return <MovieDetailsView movieId={id || ''} onOpenIntelligence={openIntelligenceModal} />;
};

// Main Terminal Layout Container
const MainLayout: React.FC<{
  user: any;
  stars: any[];
  news: any[];
  followingIds: string[];
  watchlistNewsIds: string[];
  toggleFollowStar: (id: string) => void;
  toggleBookmarkNews: (id: string) => void;
  handleLogout: () => void;
  selectStar: (id: string) => void;
  openNewsModal: (id: string) => void;
}> = ({
  user,
  stars,
  news,
  followingIds,
  watchlistNewsIds,
  toggleFollowStar,
  toggleBookmarkNews,
  handleLogout,
  selectStar,
  openNewsModal,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const regionalStats = useDataStore((state) => state.regionalStats);
  const platformBuzz = useDataStore((state) => state.platformBuzz);
  const isDarkMode = useDataStore((state) => state.isDarkMode);
  const toggleDarkMode = useDataStore((state) => state.toggleDarkMode);
  const toastMessage = useDataStore((state) => state.toastMessage);
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

  const activeNewsModalId = useDataStore((state) => state.activeNewsModalId);
  const closeNewsModal = useDataStore((state) => state.closeNewsModal);
  const activeModalNews = news.find((n) => n.id === activeNewsModalId) || null;

  const followingStarsList = stars.filter((s) => followingIds.includes(s.id));
  const watchlistNewsList = news.filter((n) => watchlistNewsIds.includes(n.id));

  return (
    <div
      id="starwire-app-root"
      className={`min-h-screen ${isDarkMode ? 'dark bg-[#131313] text-[#e5e2e1]' : 'light bg-[#F9F8F5] text-[#141416]'} flex flex-col font-sans transition-colors duration-300`}
    >
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          id="toast-notification-banner"
          className="fixed bottom-6 right-[#10B981] z-50 bg-[#1c1b1b] border border-[#f2ca50] text-[#FAF9F6] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-mono"
        >
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <SideNav
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
          onSelectStar={(id) => {
            selectStar(id);
            navigate(`/star/${id}`);
          }}
          onSelectNews={(id) => openNewsModal(id)}
          followingIds={followingIds}
          watchlistIds={watchlistNewsIds}
          onOpenWatchlist={() => navigate('/watchlist')}
          onOpenFollowing={() => navigate('/watchlist')}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleDarkMode}
          onLogout={handleLogout}
        />

        {/* Separate Page Routes */}
        <main className="flex-1 px-4 md:px-12 py-8 max-w-[1440px] mx-auto w-full">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <DashboardView
                  user={user}
                  stars={stars}
                  news={news}
                  regionalStats={regionalStats}
                  platformBuzz={platformBuzz}
                  onSelectStar={(id) => {
                    selectStar(id);
                    navigate(`/star/${id}`);
                  }}
                  onSelectNews={(id) => openNewsModal(id)}
                  onExploreStars={() => navigate('/explore')}
                  onViewTrending={() => navigate('/trending')}
                  onViewAllMovies={() => navigate('/movies')}
                  onViewAllNews={() => navigate('/news')}
                  onOpenFollowing={() => navigate('/following')}
                  onOpenWatchlist={() => navigate('/watchlist')}
                  onOpenIntelligence={openIntelligenceModal}
                  onToggleFollow={toggleFollowStar}
                  followingIds={followingIds}
                  watchlistCount={watchlistNewsIds.length}
                />
              }
            />

            <Route
              path="/explore"
              element={
                <ExploreStarsView
                  stars={stars}
                  onSelectStar={(id) => {
                    selectStar(id);
                    navigate(`/star/${id}`);
                  }}
                  followingIds={followingIds}
                  onToggleFollow={toggleFollowStar}
                />
              }
            />

            <Route
              path="/star/:id"
              element={
                <StarDetailsRouteWrapper
                  stars={stars}
                  selectStar={selectStar}
                  followingIds={followingIds}
                  toggleFollowStar={toggleFollowStar}
                  openIntelligenceModal={openIntelligenceModal}
                />
              }
            />

            <Route
              path="/following"
              element={
                <FollowingView
                  followingIds={followingIds}
                  stars={stars}
                  onSelectStar={(id) => {
                    selectStar(id);
                    navigate(`/star/${id}`);
                  }}
                  onToggleFollow={toggleFollowStar}
                  onOpenIntelligence={openIntelligenceModal}
                />
              }
            />

            <Route
              path="/watchlist"
              element={
                <WatchlistView
                  watchlistNews={watchlistNewsList}
                  onSelectNews={(id) => openNewsModal(id)}
                  onRemoveBookmark={toggleBookmarkNews}
                  onOpenIntelligence={openIntelligenceModal}
                />
              }
            />

            <Route
              path="/trending"
              element={
                <TrendingView
                  stars={stars}
                  onSelectStar={(id) => {
                    selectStar(id);
                    navigate(`/star/${id}`);
                  }}
                  followingIds={followingIds}
                  onToggleFollow={toggleFollowStar}
                  onOpenIntelligence={openIntelligenceModal}
                />
              }
            />

            <Route
              path="/movies"
              element={
                <MoviesView
                  stars={stars}
                  onSelectStar={(id) => {
                    selectStar(id);
                    navigate(`/star/${id}`);
                  }}
                  onOpenIntelligence={openIntelligenceModal}
                />
              }
            />

            <Route
              path="/movie/:id"
              element={<MovieDetailsRouteWrapper openIntelligenceModal={openIntelligenceModal} />}
            />

            <Route
              path="/news"
              element={
                <NewsListView
                  news={news}
                  onSelectNews={(id) => openNewsModal(id)}
                  watchlistIds={watchlistNewsIds}
                  onToggleBookmark={toggleBookmarkNews}
                />
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
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
        onSelectStar={(id) => {
          selectStar(id);
          navigate(`/star/${id}`);
        }}
        onSelectNews={(id) => openNewsModal(id)}
        onOpenIntelligence={openIntelligenceModal}
      />
    </div>
  );
};

export function AppContent() {
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

  const { stars, selectStar } = useStars();
  const { news, openNewsModal } = useNews();

  const isDarkMode = useDataStore((state) => state.isDarkMode);
  const toggleDarkMode = useDataStore((state) => state.toggleDarkMode);
  const showToast = useDataStore((state) => state.showToast);
  const isIntelligenceOpen = useDataStore((state) => state.isIntelligenceOpen);
  const intelligenceTargetStar = useDataStore((state) => state.intelligenceTargetStar);
  const openIntelligenceModal = useDataStore((state) => state.openIntelligenceModal);
  const closeIntelligenceModal = useDataStore((state) => state.closeIntelligenceModal);
  const loadLiveData = useDataStore((state) => state.loadLiveData);

  const navigate = useNavigate();

  // Initialize Auth & Data on load
  useEffect(() => {
    initializeAuth();
    loadLiveData();
  }, [initializeAuth, loadLiveData]);

  const handleLogout = () => {
    logout();
    showToast('Signed out of session.');
    navigate('/');
  };

  return (
    <Routes>
      {/* Landing Page Route */}
      <Route
        path="/"
        element={
          <div className={isDarkMode ? 'dark' : 'light'}>
            <LandingPageView
              onEnterTerminal={() => {
                if (isAuthenticated) {
                  navigate('/dashboard');
                } else {
                  navigate('/auth');
                }
              }}
              onSelectStar={(starId) => {
                selectStar(starId);
                navigate(`/star/${starId}`);
              }}
              onOpenIntelligence={(starName) => openIntelligenceModal(starName)}
              onRequestAccess={() => navigate('/auth')}
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
        }
      />

      {/* Auth / Request Access Route */}
      <Route
        path="/auth"
        element={
          <div className={isDarkMode ? 'dark' : 'light'}>
            <RequestAccessView
              onSuccess={() => {
                showToast('VIP Access Confirmed. Synced with MongoDB.');
                navigate('/dashboard');
              }}
              onCancelToDashboard={() => {
                if (isAuthenticated) {
                  navigate('/dashboard');
                } else {
                  navigate('/');
                }
              }}
            />
          </div>
        }
      />

      {/* Inner Terminal Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <MainLayout
              user={user}
              stars={stars}
              news={news}
              followingIds={followingIds}
              watchlistNewsIds={watchlistNewsIds}
              toggleFollowStar={toggleFollowStar}
              toggleBookmarkNews={toggleBookmarkNews}
              handleLogout={handleLogout}
              selectStar={selectStar}
              openNewsModal={openNewsModal}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
