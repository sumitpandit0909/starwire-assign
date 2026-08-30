import React from 'react';
import { NewsBrief } from '../../types';

interface NewsDetailModalProps {
  news: NewsBrief | null;
  onClose: () => void;
  onBookmark: (newsId: string) => void;
  isBookmarked: boolean;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  news,
  onClose,
  onBookmark,
  isBookmarked,
}) => {
  if (!news) return null;

  return (
    <div
      id="news-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        id="news-detail-modal-content"
        className="bg-[#1c1b1b] border border-[#4d4635]/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="w-full h-56 rounded-xl overflow-hidden relative border border-[#4d4635]/30">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b] via-transparent to-black/30" />
          <div className="absolute top-4 left-4">
            <span
              className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded bg-[#131313]/90 border border-white/10"
              style={{ color: news.categoryColor }}
            >
              {news.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#d0c5af]">
            <span>{news.timestamp}</span>
            <div className="flex items-center gap-3">
              {news.sourceName && (
                <span className="text-[#f2ca50] font-semibold">{news.sourceName}</span>
              )}
              <span>{news.readTime}</span>
            </div>
          </div>
          <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] leading-snug">
            {news.title}
          </h2>
          {news.author && (
            <p className="text-xs font-mono text-[#99907c]">By {news.author}</p>
          )}
        </div>

        {/* Narrative Content */}
        <div className="text-[#d0c5af] font-body-lg text-[16px] leading-relaxed space-y-4 font-light border-t border-[#4d4635]/25 pt-4">
          <p>{news.fullContent || news.summary}</p>
          {news.sourceUrl && (
            <div className="pt-2">
              <a
                href={news.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#f2ca50] hover:underline"
              >
                <span>Read original wire report on {news.sourceName || 'Source'}</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#4d4635]/25">
          <button
            onClick={() => onBookmark(news.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors ${
              isBookmarked
                ? 'bg-[#f2ca50] text-[#131313] border-[#f2ca50] font-bold'
                : 'border-[#4d4635]/50 text-[#d0c5af] hover:text-[#f2ca50]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isBookmarked ? 'bookmark_added' : 'bookmark'}
            </span>
            <span>{isBookmarked ? 'Saved to Watchlist' : 'Bookmark Brief'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-[#2a2a2a] text-[#FAF9F6] hover:text-[#f2ca50] text-xs font-mono uppercase tracking-wider"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
