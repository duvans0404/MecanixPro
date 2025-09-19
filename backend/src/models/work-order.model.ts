import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface WorkOrderAttributes {
  id: number;
  clientId: number;
  vehicleId: number;
  mechanicId: number;
  serviceId: number;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  actualHours: number;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  startDate: Date;
  endDate: Date;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkOrderCreationAttributes extends Optional<WorkOrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class WorkOrder extends Model<WorkOrderAttributes, WorkOrderCreationAttributes> implements WorkOrderAttributes {
  public id!: number;
  public clientId!: number;
  public vehicleId!: number;
  public mechanicId!: number;
  public serviceId!: number;
  public description!: string;
  public status!: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  public priority!: 'low' | 'medium' | 'high' | 'urgent';
  public estimatedHours!: number;
  public actualHours!: number;
  public laborCost!: number;
  public partsCost!: number;
  public totalCost!: number;
  public startDate!: Date;
  public endDate!: Date;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initWorkOrderModel(sequelize: Sequelize) {
  WorkOrder.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vehicleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    mechanicId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'cancelled'), allowNull: false },
    priority: { type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'), allowNull: false },
    estimatedHours: { type: DataTypes.FLOAT, allowNull: false },
    actualHours: { type: DataTypes.FLOAT, allowNull: false },
    laborCost: { type: DataTypes.FLOAT, allowNull: false },
    partsCost: { type: DataTypes.FLOAT, allowNull: false },
    totalCost: { type: DataTypes.FLOAT, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'work_orders',
    timestamps: true,
  });
}
