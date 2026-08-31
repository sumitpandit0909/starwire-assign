import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserStats } from '../../types';

interface SideNavProps {
  user: UserStats;
  onOpenIntelligence: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState<boolean>(false);

  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalIsCollapsed(!internalIsCollapsed));

  // On mobile drawer overlay, always show full text labels & titles
  const showText = !isCollapsed || isOpenMobile;

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
        className={`fixed left-0 top-0 h-full border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] flex flex-col py-6 z-50 transition-all duration-300 ${
          isCollapsed ? 'w-64 md:w-20 px-4 md:px-3' : 'w-64 px-5'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Company Brand Header Anchor & Collapse / Close Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div
            id="sidebar-company-brand"
            onClick={() => handleNavClick('/dashboard')}
            className={`flex items-center gap-3 cursor-pointer group ${!showText ? 'justify-center w-full' : ''}`}
            title="Starwire Intelligence"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f2ca50] to-[#d4af37] flex items-center justify-center text-[#131313] shadow-lg shadow-[#f2ca50]/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-[24px] font-bold">auto_awesome</span>
            </div>
            {showText && (
              <div className="overflow-hidden transition-all duration-300">
                <h1 className="font-wordmark text-base uppercase tracking-[0.35em] text-[#f2ca50] group-hover:text-[#ffe088] transition-colors font-bold whitespace-nowrap">
                  STARWIRE
                </h1>
                <p className="font-mono text-[9px] text-[#10B981] tracking-widest uppercase font-bold whitespace-nowrap">
                  INTELLIGENCE
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#1c1b1b] transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
          )}

          {/* Mobile Close Button */}
          {isOpenMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#d0c5af] hover:text-[#f2ca50] hover:bg-[#1c1b1b] transition-colors cursor-pointer"
              title="Close Navigation"
              aria-label="Close Navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Collapsed Mode Expand Button (Desktop Only) */}
        {isCollapsed && !isOpenMobile && (
          <button
            onClick={toggleCollapse}
            className="hidden md:flex mx-auto mb-6 p-2 rounded-xl bg-[#1c1b1b] border border-[#4d4635]/30 text-[#d0c5af] hover:text-[#f2ca50] hover:border-[#f2ca50] transition-all cursor-pointer shadow-md justify-center items-center"
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        )}

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/explore' && location.pathname.startsWith('/star/'));
            return (
              <button
                key={item.path}
                id={`nav-link-${item.path.replace('/', '')}`}
                onClick={() => handleNavClick(item.path)}
                title={!showText ? item.label : undefined}
                className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer ${
                  !showText
                    ? 'justify-center p-3'
                    : 'gap-3.5 px-4 py-3 text-left font-data-label text-[13px] uppercase tracking-wider'
                } ${
                  isActive
                    ? 'text-[#f2ca50] font-bold bg-[#1c1b1b] border-r-2 border-[#f2ca50]'
                    : 'text-[#d0c5af] font-medium hover:text-[#f2ca50] hover:bg-[#1c1b1b]/60'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[22px] shrink-0"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {showText && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* AI Intelligence Gold CTA Button */}
        <div className="pt-4 mt-auto">
          <button
            id="sidebar-view-intelligence-btn"
            onClick={() => handleNavClick('/intelligence')}
            title={!showText ? 'AI Intelligence' : undefined}
            className={`w-full rounded-xl bg-[#d4af37] text-[#1A1A1A] font-data-value font-bold uppercase tracking-widest hover:bg-[#ffe088] transition-all duration-300 btn-glow flex items-center justify-center cursor-pointer shadow-md ${
              !showText ? 'p-3' : 'py-3 px-4 text-[13px] gap-2 active:scale-98'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">auto_awesome</span>
            {showText && <span>AI Intelligence</span>}
          </button>
        </div>
      </nav>
    </>
  );
};
