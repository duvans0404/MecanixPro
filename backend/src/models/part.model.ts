import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PartAttributes {
  id: number;
  name: string;
  description: string;
  partNumber: string;
  brand: string;
  unitPrice: number;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PartCreationAttributes extends Optional<PartAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Part extends Model<PartAttributes, PartCreationAttributes> implements PartAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public partNumber!: string;
  public brand!: string;
  public unitPrice!: number;
  public price!: number;
  public stock!: number;
  public status!: 'ACTIVE' | 'INACTIVE';
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPartModel(sequelize: Sequelize) {
  Part.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    partNumber: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'parts',
    timestamps: true,
  });
}
