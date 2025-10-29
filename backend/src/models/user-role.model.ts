import { DataTypes, Model, Sequelize } from 'sequelize';
import User from './user.model';
import Role from './role.model';

export interface UserRoleMapAttributes {
  userId: number;
  roleId: number;
  createdAt?: Date;
}

class UserRoleMap extends Model<UserRoleMapAttributes> implements UserRoleMapAttributes {
  public userId!: number;
  public roleId!: number;
  public readonly createdAt!: Date;
}

export function initUserRoleModel(sequelize: Sequelize): void {
  UserRoleMap.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'user_roles',
      timestamps: true,
      updatedAt: false,
    }
  );

  // Associations are defined centrally in models/associations.ts
}

export default UserRoleMap;
