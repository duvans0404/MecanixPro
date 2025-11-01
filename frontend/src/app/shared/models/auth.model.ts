export interface TokenPayload {
  id: number;
  username: string;
  email: string;
  roles: string[];
  role?: string;
  exp?: number; // seconds since epoch
  iat?: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role?: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface AuthResponse {
  message?: string;
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
