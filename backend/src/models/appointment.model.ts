import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface AppointmentAttributes {
  id: number;
  clientId: number;
  vehicleId: number;
  mechanicId: number;
  serviceId: number;
  appointmentDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: number;
  public clientId!: number;
  public vehicleId!: number;
  public mechanicId!: number;
  public serviceId!: number;
  public appointmentDate!: Date;
  public status!: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initAppointmentModel(sequelize: Sequelize) {
  Appointment.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vehicleId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    mechanicId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    serviceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    appointmentDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'), allowNull: false },
    notes: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
  });
}
