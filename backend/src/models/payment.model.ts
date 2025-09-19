import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface PaymentAttributes {
  id: number;
  workOrderId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public workOrderId!: number;
  public amount!: number;
  public paymentMethod!: string;
  public paymentDate!: Date;
  public status!: 'pending' | 'completed' | 'failed' | 'refunded';
  public transactionId!: string;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initPaymentModel(sequelize: Sequelize) {
  Payment.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    workOrderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    paymentDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'), allowNull: false },
    transactionId: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  });
}
