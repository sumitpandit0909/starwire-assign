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
  isDarkMode,
  onToggleTheme,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header
      id="top-header"
      className="sticky top-0 z-30 w-full bg-[#131313]/90 backdrop-blur-xl border-b border-[#4d4635]/15 shadow-sm h-16"
    >
      <div className="flex justify-between items-center h-full px-3 sm:px-6 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Left Brand / Mobile Trigger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            id="mobile-menu-trigger"
            onClick={onToggleMobileNav}
            className="md:hidden text-[#d0c5af] hover:text-[#f2ca50] p-1.5 rounded cursor-pointer shrink-0"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <span
            onClick={() => navigate('/dashboard')}
            className="font-wordmark text-[13px] sm:text-[14px] uppercase tracking-[0.25em] sm:tracking-[0.35em] text-[#f2ca50] cursor-pointer hover:text-[#ffe088] transition-colors font-bold"
          >
            STARWIRE
          </span>
          <span className="hidden sm:inline-block font-mono text-[9px] text-[#10B981] tracking-widest uppercase px-2 py-0.5 rounded bg-[#10B981]/10 border border-[#10B981]/30 font-bold">
            LIVE ANALYTICS
          </span>
        </div>

        {/* Right Actions (Theme Switcher, User Profile, Sign Out) */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Quick Theme Switcher Button (Compact icon) */}
          <button
            id="top-theme-toggle-btn"
            onClick={onToggleTheme}
            className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors p-1.5 rounded-full hover:bg-[#201f1f] relative flex items-center justify-center shrink-0 cursor-pointer"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Light / Dark Theme"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Logged in User Profile Info & Avatar (Guaranteed 32px Full Round) */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#4d4635]/30 cursor-pointer group hover:opacity-90 transition-opacity shrink-0"
            title="View Profile Settings"
          >
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-full overflow-hidden border-2 border-[#f2ca50]/60 group-hover:border-[#f2ca50] transition-colors shadow-sm shrink-0 aspect-square flex items-center justify-center bg-[#1c1b1b]">
              <img
                src={user.avatarUrl}
                alt={user.userName}
                className="w-full h-full object-cover rounded-full aspect-square shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';
                }}
              />
            </div>
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
              className="text-[#EF4444] hover:text-[#ff6b6b] p-1.5 rounded-lg hover:bg-[#EF4444]/10 transition-colors shrink-0 cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
