import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserStats, Star, NewsBrief } from '../../types';

interface TopNavProps {
  user: UserStats;
  onOpenSearch?: () => void;
  onToggleMobileNav: () => void;
  stars: Star[];
  news: NewsBrief[];
  onSelectStar: (starId: string) => void;
  onSelectNews: (newsId: string) => void;
  followingIds: string[];
  watchlistIds: string[];
  onOpenWatchlist: () => void;
  onOpenFollowing: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  user,
  onToggleMobileNav,
  watchlistIds,
  isDarkMode,
  onToggleTheme,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 w-full bg-[#131313]/85 backdrop-blur-xl border-b border-[#4d4635]/15 shadow-sm h-16"
    >
      <div className="flex justify-between items-center h-full px-4 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Left Brand / Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-trigger"
            onClick={onToggleMobileNav}
            className="md:hidden text-[#d0c5af] hover:text-[#f2ca50] p-1.5 rounded cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span
            onClick={() => navigate('/dashboard')}
            className="font-wordmark text-[14px] uppercase tracking-[0.35em] text-[#f2ca50] cursor-pointer hover:text-[#ffe088] transition-colors"
          >
            STARWIRE
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] text-[#10B981] tracking-widest uppercase px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 font-bold">
            LIVE ANALYTICS
          </span>
        </div>

        {/* Right Actions (Theme Switcher, Watchlist, User Profile, Sign Out) */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Quick Theme Switcher Button */}
          <button
            id="top-theme-toggle-btn"
            onClick={onToggleTheme}
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-2 rounded-full hover:bg-[#201f1f] relative flex items-center justify-center cursor-pointer"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Light / Dark Theme"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>



          {/* Logged in User Profile Info & Sign Out Button */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-2 border-l border-[#4d4635]/30 cursor-pointer group hover:opacity-90 transition-opacity"
            title="View Profile Settings"
          >
            <img
              src={user.avatarUrl}
              alt={user.userName}
              className="w-8 h-8 rounded-full object-cover border border-[#f2ca50]/40 group-hover:border-[#f2ca50] transition-colors shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors truncate max-w-[110px]">
                {user.userName}
              </p>
              <p className="text-[10px] text-[#f2ca50] font-mono">Profile ↗</p>
            </div>
          </div>

          {onLogout && (
            <button
              id="top-logout-btn"
              onClick={onLogout}
              className="text-[#EF4444] hover:text-[#ff6b6b] p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition-colors ml-1 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
