import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface MechanicAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MechanicCreationAttributes extends Optional<MechanicAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Mechanic extends Model<MechanicAttributes, MechanicCreationAttributes> implements MechanicAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string;
  public specialization!: string;
  public experienceYears!: number;
  public hourlyRate!: number;
  public isAvailable!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initMechanicModel(sequelize: Sequelize) {
  Mechanic.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    specialization: { type: DataTypes.STRING, allowNull: false },
    experienceYears: { type: DataTypes.INTEGER, allowNull: false },
    hourlyRate: { type: DataTypes.FLOAT, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'mechanics',
    timestamps: true,
  });
}
