export type TabView = 'landing' | 'dashboard' | 'explore' | 'star-details' | 'trending' | 'movies' | 'following' | 'watchlist' | 'news' | 'auth';

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  budget?: number;
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
  credits?: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
    }[];
  };
}

export interface TMDBPerson {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for?: TMDBMovie[];
  movie_credits?: {
    cast: (TMDBMovie & { character: string })[];
    crew: (TMDBMovie & { job: string; department: string })[];
  };
  external_ids?: {
    imdb_id?: string;
    instagram_id?: string;
    twitter_id?: string;
  };
}

export interface StarMetricHistory {
  period: '1M' | '3M' | '6M' | '1Y' | 'ALL';
  points: { label: string; value: number }[];
}

export interface StarFilm {
  title: string;
  year: number;
  role: string;
  boxOffice: string;
  verdict: 'All-Time Blockbuster' | 'Blockbuster' | 'Super Hit' | 'Hit' | 'Average';
  roi: string;
  sentiment: number; // percentage
  posterUrl?: string;
  director?: string;
  genre?: string;
  releaseStatus?: 'In Theatres' | 'Streaming' | 'Upcoming' | 'All-Time';
}

export interface Star {
  id: string;
  tmdbId?: number;
  name: string;
  roles: string[];
  category: 'Bollywood' | 'South' | 'Pan India';
  industry: string; // e.g. Hindi, Tamil, Telugu
  language: string;
  starScore: number;
  starScoreTotal?: number;
  buzzDelta: number; // e.g. +12 or -2
  reach: string; // e.g. 45M
  globalReachCount?: string; // e.g. 14.1M
  buzzMeter?: number; // e.g. 84
  engagementRate?: string; // e.g. 12.8%
  engagementDelta?: number; // e.g. +1.2%
  avatarImage: string;
  dossierImage?: string;
  coverImage?: string;
  verified: boolean;
  dossierBio: string;
  birthDate?: string;
  debutYear?: number;
  activeSignals: {
    audienceSentiment: string;
    sentimentScore: 'positive' | 'neutral' | 'negative';
    socialBuzzRate: string;
    velocityScore: 'high' | 'medium' | 'steady';
  };
  history?: Record<string, { label: string; value: number }[]>;
  films?: StarFilm[];
  awardsCount?: number;
  topBrands?: string[];
}

export interface NewsBrief {
  id: string;
  category: 'BOX OFFICE' | 'PRODUCTION' | 'CASTING' | 'STREAMING' | 'TECH & AI' | 'GENERAL' | 'EXCLUSIVE';
  categoryColor: string;
  title: string;
  summary: string;
  fullContent?: string;
  readTime: string;
  timestamp: string;
  imageUrl: string;
  relatedStars?: string[];
  impactScore?: string;
  sourceUrl?: string;
  sourceName?: string;
  author?: string;
}

export interface UserStats {
  followingCount: number;
  watchlistCount: number;
  updatesCount: number;
  userName: string;
  userRole: string;
  membershipLevel: string;
  avatarUrl: string;
}

export interface RegionalPerformance {
  region: string;
  percentage: number;
  colorClass: string;
  volume: string;
}

export interface PlatformBuzz {
  platform: string;
  shortName: string;
  percentage: number;
  color: string;
  sentiment: string;
}
