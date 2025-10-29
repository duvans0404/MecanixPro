import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { UserRole } from '../models/user.model';
import RefreshToken from '../models/refresh-token.model';
import Role from '../models/role.model';

const JWT_SECRET = process.env.JWT_SECRET || 'mecanixpro-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export interface TokenPayload {
  id: number;
  username: string;
  email: string;
  roles: string[]; // names from Role model
  // fallback for legacy paths that still expect a single role
  role?: UserRole;
}

export class AuthService {
  /**
   * Hash a password
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  static async generateAccessToken(user: User): Promise<string> {
    // Try to pull roles from relation; fallback to enum field
    let roleNames: string[] = [];
    try {
      if (typeof (user as any).getRoles === 'function') {
        const roles = await (user as any).getRoles({ attributes: ['name'] });
        roleNames = (roles || []).map((r: Role) => (r as any).name);
      }
    } catch (e) {
      roleNames = [];
    }

    const payload: TokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: roleNames,
      role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(): string {
    return jwt.sign({ random: Math.random() }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN } as any);
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Save refresh token to database
   */
  static async saveRefreshToken(userId: number, token: string): Promise<RefreshToken> {
    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Delete old tokens for this user
    await RefreshToken.destroy({ where: { userId } });

    // Create new refresh token
    return RefreshToken.create({
      userId,
      token,
      expiresAt,
    });
  }

  /**
   * Validate refresh token
   */
  static async validateRefreshToken(token: string): Promise<User | null> {
    try {
      // Verify token format
      jwt.verify(token, JWT_SECRET);

      // Find token in database
      const refreshToken = await RefreshToken.findOne({
        where: { token },
        include: [{ model: User, as: 'user' }],
      });

      if (!refreshToken) {
        return null;
      }

      // Check if token expired
      if (new Date() > refreshToken.expiresAt) {
        await refreshToken.destroy();
        return null;
      }

      return (refreshToken as any).user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Delete refresh token (logout)
   */
  static async deleteRefreshToken(token: string): Promise<void> {
    await RefreshToken.destroy({ where: { token } });
  }

  /**
   * Delete all user's refresh tokens (logout from all devices)
   */
  static async deleteAllUserTokens(userId: number): Promise<void> {
    await RefreshToken.destroy({ where: { userId } });
  }
}
