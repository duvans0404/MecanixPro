import { DataTypes, Model, Sequelize } from 'sequelize';

export interface RoleAttributes {
  id?: number;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

class Role extends Model<RoleAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description?: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initRoleModel(sequelize: Sequelize): void {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      timestamps: true,
    }
  );
}

export default Role;
