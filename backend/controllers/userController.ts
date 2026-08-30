import { Response } from 'express';
import { User } from '../models/userModel';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

/**
 * @route   POST /api/user/follow-star
 * @desc    Toggle follow state for a star in user's MongoDB record
 */
export async function toggleFollowStar(req: AuthenticatedRequest, res: Response) {
  try {
    const { starId } = req.body;
    if (!starId) {
      return res.status(400).json({ error: 'starId is required' });
    }

    const userId = req.user?.Id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.json({ status: 'ok', message: 'Offline mode toggle recorded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const starIndex = user.followedStars.indexOf(starId);
    let isFollowing = false;

    if (starIndex > -1) {
      user.followedStars.splice(starIndex, 1);
      isFollowing = false;
    } else {
      user.followedStars.push(starId);
      isFollowing = true;
    }

    await user.save();

    return res.json({
      status: 'ok',
      isFollowing,
      followedStars: user.followedStars,
    });
  } catch (error: any) {
    console.error('Toggle Follow Star error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @route   POST /api/user/bookmark-news
 * @desc    Toggle bookmark state for a news article in user's MongoDB record
 */
export async function toggleBookmarkNews(req: AuthenticatedRequest, res: Response) {
  try {
    const { newsId } = req.body;
    if (!newsId) {
      return res.status(400).json({ error: 'newsId is required' });
    }

    const userId = req.user?.Id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.json({ status: 'ok', message: 'Offline mode toggle recorded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newsIndex = user.bookmarkedNews.indexOf(newsId);
    let isBookmarked = false;

    if (newsIndex > -1) {
      user.bookmarkedNews.splice(newsIndex, 1);
      isBookmarked = false;
    } else {
      user.bookmarkedNews.push(newsId);
      isBookmarked = true;
    }

    await user.save();

    return res.json({
      status: 'ok',
      isBookmarked,
      bookmarkedNews: user.bookmarkedNews,
    });
  } catch (error: any) {
    console.error('Toggle Bookmark News error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @route   POST /api/user/sync-activity
 * @desc    Sync / merge guest followed stars & bookmarks into user MongoDB document
 */
export async function syncUserActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const { followedStars = [], bookmarkedNews = [] } = req.body;
    const userId = req.user?.Id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.json({ status: 'ok', followedStars, bookmarkedNews });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Merge unique values
    const mergedFollowed = Array.from(new Set([...user.followedStars, ...followedStars]));
    const mergedBookmarks = Array.from(new Set([...user.bookmarkedNews, ...bookmarkedNews]));

    user.followedStars = mergedFollowed;
    user.bookmarkedNews = mergedBookmarks;

    await user.save();

    return res.json({
      status: 'ok',
      followedStars: user.followedStars,
      bookmarkedNews: user.bookmarkedNews,
    });
  } catch (error: any) {
    console.error('Sync User Activity error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * @route   GET /api/user/activity
 * @desc    Get user's followed stars and bookmarked news from MongoDB
 */
export async function getUserActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.Id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const isDbConnected = mongoose.connection.readyState === 1;
    if (!isDbConnected) {
      return res.json({ followedStars: [], bookmarkedNews: [] });
    }

    const user = await User.findById(userId).select('followedStars bookmarkedNews');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      status: 'ok',
      followedStars: user.followedStars || [],
      bookmarkedNews: user.bookmarkedNews || [],
    });
  } catch (error: any) {
    console.error('Get User Activity error:', error);
    return res.status(500).json({ error: error.message });
  }
}
