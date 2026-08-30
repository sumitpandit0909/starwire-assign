import React from 'react';
import { TabView, UserStats } from '../../types';

interface SideNavProps {
  currentTab: TabView;
  onSelectTab: (tab: TabView) => void;
  user: UserStats;
  onOpenIntelligence: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  currentTab,
  onSelectTab,
  user,
  onOpenIntelligence,
  isDarkMode,
  onToggleTheme,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}) => {
  // Inner terminal navigation items only (No landing page button)
  const navItems: { id: TabView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'explore', label: 'Explore Stars', icon: 'star' },
    { id: 'trending', label: 'Trending', icon: 'trending_up' },
    { id: 'movies', label: 'Movies & TMDB', icon: 'movie' },
    { id: 'following', label: 'Following', icon: 'person_add' },
    { id: 'watchlist', label: 'Watchlist', icon: 'bookmark' },
    { id: 'news', label: 'News Wire', icon: 'newspaper' },
  ];

  const handleNavClick = (tab: TabView) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-nav-backdrop"
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <nav
        id="main-sidebar"
        className={`fixed left-0 top-0 h-full w-64 border-r border-[#4d4635]/20 bg-[#131313] dark:bg-[#131313] flex flex-col py-8 px-6 z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Brand Anchor */}
        <div
          id="sidebar-user-anchor"
          onClick={() => handleNavClick('dashboard')}
          className="mb-10 flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#99907c]/50 relative ring-1 ring-[#f2ca50]/30 group-hover:ring-[#f2ca50] transition-all">
            <img
              src={user.avatarUrl}
              alt={user.userName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-wordmark text-[14px] uppercase tracking-[0.4em] text-[#f2ca50] group-hover:text-[#ffe088] transition-colors">
              STARWIRE
            </h1>
            <p className="font-data-label text-[11px] text-[#d0c5af] mt-0.5 tracking-wider truncate max-w-[120px]">
              {user.userName}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === 'explore' && currentTab === 'star-details');
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-data-label text-[13px] uppercase tracking-wider transition-all duration-200 text-left cursor-pointer ${
                  isActive
                    ? 'text-[#f2ca50] font-bold border-r-2 border-[#f2ca50] bg-[#1c1b1b]'
                    : 'text-[#d0c5af] font-medium hover:text-[#f2ca50] hover:bg-[#1c1b1b]/60'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Intelligence Gold CTA Button */}
        <div className="pt-4">
          <button
            id="sidebar-view-intelligence-btn"
            onClick={onOpenIntelligence}
            className="w-full py-3 px-4 rounded-lg bg-[#d4af37] text-[#1A1A1A] font-data-value text-[13px] font-bold uppercase tracking-widest hover:bg-[#ffe088] transition-all duration-300 btn-glow flex items-center justify-center gap-2 active:scale-98 shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            AI Intelligence
          </button>
        </div>

        {/* Footer Actions / Theme / Sign Out */}
        <div className="mt-6 border-t border-[#4d4635]/20 pt-4 flex flex-col gap-1">
          <button
            id="nav-theme-toggle-btn"
            onClick={onToggleTheme}
            className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-[#d0c5af] font-data-label text-[12px] uppercase hover:text-[#f2ca50] hover:bg-[#1c1b1b] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px]">contrast</span>
              <span>Theme</span>
            </div>
            <span className="text-[10px] text-[#99907c]">{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>

          {onLogout && (
            <button
              id="nav-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-[#EF4444] font-data-label text-[12px] uppercase hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
