import { Request, Response, NextFunction } from 'express';
import { AuthService, TokenPayload } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import User from '../models/user.model';
import Role from '../models/role.model';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = AuthService.verifyToken(token);
    if (!payload) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Enrich with fresh roles from DB to reflect real-time role changes
    try {
      const user = await User.findByPk(payload.id, {
        include: [{ model: Role, as: 'roles', attributes: ['name'], through: { attributes: [] } }],
      });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      const roleNames: string[] = ((user as any).roles || []).map((r: any) => r.name);
      req.user = {
        ...payload,
        roles: roleNames,
        role: (user as any).role ?? payload.role,
      } as TokenPayload;
    } catch {
      // If DB lookup fails, continue with token payload
      req.user = payload;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userRoles = (req.user.roles || []) as string[];
    const hasByArray = userRoles.length > 0 && roles.some(r => userRoles.includes(String(r)));
    const hasBySingle = req.user.role ? roles.includes(req.user.role as UserRole) : false;

    if (!hasByArray && !hasBySingle) {
      res.status(403).json({ 
        message: 'Access denied. Insufficient permissions',
        required: roles,
        current: userRoles.length ? userRoles : req.user.role
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = authorize(UserRole.ADMIN);

/**
 * Middleware to check if user is admin or manager
 */
export const isAdminOrManager = authorize(UserRole.ADMIN, UserRole.MANAGER);

/**
 * Middleware to check if user is staff (admin, manager, or receptionist)
 */
export const isStaff = authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST);

/**
 * Middleware to check if user is mechanic or higher
 */
export const isMechanicOrHigher = authorize(UserRole.ADMIN, UserRole.MANAGER, UserRole.MECHANIC);
