import { DataTypes, Model, Optional } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface ClientAttributes {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  password?: string;
  status: 'ACTIVE' | 'INACTIVE';
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public phone!: string;
  public email!: string;
  public password?: string;
  public status!: 'ACTIVE' | 'INACTIVE';
  public active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function initClientModel(sequelize: Sequelize) {
  Client.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'clients',
      timestamps: true,
    }
  );
}
