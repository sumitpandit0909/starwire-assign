import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { signUp, signIn, forgotPassword, getMe } from './controllers/authController';
import { protect } from './middleware/authMiddleware';
import {
  getHealth,
  getLiveNews,
  getOpenRouterIntelligence,
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getTopRatedMovies,
  getIndianCinema,
  getNowPlaying,
  getUpcoming,
  getTrendingPeople,
  getPopularPeople,
  getPersonDetails,
  getMovieDetails,
  searchTMDBProxy,
  getStarsAggregated,
  getStarById,
  getMarketPulse,
} from './controllers/apiProxyController';

import { toggleFollowStar, toggleBookmarkNews, syncUserActivity, getUserActivity } from './controllers/userController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB();

// ==========================================
// 1. AUTHENTICATION & USER ENDPOINTS
// ==========================================
app.post('/api/auth/signup', signUp);
app.post('/api/auth/signin', signIn);
app.post('/api/auth/forgot-password', forgotPassword);
app.get('/api/auth/me', protect, getMe);

// User Activity (Followed Stars & Bookmarks in MongoDB)
app.post('/api/user/follow-star', protect, toggleFollowStar);
app.post('/api/user/bookmark-news', protect, toggleBookmarkNews);
app.post('/api/user/sync-activity', protect, syncUserActivity);
app.get('/api/user/activity', protect, getUserActivity);


// ==========================================
// 2. REAL DATA PROXY ENDPOINTS (TMDB, NewsAPI, OpenRouter)
// ==========================================
app.get('/api/health', getHealth);
app.get('/api/news', getLiveNews);
app.post('/api/intelligence', getOpenRouterIntelligence);

// Stars & Talent endpoints
app.get('/api/stars', getStarsAggregated);
app.get('/api/stars/:id', getStarById);
app.get('/api/market-pulse', getMarketPulse);

// TMDB Movie & Person endpoints
app.get('/api/tmdb/trending-movies', getTrendingMovies);
app.get('/api/tmdb/trending-tv', getTrendingTV);
app.get('/api/tmdb/popular-movies', getPopularMovies);
app.get('/api/tmdb/top-rated-movies', getTopRatedMovies);
app.get('/api/tmdb/indian-cinema', getIndianCinema);
app.get('/api/tmdb/now-playing', getNowPlaying);
app.get('/api/tmdb/upcoming', getUpcoming);
app.get('/api/tmdb/trending-people', getTrendingPeople);
app.get('/api/tmdb/now-playing', getNowPlaying);
app.get('/api/tmdb/upcoming', getUpcoming);
app.get('/api/tmdb/trending-people', getTrendingPeople);
app.get('/api/tmdb/popular-people', getPopularPeople);
app.get('/api/tmdb/person/:id', getPersonDetails);
app.get('/api/tmdb/movie/:id', getMovieDetails);
app.get('/api/tmdb/search', searchTMDBProxy);

// Root Status
app.get('/api', (req, res) => {
  res.json({
    name: 'STARWIRE Intelligence Backend API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: ['/api/auth/signup', '/api/auth/signin', '/api/auth/forgot-password', '/api/auth/me'],
      data: ['/api/news', '/api/intelligence', '/api/stars', '/api/market-pulse', '/api/tmdb/indian-cinema'],
    },
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[STARWIRE Backend] Server running on http://127.0.0.1:${PORT}`);
});

export default app;
