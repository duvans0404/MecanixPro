import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './user.model';

export interface PasswordResetTokenAttributes {
  id?: number;
  userId: number;
  token: string;
  expiresAt: Date;
  used?: boolean;
  createdAt?: Date;
}

class PasswordResetToken extends Model<PasswordResetTokenAttributes> implements PasswordResetTokenAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public used!: boolean;
  public readonly createdAt!: Date;
}

export function initPasswordResetTokenModel(sequelize: Sequelize): void {
  PasswordResetToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'password_reset_tokens',
      timestamps: true,
      updatedAt: false,
    }
  );

  PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  (User as any).hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens' });
}

export default PasswordResetToken;
