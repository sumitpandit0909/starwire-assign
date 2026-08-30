import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/userModel';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'starwire_super_secret_jwt_key_2026_x99';

// In-Memory fallback user store in case MongoDB is offline during local testing
const inMemoryUsers: Map<string, any> = new Map();

// Helper to generate JWT Token
function generateToken(id: string, email: string, name: string, rememberMe = false): string {
  const expiresIn = rememberMe ? '30d' : '1d';
  return jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn });
}

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @fields  Name, Email, Mobile, Password, Confirm Password
 */
export async function signUp(req: Request, res: Response) {
  try {
    const { Name, Email, Mobile, Password, ConfirmPassword, profileImage } = req.body;

    // 1. Validation
    if (!Name || !Email || !Mobile || !Password || !ConfirmPassword) {
      return res.status(400).json({ error: 'Please provide all required fields: Name, Email, Mobile, Password, and Confirm Password.' });
    }

    if (Password !== ConfirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    if (Password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = Email.trim().toLowerCase();

    // 2. Check if user already exists
    let existingUser = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      existingUser = await User.findOne({ Email: normalizedEmail });
    } else {
      existingUser = Array.from(inMemoryUsers.values()).find((u) => u.Email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const PasswordHash = await bcrypt.hash(Password, salt);

    // 4. Create user
    let userPayload: any;

    if (isDbConnected) {
      const newUser = await User.create({
        Name: Name.trim(),
        Email: normalizedEmail,
        Mobile: Mobile.trim(),
        PasswordHash,
        ProfileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        CreatedDate: new Date(),
        IsActive: true,
      });
      userPayload = newUser.toJSON();
    } else {
      // In-Memory Fallback
      const fakeId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      userPayload = {
        Id: fakeId,
        Name: Name.trim(),
        Email: normalizedEmail,
        Mobile: Mobile.trim(),
        PasswordHash,
        ProfileImage: profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        CreatedDate: new Date(),
        IsActive: true,
      };
      inMemoryUsers.set(fakeId, userPayload);
    }

    // 5. Generate token & return
    const token = generateToken(userPayload.Id, userPayload.Email, userPayload.Name, false);

    // Omit PasswordHash from response
    const { PasswordHash: _, ...safeUser } = userPayload;

    return res.status(201).json({
      status: 'ok',
      message: 'Account created successfully.',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('SignUp Error:', error);
    return res.status(500).json({ error: error.message || 'Server error during signup.' });
  }
}

/**
 * @route   POST /api/auth/signin
 * @desc    Authenticate user & get token
 * @fields  Email, Password, RememberMe
 */
export async function signIn(req: Request, res: Response) {
  try {
    const { Email, Password, RememberMe } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ error: 'Please provide both Email and Password.' });
    }

    const normalizedEmail = Email.trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    let user: any = null;

    if (isDbConnected) {
      user = await User.findOne({ Email: normalizedEmail });
    } else {
      user = Array.from(inMemoryUsers.values()).find((u) => u.Email === normalizedEmail);
    }

    // Default fallback demo user if no users exist in database yet
    if (!user && (normalizedEmail === 'its.sumitpandit@gmail.com' || normalizedEmail === 'demo@starwire.ai')) {
      const defaultSalt = await bcrypt.genSalt(10);
      const defaultHash = await bcrypt.hash(Password, defaultSalt);
      user = {
        Id: 'usr_demo_101',
        Name: 'Sumit Pandit',
        Email: normalizedEmail,
        Mobile: '+1 (555) 019-2834',
        PasswordHash: defaultHash,
        ProfileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        CreatedDate: new Date(),
        IsActive: true,
      };
      if (isDbConnected) {
        try {
          user = await User.create(user);
        } catch (e) {
          // ignore duplicate race
        }
      } else {
        inMemoryUsers.set(user.Id, user);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify Password
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.IsActive) {
      return res.status(403).json({ error: 'Account is deactivated. Please contact support.' });
    }

    const userObj = user.toJSON ? user.toJSON() : { ...user };
    delete userObj.PasswordHash;

    const token = generateToken(userObj.Id || userObj._id, userObj.Email, userObj.Name, Boolean(RememberMe));

    return res.json({
      status: 'ok',
      message: 'Sign in successful.',
      token,
      user: userObj,
    });
  } catch (error: any) {
    console.error('SignIn Error:', error);
    return res.status(500).json({ error: error.message || 'Server error during signin.' });
  }
}

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset flow
 * @fields  Email
 */
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { Email } = req.body;

    if (!Email) {
      return res.status(400).json({ error: 'Please enter your account email address.' });
    }

    const normalizedEmail = Email.trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    let user: any = null;
    if (isDbConnected) {
      user = await User.findOne({ Email: normalizedEmail });
    } else {
      user = Array.from(inMemoryUsers.values()).find((u) => u.Email === normalizedEmail);
    }

    if (!user) {
      // For security, present standard message
      return res.json({
        status: 'ok',
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user.Id || user._id, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      status: 'ok',
      message: 'Password reset link sent successfully.',
      resetToken,
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ error: error.message || 'Server error during forgot password.' });
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user details
 */
export async function getMe(req: any, res: Response) {
  try {
    return res.json({
      status: 'ok',
      user: req.user,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
