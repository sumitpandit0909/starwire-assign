import React, { useState, useEffect } from 'react';
import { Star } from '../../types';
import { fetchOpenRouterIntelligence } from '../../services/tmdbService';

interface IntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  stars: Star[];
  initialStarName?: string;
}

export const IntelligenceModal: React.FC<IntelligenceModalProps> = ({
  isOpen,
  onClose,
  stars,
  initialStarName,
}) => {
  const [selectedStarId, setSelectedStarId] = useState<string>(
    stars.find((s) => s.name === initialStarName)?.id || stars[0]?.id || 'shah-rukh-khan'
  );
  const [queryTopic, setQueryTopic] = useState<'roi' | 'sentiment' | 'boxoffice' | 'demographics'>('roi');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiReport, setAiReport] = useState<string>('');

  useEffect(() => {
    if (initialStarName) {
      const match = stars.find((s) => s.name.toLowerCase().includes(initialStarName.toLowerCase()));
      if (match) setSelectedStarId(match.id);
    }
  }, [initialStarName, stars]);

  const currentStar = stars.find((s) => s.id === selectedStarId) || stars[0] || {
    id: 'talent',
    name: 'Top Star',
    category: 'Pan India',
    starScore: 95.0,
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    dossierBio: 'Leading entertainment icon with top box office pull.',
  };

  const handleSimulate = async (customText?: string) => {
    setIsGenerating(true);
    try {
      const prompt = customText || `Provide an executive entertainment intelligence analysis on topic: "${queryTopic.toUpperCase()}" for ${currentStar.name}. Include box office multiples, audience reach, market traction, and growth velocity.`;
      const response = await fetchOpenRouterIntelligence(prompt, currentStar.name, {
        starScore: currentStar.starScore,
        category: currentStar.category,
        topic: queryTopic,
      });
      setAiReport(response);
    } catch (e) {
      console.warn('AI analysis error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && currentStar) {
      handleSimulate();
    }
  }, [isOpen, selectedStarId, queryTopic]);

  if (!isOpen) return null;


  return (
    <div
      id="intelligence-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        id="intelligence-modal-content"
        className="bg-[#1c1b1b] border border-[#d4af37]/40 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f2ca50]/15 flex items-center justify-center border border-[#f2ca50]/30">
              <span className="material-symbols-outlined text-[#f2ca50] text-[22px]">
                auto_awesome
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-xl md:text-2xl text-[#FAF9F6]">
                Starwire Intelligence Terminal
              </h2>
              <p className="font-data-label text-[11px] text-[#d0c5af] tracking-wider uppercase">
                Predictive Talent Equity &amp; Box Office Forecasting Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2a2a2a] text-[#d0c5af] hover:text-[#f2ca50] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Talent Selection & Module Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-data-label text-[11px] text-[#d0c5af] uppercase tracking-widest mb-1.5">
              Select Talent Dossier
            </label>
            <select
              value={selectedStarId}
              onChange={(e) => {
                setSelectedStarId(e.target.value);
                handleSimulate();
              }}
              className="w-full bg-[#2a2a2a] border border-[#4d4635]/40 text-[#f2ca50] font-semibold text-sm rounded-lg px-4 py-2.5 outline-none"
            >
              {stars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category} • Score: {s.starScore})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-data-label text-[11px] text-[#d0c5af] uppercase tracking-widest mb-1.5">
              Analysis Vector
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'roi', label: 'ROI Forecast' },
                { id: 'sentiment', label: 'Sentiment' },
                { id: 'boxoffice', label: 'Box Office' },
                { id: 'demographics', label: 'Diaspora' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setQueryTopic(tab.id as any);
                    handleSimulate();
                  }}
                  className={`py-2 px-2 text-center text-xs font-mono uppercase rounded-lg border transition-all ${
                    queryTopic === tab.id
                      ? 'bg-[#f2ca50] text-[#131313] border-[#f2ca50] font-bold'
                      : 'bg-[#201f1f] text-[#d0c5af] border-[#4d4635]/30 hover:border-[#f2ca50]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Intel Content Cards */}
        {isGenerating ? (
          <div className="py-16 text-center space-y-3">
            <span className="material-symbols-outlined text-[36px] text-[#f2ca50] animate-spin">
              progress_activity
            </span>
            <p className="font-mono text-xs text-[#d0c5af] tracking-widest uppercase">
              Synthesizing Multi-Territory Sentiment &amp; Theatrical Run Metrics...
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Profile Summary Bento */}
            <div className="p-5 rounded-xl bg-[#201f1f] border border-[#4d4635]/30 flex flex-col sm:flex-row items-center gap-6">
              <img
                src={currentStar.avatarImage}
                alt={currentStar.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-[#f2ca50]"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-headline-md text-xl text-[#FAF9F6]">{currentStar.name}</h3>
                  <span className="bg-[#f2ca50]/15 text-[#f2ca50] text-[10px] font-mono px-2 py-0.5 rounded border border-[#f2ca50]/30">
                    {currentStar.category}
                  </span>
                </div>
                <p className="text-xs text-[#d0c5af] line-clamp-2">{currentStar.dossierBio}</p>
              </div>

              <div className="flex sm:flex-col justify-around gap-4 border-t sm:border-t-0 sm:border-l border-[#4d4635]/30 pt-3 sm:pt-0 sm:pl-6 text-center">
                <div>
                  <span className="text-[10px] font-mono text-[#99907c] block">PREDICTIVE EQUITY</span>
                  <span className="text-xl font-bold font-mono text-[#f2ca50]">{currentStar.starScore} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#99907c] block">CONFIDENCE</span>
                  <span className="text-sm font-mono text-[#10B981] font-semibold">96.4% Verified</span>
                </div>
              </div>
            </div>

            {/* Detailed Vector Breakdown */}
            {queryTopic === 'roi' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono uppercase text-[#f2ca50] block mb-1">Expected Day-1 Opening</span>
                  <p className="text-2xl font-bold text-[#FAF9F6] font-mono">₹65 - 85 Cr</p>
                  <span className="text-[11px] text-[#10B981] font-mono block mt-1">+24% vs. Category Median</span>
                </div>
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono uppercase text-[#f2ca50] block mb-1">Lifetime Gross Multiple</span>
                  <p className="text-2xl font-bold text-[#FAF9F6] font-mono">4.2x Budget</p>
                  <span className="text-[11px] text-[#d0c5af] font-mono block mt-1">Tier-1 Tentpole Multiplier</span>
                </div>
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono uppercase text-[#f2ca50] block mb-1">Non-Theatrical Pre-Sales</span>
                  <p className="text-2xl font-bold text-[#FAF9F6] font-mono">₹160 - 220 Cr</p>
                  <span className="text-[11px] text-[#10B981] font-mono block mt-1">OTT + Satellite + Audio</span>
                </div>
              </div>
            )}

            {queryTopic === 'sentiment' && (
              <div className="p-5 rounded-xl bg-[#201f1f] border border-[#4d4635]/30 space-y-4">
                <h4 className="font-headline-md text-lg text-[#FAF9F6]">Real-Time Audience Sentiment Index</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-[#10B981]/10 rounded-lg border border-[#10B981]/30">
                    <span className="text-xs font-mono text-[#10B981] block">Positive / Adoring</span>
                    <span className="text-2xl font-bold text-[#10B981] font-mono">88%</span>
                  </div>
                  <div className="p-3 bg-[#f2ca50]/10 rounded-lg border border-[#f2ca50]/30">
                    <span className="text-xs font-mono text-[#f2ca50] block">Neutral Discussion</span>
                    <span className="text-2xl font-bold text-[#f2ca50] font-mono">9%</span>
                  </div>
                  <div className="p-3 bg-[#EF4444]/10 rounded-lg border border-[#EF4444]/30">
                    <span className="text-xs font-mono text-[#EF4444] block">Critical / Friction</span>
                    <span className="text-2xl font-bold text-[#EF4444] font-mono">3%</span>
                  </div>
                </div>
                <p className="text-xs text-[#d0c5af] font-light leading-relaxed">
                  Key sentiment driver: Unusually high repeat-viewing intent for high-concept spectacles and high organic social share velocity across tier-1 & tier-2 regional centers.
                </p>
              </div>
            )}

            {queryTopic === 'boxoffice' && (
              <div className="p-5 rounded-xl bg-[#201f1f] border border-[#4d4635]/30 space-y-3">
                <h4 className="font-headline-md text-lg text-[#FAF9F6]">Benchmark Theatrical Performances</h4>
                <div className="divide-y divide-[#4d4635]/20 text-xs font-mono">
                  {(currentStar.films || []).map((film) => (
                    <div key={film.title} className="py-2.5 flex justify-between items-center">
                      <div>
                        <span className="text-[#FAF9F6] font-semibold font-sans">{film.title}</span>
                        <span className="text-[#99907c] ml-2">({film.year})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#f2ca50] font-bold">{film.boxOffice}</span>
                        <span className="text-[#10B981]">{film.verdict}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {queryTopic === 'demographics' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono text-[#f2ca50] block mb-1">North America & UK</span>
                  <p className="text-xl font-bold text-[#FAF9F6] font-mono">$15M - $22M</p>
                  <span className="text-[11px] text-[#d0c5af] block mt-1">Per tentpole premiere cycle</span>
                </div>
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono text-[#f2ca50] block mb-1">Gulf & Middle East</span>
                  <p className="text-xl font-bold text-[#FAF9F6] font-mono">$12M - $18M</p>
                  <span className="text-[11px] text-[#10B981] block mt-1">Market Dominance #1</span>
                </div>
                <div className="p-4 rounded-xl bg-[#2a2a2a]/60 border border-[#4d4635]/30">
                  <span className="text-[10px] font-mono text-[#f2ca50] block mb-1">Australia & Far East</span>
                  <p className="text-xl font-bold text-[#FAF9F6] font-mono">$6M - $9M</p>
                  <span className="text-[11px] text-[#d0c5af] block mt-1">Expanding footprint</span>
                </div>
              </div>
            )}

            {/* Live OpenRouter AI Synthesis Section */}
            {aiReport && (
              <div className="p-5 rounded-xl bg-[#141414] border border-[#f2ca50]/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#4d4635]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#f2ca50] text-[18px]">smart_toy</span>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-[#f2ca50] font-bold">
                      OpenRouter AI Live Intelligence Synthesis
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono bg-[#f2ca50]/15 text-[#f2ca50] px-2 py-0.5 rounded border border-[#f2ca50]/30">
                    nvidia/nemotron-3.5-lightning:free
                  </span>
                </div>
                <div className="text-xs text-[#e5e2e1] whitespace-pre-line leading-relaxed font-sans prose-invert">
                  {aiReport}
                </div>
              </div>
            )}

            {/* Custom AI Query Box */}
            <div className="pt-2">
              <label className="block font-data-label text-[11px] text-[#d0c5af] uppercase tracking-widest mb-1.5">
                Generate Custom Intelligence Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customPrompt.trim()) {
                      handleSimulate(customPrompt.trim());
                    }
                  }}
                  placeholder={`e.g. Compare ${currentStar.name}'s franchise pull vs. historical box office records...`}
                  className="flex-1 bg-[#201f1f] border border-[#4d4635]/40 rounded-lg px-4 py-2.5 text-xs text-[#FAF9F6] focus:border-[#f2ca50] outline-none"
                />
                <button
                  onClick={() => customPrompt.trim() && handleSimulate(customPrompt.trim())}
                  disabled={!customPrompt.trim() || isGenerating}
                  className="px-5 py-2.5 rounded-lg bg-[#d4af37] text-[#131313] font-bold text-xs uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">sparkles</span>
                  <span>Run Analysis</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
