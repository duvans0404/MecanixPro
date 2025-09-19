import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface InsuranceAttributes {
  id: number;
  vehicleId: number;
  companyName: string;
  policyNumber: string;
  coverageType: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  deductible: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InsuranceCreationAttributes extends Optional<InsuranceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Insurance extends Model<InsuranceAttributes, InsuranceCreationAttributes> implements InsuranceAttributes {
  public id!: number;
  public vehicleId!: number;
  public companyName!: string;
  public policyNumber!: string;
  public coverageType!: string;
  public startDate!: Date;
  public endDate!: Date;
  public premium!: number;
  public deductible!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initInsuranceModel(sequelize: Sequelize) {
  Insurance.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    vehicleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    policyNumber: { type: DataTypes.STRING, allowNull: false },
    coverageType: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    premium: { type: DataTypes.FLOAT, allowNull: false },
    deductible: { type: DataTypes.FLOAT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'insurances',
    timestamps: true,
  });
}
