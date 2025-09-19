import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface WorkOrderPartAttributes {
  id: number;
  workOrderId: number;
  partId: number;
  quantity: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkOrderPartCreationAttributes extends Optional<WorkOrderPartAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class WorkOrderPart extends Model<WorkOrderPartAttributes, WorkOrderPartCreationAttributes> implements WorkOrderPartAttributes {
  public id!: number;
  public workOrderId!: number;
  public partId!: number;
  public quantity!: number;
  public subtotal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initWorkOrderPartModel(sequelize: Sequelize) {
  WorkOrderPart.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    workOrderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    partId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    subtotal: { type: DataTypes.FLOAT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'work_order_parts',
    timestamps: true,
  });
}
