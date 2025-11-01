import { Request, Response } from 'express';
import User, { UserRole } from '../models/user.model';
import Role from '../models/role.model';
import { AuthService } from '../services/auth.service';
import { Op } from 'sequelize';
import crypto from 'crypto';
import PasswordResetToken from '../models/password-reset-token.model';
import { MailerService } from '../services/mailer.service';

/**
 * Register new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Username, email, and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });

    if (existingUser) {
      res.status(409).json({ message: 'Username or email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || UserRole.CLIENT,
      firstName,
      lastName,
      phone,
      isActive: true,
    });

    // Assign role relation as well (default CLIENT if none provided)
    try {
      const roleName = (role || UserRole.CLIENT) as string;
      console.log(`🔍 [Register] Asignando rol "${roleName}" al usuario ${user.username}`);
      
      // Asegurar que el rol existe en la base de datos
      let roleRecord = await Role.findOne({ where: { name: roleName } });
      if (!roleRecord) {
        console.log(`⚠️ [Register] Rol "${roleName}" no encontrado, creándolo...`);
        roleRecord = await Role.create({ name: roleName });
      }
      
      if (roleRecord && typeof (user as any).addRole === 'function') {
        await (user as any).addRole(roleRecord);
        console.log(`✅ [Register] Rol "${roleName}" asignado correctamente al usuario ${user.username}`);
      } else {
        console.warn(`⚠️ [Register] No se pudo asignar el rol. roleRecord:`, roleRecord, 'addRole function:', typeof (user as any).addRole);
      }
    } catch (error) {
      console.error('❌ [Register] Error al asignar rol:', error);
    }

    // Generate tokens
  const accessToken = await AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken();
    await AuthService.saveRefreshToken(user.id, refreshToken);

    // Return user data (without password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Find user by username or email
    const user = await User.findOne({
      where: { [Op.or]: [{ username }, { email: username }] },
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({ message: 'Account is inactive' });
      return;
    }

    // Verify password
    const isPasswordValid = await AuthService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
  const accessToken = await AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken();
    await AuthService.saveRefreshToken(user.id, refreshToken);

    // Return user data (without password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    // Validate refresh token
    const user = await AuthService.validateRefreshToken(refreshToken);
    if (!user) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }

    // Generate new tokens
  const newAccessToken = await AuthService.generateAccessToken(user);
    const newRefreshToken = AuthService.generateRefreshToken();
    await AuthService.saveRefreshToken(user.id, newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ message: 'Internal server error during token refresh' });
  }
};

/**
 * Logout user
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await AuthService.deleteRefreshToken(refreshToken);
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
};

/**
 * Logout from all devices
 */
export const logoutAll = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    await AuthService.deleteAllUserTokens(req.user.id);

    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }],
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Serializar el usuario con roles como array de strings (nombres)
    const userData = user.toJSON();
    const rolesArray = ((userData as any).roles || []).map((r: any) => r.name || r);
    
    // Usar el campo role del usuario como fuente de verdad principal
    // El campo role es el rol que viene directamente con el usuario desde la BD
    const finalRoles = userData.role ? [userData.role] : (rolesArray.length > 0 ? rolesArray : []);
    
    console.log(`👤 [GetProfile] Usuario: ${userData.username}, role (campo principal): ${userData.role}, Roles desde relación:`, rolesArray, 'Roles finales:', finalRoles);
    
    // Asegurarse de que los roles vengan como array de strings, no objetos
    const serializedUser = {
      ...userData,
      roles: finalRoles
    };

    res.status(200).json({ user: serializedUser });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update current user profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update user
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify current password
    const isPasswordValid = await AuthService.comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash and update new password
    user.password = await AuthService.hashPassword(newPassword);
    await user.save();

    // Logout from all devices (invalidate all tokens)
    await AuthService.deleteAllUserTokens(user.id);

    res.status(200).json({ message: 'Password changed successfully. Please login again.' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Request password reset (public)
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body || {};
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const user = await User.findOne({ where: { email } });

    // Always return 200 for privacy. If user exists, create token.
    if (user) {
      // Invalidate previous tokens
      await PasswordResetToken.destroy({ where: { userId: user.id } });

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

      await PasswordResetToken.create({ userId: user.id, token, expiresAt });

      const base = process.env.FRONTEND_URL || 'http://localhost:4200';
      const resetUrl = `${base}/reset-password?token=${token}`;

      // Enviar correo (si SMTP está configurado). En desarrollo incluimos el URL.
      try {
        await MailerService.sendPasswordResetEmail(email, resetUrl);
      } catch (e) {
        console.warn('No se pudo enviar el correo de reset:', e);
      }

      const includeUrl = (process.env.NODE_ENV || 'development') !== 'production';
      res.status(200).json({ message: 'If the email exists, a reset link has been sent', ...(includeUrl ? { resetUrl } : {}) });
      return;
    }

    res.status(200).json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Reset password with token (public)
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token and newPassword are required' });
      return;
    }

    const record = await PasswordResetToken.findOne({ where: { token, used: false } });
    if (!record) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    if (new Date() > record.expiresAt) {
      await record.destroy();
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await User.findByPk(record.userId);
    if (!user) {
      await record.destroy();
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.password = await AuthService.hashPassword(newPassword);
    await user.save();

    // Mark token as used and invalidate refresh tokens (logout)
    (record as any).used = true;
    await record.save();
    await AuthService.deleteAllUserTokens(user.id);

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get all users (ADMIN only)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Verificar que el usuario es ADMIN
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      res.status(403).json({ message: 'Access denied. Admin only.' });
      return;
    }

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }],
      order: [['createdAt', 'DESC']]
    });

    // Serializar usuarios con roles como array de strings
    const serializedUsers = users.map(user => {
      const userData = user.toJSON();
      const rolesArray = ((userData as any).roles || []).map((r: any) => r.name || r);
      return {
        ...userData,
        roles: rolesArray.length > 0 ? rolesArray : (userData.role ? [userData.role] : [])
      };
    });

    res.status(200).json({ users: serializedUsers });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update user role (ADMIN only)
 */
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Verificar que el usuario es ADMIN
    const currentUser = await User.findByPk(req.user.id);
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      res.status(403).json({ message: 'Access denied. Admin only.' });
      return;
    }

    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role as UserRole)) {
      res.status(400).json({ message: 'Invalid role provided' });
      return;
    }

    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }]
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Actualizar el campo role
    user.role = role as UserRole;
    await user.save();

    // Actualizar la relación many-to-many
    // Eliminar todos los roles actuales
    await (user as any).setRoles([]);
    
    // Agregar el nuevo rol
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (roleRecord) {
      await (user as any).addRole(roleRecord);
      console.log(`✅ [UpdateUserRole] Rol "${role}" asignado al usuario ${user.username}`);
    }

    // Obtener el usuario actualizado
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Role, as: 'roles', attributes: ['id', 'name'], through: { attributes: [] } }]
    });

    const userData = updatedUser?.toJSON();
    const rolesArray = ((userData as any)?.roles || []).map((r: any) => r.name || r);
    const serializedUser = {
      ...userData,
      roles: rolesArray.length > 0 ? rolesArray : [role]
    };

    res.status(200).json({
      message: 'User role updated successfully',
      user: serializedUser
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
