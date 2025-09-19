import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface WorkOrderServiceAttributes {
  id: number;
  workOrderId: number;
  serviceId: number;
  hoursQuantity: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkOrderServiceCreationAttributes extends Optional<WorkOrderServiceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class WorkOrderService extends Model<WorkOrderServiceAttributes, WorkOrderServiceCreationAttributes> implements WorkOrderServiceAttributes {
  public id!: number;
  public workOrderId!: number;
  public serviceId!: number;
  public hoursQuantity!: number;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initWorkOrderServiceModel(sequelize: Sequelize) {
  WorkOrderService.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    workOrderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    hoursQuantity: { type: DataTypes.FLOAT, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'work_order_services',
    timestamps: true,
  });
}
