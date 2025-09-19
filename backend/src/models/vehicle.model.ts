import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface VehicleAttributes {
  id: number;
  licensePlate: string;
  make: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  clientId: number;
  insuranceId?: number;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleCreationAttributes extends Optional<VehicleAttributes, 'id' | 'insuranceId' | 'createdAt' | 'updatedAt'> {}

export class Vehicle extends Model<VehicleAttributes, VehicleCreationAttributes> implements VehicleAttributes {
  public id!: number;
  public licensePlate!: string;
  public make!: string;
  public brand!: string;
  public model!: string;
  public year!: number;
  public color!: string;
  public vin!: string;
  public clientId!: number;
  public insuranceId?: number;
  public status!: 'ACTIVE' | 'INACTIVE';
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initVehicleModel(sequelize: Sequelize) {
  Vehicle.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    licensePlate: { type: DataTypes.STRING, allowNull: false, unique: true },
    make: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    color: { type: DataTypes.STRING, allowNull: false },
    vin: { type: DataTypes.STRING, allowNull: false, unique: true },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    insuranceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'vehicles',
    timestamps: true,
  });
}
