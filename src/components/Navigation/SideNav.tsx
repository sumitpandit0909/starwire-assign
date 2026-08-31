import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserStats } from '../../types';

interface SideNavProps {
  user: UserStats;
  onOpenIntelligence: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  user,
  onOpenIntelligence,
  isDarkMode,
  onToggleTheme,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/explore', label: 'Explore Stars', icon: 'star' },
    { path: '/trending', label: 'Trending', icon: 'trending_up' },
    { path: '/movies', label: 'Movies & TMDB', icon: 'movie' },
    { path: '/following', label: 'Following', icon: 'group' },
    { path: '/watchlist', label: 'Watchlist', icon: 'bookmark' },
    { path: '/news', label: 'News Wire', icon: 'newspaper' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
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
        {/* Company Brand Header Anchor */}
        <div
          id="sidebar-company-brand"
          onClick={() => handleNavClick('/dashboard')}
          className="mb-10 flex items-center gap-3.5 cursor-pointer group px-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] shadow-lg shadow-[#f2ca50]/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[24px] font-bold">auto_awesome</span>
          </div>
          <div>
            <h1 className="font-wordmark text-base uppercase tracking-[0.35em] text-[#f2ca50] group-hover:text-[#ffe088] transition-colors font-bold">
              STARWIRE
            </h1>
            <p className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-bold">
              INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/explore' && location.pathname.startsWith('/star/'));
            return (
              <button
                key={item.path}
                id={`nav-link-${item.path.replace('/', '')}`}
                onClick={() => handleNavClick(item.path)}
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
            onClick={() => handleNavClick('/intelligence')}
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
