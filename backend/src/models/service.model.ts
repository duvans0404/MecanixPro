import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface ServiceAttributes {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  laborCost: number;
  durationMinutes: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public category!: string;
  public price!: number;
  public laborCost!: number;
  public durationMinutes!: number;
  public status!: 'ACTIVE' | 'INACTIVE';
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initServiceModel(sequelize: Sequelize) {
  Service.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    laborCost: { type: DataTypes.FLOAT, allowNull: false },
    durationMinutes: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'services',
    timestamps: true,
  });
}
