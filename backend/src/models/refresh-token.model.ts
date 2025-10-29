import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './user.model';

export interface RefreshTokenAttributes {
  id?: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

export function initRefreshTokenModel(sequelize: Sequelize): void {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
    },
    {
      sequelize,
      tableName: 'refresh_tokens',
      timestamps: true,
      updatedAt: false,
    }
  );

  // Asociaciones (requiere que User ya esté inicializado)
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
}

export default RefreshToken;
