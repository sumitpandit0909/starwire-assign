import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, token missing' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'starwire_super_secret_jwt_key_2026_x99';
    const decoded: any = jwt.verify(token, jwtSecret);
    
    // Check MongoDB user if connected, or decode fallback
    const user = await User.findById(decoded.id).select('-PasswordHash');
    if (user) {
      req.user = user.toJSON();
    } else {
      req.user = {
        Id: decoded.id,
        Name: decoded.name || 'Starwire Member',
        Email: decoded.email,
      };
    }
    
    next();
  } catch (error) {
    console.error('JWT Token Verification Error:', error);
    return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
  }
}
