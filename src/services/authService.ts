import { UserStats } from '../types';

export interface SignUpData {
  Name: string;
  Email: string;
  Mobile: string;
  Password: string;
  ConfirmPassword: string;
}

export interface SignInData {
  Email: string;
  Password: string;
  RememberMe: boolean;
}

export interface AuthResponse {
  status: string;
  message?: string;
  error?: string;
  token?: string;
  user?: {
    Id: string;
    Name: string;
    Email: string;
    Mobile: string;
    ProfileImage?: string;
    CreatedDate?: string;
    IsActive?: boolean;
  };
}

const TOKEN_KEY = 'starwire_auth_token';
const USER_KEY = 'starwire_user_data';

// Helper to save session
export function saveAuthSession(token: string, user: any, rememberMe = false) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  // Sync to localStorage for persistent state across tabs
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get saved token
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

// Get saved user
export function getSavedUser(): any | null {
  const data = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Logout helper
export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Register a new user
 */
export async function apiSignUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      return { status: 'error', error: body.error || 'Failed to register account.' };
    }

    if (body.token && body.user) {
      saveAuthSession(body.token, body.user, true);
    }

    return body;
  } catch (err: any) {
    console.error('SignUp API Error:', err);
    return { status: 'error', error: err.message || 'Network error during signup.' };
  }
}

/**
 * Sign in user
 */
export async function apiSignIn(data: SignInData): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      return { status: 'error', error: body.error || 'Invalid credentials.' };
    }

    if (body.token && body.user) {
      saveAuthSession(body.token, body.user, data.RememberMe);
    }

    return body;
  } catch (err: any) {
    console.error('SignIn API Error:', err);
    return { status: 'error', error: err.message || 'Network error during signin.' };
  }
}

/**
 * Forgot password request
 */
export async function apiForgotPassword(email: string): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email }),
    });

    const body = await res.json();
    if (!res.ok) {
      return { status: 'error', error: body.error || 'Failed to request password reset.' };
    }

    return body;
  } catch (err: any) {
    console.error('Forgot Password API Error:', err);
    return { status: 'error', error: err.message || 'Network error during password reset.' };
  }
}

/**
 * Fetch current user from server
 */
export async function apiGetMe(): Promise<any | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    const body = await res.json();
    return body.user || null;
  } catch (e) {
    return null;
  }
}

/**
 * Toggle followed star in MongoDB
 */
export async function apiToggleFollowStar(starId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/user/follow-star', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ starId }),
    });
    return await res.json();
  } catch (e) {
    console.warn('apiToggleFollowStar error:', e);
    return null;
  }
}

/**
 * Toggle bookmark news in MongoDB
 */
export async function apiToggleBookmarkNews(newsId: string): Promise<any> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/user/bookmark-news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newsId }),
    });
    return await res.json();
  } catch (e) {
    console.warn('apiToggleBookmarkNews error:', e);
    return null;
  }
}

/**
 * Sync guest session activity with MongoDB
 */
export async function apiSyncUserActivity(followedStars: string[], bookmarkedNews: string[]): Promise<any> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/user/sync-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ followedStars, bookmarkedNews }),
    });
    return await res.json();
  } catch (e) {
    console.warn('apiSyncUserActivity error:', e);
    return null;
  }
}

/**
 * Get user activity from MongoDB
 */
export async function apiGetUserActivity(): Promise<{ followedStars: string[]; bookmarkedNews: string[] } | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch('/api/user/activity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn('apiGetUserActivity error:', e);
    return null;
  }
}

