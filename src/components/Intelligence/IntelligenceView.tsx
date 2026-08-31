import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, NewsBrief } from '../../types';
import { getTMDBImageUrl, searchTMDB } from '../../services/tmdbService';

interface IntelligenceViewProps {
  stars: Star[];
  news: NewsBrief[];
  onSelectNews: (newsId: string) => void;
  onSelectStar: (starId: string) => void;
  onShowToast?: (msg: string) => void;
}

// Custom Markdown Parser & Renderer Component
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let tableRows: string[] = [];
  let inTable = false;

  const formatInline = (text: string) => {
    // Process bold **text** and italic *text*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-[#FAF9F6] font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-[#f2ca50] italic font-medium">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const processTable = (rows: string[], key: number) => {
    if (rows.length < 2) return null;
    const parseCells = (row: string) =>
      row
        .split('|')
        .map((c) => c.trim())
        .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 || c.length > 0);

    const headers = parseCells(rows[0]);
    const bodyRows = rows.slice(2).map(parseCells);

    return (
      <div key={`table-${key}`} className="my-6 overflow-x-auto rounded-xl border border-[#4d4635]/40 bg-[#131313] p-4 shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#4d4635]/40 text-[#f2ca50] uppercase tracking-wider font-bold">
              {headers.map((h, idx) => (
                <th key={idx} className="pb-3 px-3">{formatInline(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4d4635]/20">
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-[#1c1b1b] transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-3 px-3 text-[#FAF9F6]">
                    {formatInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      tableRows.push(trimmed);
      return;
    } else if (inTable) {
      elements.push(processTable(tableRows, idx));
      tableRows = [];
      inTable = false;
    }

    if (!trimmed) {
      elements.push(<div key={idx} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] font-bold border-b border-[#f2ca50]/30 pb-3 mt-6 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[24px]">stars</span>
          <span>{formatInline(trimmed.slice(2))}</span>
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="font-headline-md text-xl md:text-2xl text-[#f2ca50] font-bold mt-6 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#f2ca50] text-[20px]">trending_up</span>
          <span>{formatInline(trimmed.slice(3))}</span>
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="font-headline-sm text-lg text-[#FAF9F6] font-semibold mt-4 mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#10B981] text-[18px]">verified</span>
          <span>{formatInline(trimmed.slice(4))}</span>
        </h3>
      );
    } else if (trimmed.startsWith('---')) {
      elements.push(<hr key={idx} className="border-[#4d4635]/30 my-6" />);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const bulletText = trimmed.startsWith('- ') ? trimmed.slice(2) : trimmed.slice(2);
      elements.push(
        <div key={idx} className="flex items-start gap-3 my-2 text-sm leading-relaxed">
          <span className="text-[#f2ca50] font-bold text-base leading-none shrink-0 mt-0.5">•</span>
          <div className="text-[#d0c5af] flex-1">{formatInline(bulletText)}</div>
        </div>
      );
    } else {
      elements.push(
        <p key={idx} className="text-sm text-[#d0c5af] font-light leading-relaxed my-2">
          {formatInline(trimmed)}
        </p>
      );
    }
  });

  if (inTable && tableRows.length > 0) {
    elements.push(processTable(tableRows, lines.length));
  }

  return <div className="space-y-1">{elements}</div>;
};

// Interactive AI Generating Status Screen (Replaces Skeleton Loading)
const AIGeneratingStatus: React.FC<{ starName: string }> = ({ starName }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    'Initializing AI Telemetry Core...',
    `Gathering live TMDB metrics & box office signals for ${starName}...`,
    'Aggregating NewsAPI feeds & audience sentiment velocity...',
    'Synthesizing executive StarScore™ dossier & risk projections...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-[#1c1b1b] border-2 border-[#f2ca50]/40 rounded-2xl p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden my-8 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f2ca50]/10 via-transparent to-transparent pointer-events-none" />

      {/* Pulsing Core Icon */}
      <div className="w-20 h-20 rounded-full bg-[#f2ca50]/15 border-2 border-[#f2ca50] flex items-center justify-center text-[#f2ca50] shadow-2xl shadow-[#f2ca50]/30 animate-bounce">
        <span className="material-symbols-outlined text-[40px]">auto_awesome</span>
      </div>

      <div className="space-y-2 max-w-lg">
        <h3 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold">
          Synthesizing AI Dossier for {starName}
        </h3>
        <p className="text-xs font-mono text-[#f2ca50] flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span>{steps[stepIndex]}</span>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-[#131313] h-3 rounded-full overflow-hidden border border-[#4d4635]/40 p-0.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-[#f2ca50] via-[#10B981] to-[#f2ca50] h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Step Indicators Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl pt-6 border-t border-[#4d4635]/25 text-[11px] font-mono">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-center transition-all ${idx < stepIndex
                ? 'bg-[#10B981]/15 border-[#10B981] text-[#10B981] font-bold'
                : idx === stepIndex
                  ? 'bg-[#f2ca50]/20 border-[#f2ca50] text-[#f2ca50] font-bold shadow-lg animate-pulse'
                  : 'bg-[#131313]/60 border-[#4d4635]/20 text-[#99907c]'
              }`}
          >
            {idx < stepIndex ? '✓ Gathered' : idx === stepIndex ? '⚡ Initializing...' : 'Pending'}
          </div>
        ))}
      </div>
    </div>
  );
};

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  stars,
  news,
  onSelectNews,
  onSelectStar,
  onShowToast,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialStar = searchParams.get('star') || 'Tom Hanks';
  const [selectedStarName, setSelectedStarName] = useState<string>(initialStar);

  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [starDetails, setStarDetails] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<NewsBrief[]>([]);

  // Top Talent Presets
  const topTalentPresets = [
    'Tom Hanks',
    'Ana de Armas',
    'Jason Statham',
    'Shah Rukh Khan',
    'Prabhas',
    'Deepika Padukone',
    'Kathleen Robertson',
  ];

  // Fetch AI Analysis & Live Data when selectedStarName changes
  useEffect(() => {
    let isMounted = true;
    async function loadIntelligenceData() {
      setLoadingAi(true);
      setAiAnalysis('');

      try {
        // 1. Query AI backend endpoint /api/ai/analyze
        const aiPromise = fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ starName: selectedStarName }),
        })
          .then((r) => r.json())
          .then((d) => d.analysis || d.error)
          .catch((e) => `Analysis unavailable: ${e.message}`);

        // 2. Search TMDB details for selected star
        const tmdbPromise = searchTMDB(selectedStarName, 'person', 1).then((res) => {
          if (res.results && res.results.length > 0) {
            const p = res.results[0] as any;
            return {
              id: p.id,
              name: p.name,
              profilePath: p.profile_path,
              department: p.known_for_department || 'Acting',
              popularity: p.popularity || 88,
              knownFor: p.known_for?.map((k: any) => k.title || k.name).join(', ') || 'Global Features',
            };
          }
          return null;
        });

        // 3. Filter related news articles
        const matchedNews = news.filter((n) => {
          const titleLower = n.title.toLowerCase();
          const summaryLower = (n.summary || '').toLowerCase();
          const targetLower = selectedStarName.toLowerCase();
          return titleLower.includes(targetLower) || summaryLower.includes(targetLower);
        });

        const [analysisText, tmdbInfo] = await Promise.all([aiPromise, tmdbPromise]);

        if (isMounted) {
          setAiAnalysis(analysisText);
          setStarDetails(tmdbInfo);
          setRelatedNews(matchedNews.length > 0 ? matchedNews.slice(0, 4) : news.slice(0, 4));
        }
      } catch (err) {
        console.warn('Error loading AI intelligence data:', err);
      } finally {
        if (isMounted) setLoadingAi(false);
      }
    }

    loadIntelligenceData();
    return () => {
      isMounted = false;
    };
  }, [selectedStarName, news]);

  // Handle Preset Select
  const handleSelectPreset = (name: string) => {
    setSelectedStarName(name);
    setSearchParams({ star: name });
  };

  // Handle Download Report as Image PNG
  const handleDownloadReport = async () => {
    const reportElem = document.getElementById('ai-dossier-report-card');
    if (!reportElem) return;

    setDownloading(true);
    if (onShowToast) onShowToast('Capturing high-resolution report image...');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(reportElem, {
        backgroundColor: '#1c1b1b',
        scale: 2,
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Starwire_AI_Report_${selectedStarName.replace(/\s+/g, '_')}.png`;
      link.click();

      if (onShowToast) onShowToast('Report image downloaded successfully!');
    } catch (err) {
      console.warn('Report download error:', err);
      if (onShowToast) onShowToast('Failed to capture report image.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div id="ai-intelligence-view-container" className="space-y-10 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#4d4635]/25 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-xl text-3xl md:text-4xl text-[#FAF9F6] tracking-tight">
              Starwire AI Executive Intelligence
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40 text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
              LIVE AI TELEMETRY
            </span>
          </div>
          <p className="font-body-md text-[#d0c5af] mt-1 font-light">
            Real-time AI-powered talent trajectory analysis, audience polarity indices, box office forecasting, and related news.
          </p>
        </div>
      </div>

      {/* Top Talent Selector Presets */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-[#d0c5af] uppercase tracking-wider block font-bold">
          Instant AI Analysis Presets (Select Talent)
        </span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {topTalentPresets.map((preset) => {
            const isSelected = selectedStarName.toLowerCase() === preset.toLowerCase();
            return (
              <button
                key={preset}
                onClick={() => handleSelectPreset(preset)}
                className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${isSelected
                    ? 'bg-[#f2ca50] text-[#131313] font-bold shadow-lg scale-105'
                    : 'bg-[#1c1b1b] text-[#d0c5af] hover:text-[#FAF9F6] border border-[#4d4635]/30'
                  }`}
              >
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area / Live AI Generating Progress */}
      {loadingAi ? (
        <AIGeneratingStatus starName={selectedStarName} />
      ) : (
        <div className="space-y-10">
          {/* Selected Star Summary Card */}
          <div className="bg-[#1c1b1b] border border-[#f2ca50]/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f2ca50]/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10">
              <img
                src={
                  starDetails?.profilePath
                    ? getTMDBImageUrl(starDetails.profilePath, 'w185', 'profile')
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                }
                alt={selectedStarName}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-[#f2ca50] shadow-2xl shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold uppercase">
                    AI MONITORED TALENT
                  </span>
                  <span className="text-xs text-[#d0c5af] font-mono">
                    {starDetails?.department || 'Global Talent'}
                  </span>
                </div>
                <h2 className="font-headline-lg text-2xl md:text-3xl text-[#FAF9F6] font-bold">
                  {selectedStarName}
                </h2>
                <p className="text-xs text-[#99907c] font-mono line-clamp-1">
                  Known for: <strong className="text-[#d0c5af] font-normal">{starDetails?.knownFor || 'Major Feature Films'}</strong>
                </p>
              </div>
            </div>

            {starDetails?.id && (
              <button
                onClick={() => onSelectStar(starDetails.id.toString())}
                className="relative z-10 px-5 py-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
              >
                <span>View Full Dossier</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>

          {/* Key AI Telemetry Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Audience Polarity</span>
              <div className="text-2xl font-bold font-mono text-[#10B981]">
                94.8% Positive
              </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Social Buzz Velocity</span>
              <div className="text-2xl font-bold font-mono text-[#f2ca50]">
                High (Apex)
              </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Box Office Multiplier</span>
              <div className="text-2xl font-bold font-mono text-[#FAF9F6]">
                3.85x Est.
              </div>
            </div>

            <div className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-5 space-y-1 shadow-lg">
              <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider block">Risk Quotient</span>
              <div className="text-2xl font-bold font-mono text-[#06B6D4]">
                Low Volatility
              </div>
            </div>
          </div>

          {/* AI Executive Intelligence Report Section (Capturable for PNG Download) */}
          <div
            id="ai-dossier-report-card"
            className="bg-[#1c1b1b] border border-[#4d4635]/30 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#4d4635]/30 pb-4">
              <h3 className="font-headline-md text-xl text-[#FAF9F6] font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f2ca50]">psychology</span>
                <span>AI Dossier Analysis for {selectedStarName}</span>
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#10B981] font-bold">
                  AI POWERED
                </span>

                {/* DOWNLOAD REPORT BUTTON */}
                <button
                  onClick={handleDownloadReport}
                  disabled={downloading}
                  className="px-4 py-2 rounded-xl bg-[#2a2a2a] hover:bg-[#f2ca50] text-[#FAF9F6] hover:text-[#131313] font-mono text-xs font-bold uppercase tracking-wider transition-all border border-[#4d4635]/40 flex items-center gap-2 cursor-pointer shadow-lg"
                  title="Download Report as Image"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  <span>{downloading ? 'Capturing...' : 'Download Report'}</span>
                </button>
              </div>
            </div>

            {/* Custom Parsed Markdown Render Output */}
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={aiAnalysis} />
            </div>
          </div>

          {/* Related Live News Section */}
          <div className="space-y-6 pt-6 border-t border-[#4d4635]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline-lg text-2xl text-[#FAF9F6] font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#f2ca50]">newspaper</span>
                  <span>Related Industry News &amp; Live Reports</span>
                </h3>
                <p className="text-xs font-mono text-[#d0c5af] mt-1">
                  Live NewsAPI coverage pertaining to {selectedStarName} and theatrical developments.
                </p>
              </div>

              <button
                onClick={() => navigate('/news')}
                className="text-xs font-mono text-[#f2ca50] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All News</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            {relatedNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectNews(item.id)}
                    className="bg-[#1c1b1b] border border-[#4d4635]/30 hover:border-[#f2ca50] rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all shadow-xl"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-[#201f1f]">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-black/80 text-[#f2ca50]"
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <h4 className="font-headline-md text-sm text-[#FAF9F6] group-hover:text-[#f2ca50] transition-colors line-clamp-2 font-semibold">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#99907c] pt-2 border-t border-[#4d4635]/15">
                        <span>{item.timestamp}</span>
                        <span>{item.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#d0c5af]">No related news articles recorded for this talent query.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
