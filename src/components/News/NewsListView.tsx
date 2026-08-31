import React, { useState } from 'react';
import { NewsBrief } from '../../types';

interface NewsListViewProps {
  news: NewsBrief[];
  onSelectNews: (newsId: string) => void;
  watchlistIds: string[];
  onToggleBookmark: (newsId: string, e: React.MouseEvent) => void;
  onOpenIntelligence?: (movieName?: string) => void;
  loading?: boolean;
}

// Shimmer Skeleton Card Placeholder for News
const SkeletonNewsCard: React.FC = () => (
  <div className="bg-[#1c1b1b] border border-[#4d4635]/20 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-96">
    <div className="bg-[#2a2a2a] h-48 w-full" />
    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-[#2a2a2a] rounded w-1/3" />
        <div className="h-5 bg-[#2a2a2a] rounded w-full" />
        <div className="h-4 bg-[#2a2a2a] rounded w-4/5" />
      </div>
      <div className="h-4 bg-[#201f1f] rounded w-full pt-2" />
    </div>
  </div>
);

export const NewsListView: React.FC<NewsListViewProps> = ({
  news,
  onSelectNews,
  watchlistIds,
  onToggleBookmark,
  loading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'BOX OFFICE', 'PRODUCTION', 'CASTING', 'OTT & STREAMING'];

  const filteredNews = selectedCategory === 'ALL'
    ? news
    : news.filter((n) => n.category.toUpperCase() === selectedCategory);

  return (
    <div id="news-list-view-container" className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
            Entertainment &amp; Industry News Wire
          </h1>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Live news coverage of theatrical box office, studio production, casting announcements, and star intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#1c1b1b] px-4 py-2 rounded-xl border border-[#4d4635]/30 text-xs font-mono">
          <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">newspaper</span>
          <span className="text-[#FAF9F6] font-bold">{filteredNews.length} Live Articles</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-[#4d4635]/25 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`font-data-label text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-md'
                : 'bg-[#1c1b1b] text-[#d0c5af] hover:text-[#FAF9F6] border border-[#4d4635]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Grid / Skeleton Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonNewsCard key={n} />
          ))}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const isSaved = watchlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectNews(item.id)}
                className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all shadow-xl hover:scale-101"
              >
                {/* Article Thumbnail */}
                <div className="relative h-52 w-full overflow-hidden bg-[#201f1f]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-transparent opacity-80" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#131313]/90 border border-white/10 backdrop-blur-sm"
                      style={{ color: item.categoryColor || '#f2ca50' }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={(e) => onToggleBookmark(item.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-[#f2ca50] text-[#131313]'
                        : 'bg-[#131313]/80 text-[#d0c5af] hover:text-[#FAF9F6]'
                    }`}
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark News'}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isSaved ? 'bookmark_added' : 'bookmark'}
                    </span>
                  </button>
                </div>

                {/* Article Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-headline-md text-lg text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-2 font-bold">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#d0c5af] line-clamp-3 font-light leading-relaxed">
                      {item.summary || item.snippet}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#4d4635]/25 flex items-center justify-between text-xs font-mono text-[#99907c]">
                    <span>{item.timestamp || 'Just now'}</span>
                    <span className="text-[#f2ca50] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center bg-[#1c1b1b] rounded-2xl border border-[#4d4635]/30 space-y-3">
          <p className="text-[#FAF9F6] font-medium">No live news stories found for category "{selectedCategory}".</p>
          <p className="text-xs text-[#d0c5af]">Try switching to ALL to view all live entertainment news stories.</p>
        </div>
      )}
    </div>
  );
};
