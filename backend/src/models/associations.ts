import { Client } from './client.model';
import { Vehicle } from './vehicle.model';
import { Appointment } from './appointment.model';
import { WorkOrder } from './work-order.model';
import { Payment } from './payment.model';
import { Insurance } from './insurance.model';
import { Mechanic } from './mechanic.model';
import { Part } from './part.model';
import { Service } from './service.model';
import { WorkOrderService } from './work-order-service.model';
import { WorkOrderPart } from './work-order-part.model';
import Role from './role.model';
import User from './user.model';
import UserRoleMap from './user-role.model';

// Client - Vehicle
Client.hasMany(Vehicle, { foreignKey: 'clientId' });
Vehicle.belongsTo(Client, { foreignKey: 'clientId' });

// Vehicle - Insurance
Vehicle.hasOne(Insurance, { foreignKey: 'vehicleId' });
Insurance.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Client - Appointment
Client.hasMany(Appointment, { foreignKey: 'clientId' });
Appointment.belongsTo(Client, { foreignKey: 'clientId' });

// Vehicle - Appointment
Vehicle.hasMany(Appointment, { foreignKey: 'vehicleId' });
Appointment.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Mechanic - Appointment
Mechanic.hasMany(Appointment, { foreignKey: 'mechanicId' });
Appointment.belongsTo(Mechanic, { foreignKey: 'mechanicId' });

// Service - Appointment
Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

// Client - WorkOrder
Client.hasMany(WorkOrder, { foreignKey: 'clientId' });
WorkOrder.belongsTo(Client, { foreignKey: 'clientId' });

// Vehicle - WorkOrder
Vehicle.hasMany(WorkOrder, { foreignKey: 'vehicleId' });
WorkOrder.belongsTo(Vehicle, { foreignKey: 'vehicleId' });

// Mechanic - WorkOrder
Mechanic.hasMany(WorkOrder, { foreignKey: 'mechanicId' });
WorkOrder.belongsTo(Mechanic, { foreignKey: 'mechanicId' });

// Service - WorkOrder
Service.hasMany(WorkOrder, { foreignKey: 'serviceId' });
WorkOrder.belongsTo(Service, { foreignKey: 'serviceId' });

// WorkOrder - Payment
WorkOrder.hasMany(Payment, { foreignKey: 'workOrderId' });
Payment.belongsTo(WorkOrder, { foreignKey: 'workOrderId' });


// WorkOrder - Part (many-to-many)
WorkOrder.belongsToMany(Part, { through: WorkOrderPart, foreignKey: 'workOrderId', otherKey: 'partId' });
Part.belongsToMany(WorkOrder, { through: WorkOrderPart, foreignKey: 'partId', otherKey: 'workOrderId' });

// WorkOrder - Service (many-to-many)
WorkOrder.belongsToMany(Service, { through: WorkOrderService, foreignKey: 'workOrderId', otherKey: 'serviceId' });
Service.belongsToMany(WorkOrder, { through: WorkOrderService, foreignKey: 'serviceId', otherKey: 'workOrderId' });

// User - Role (many-to-many)
User.belongsToMany(Role, { through: UserRoleMap, foreignKey: 'userId', otherKey: 'roleId', as: 'roles' });
Role.belongsToMany(User, { through: UserRoleMap, foreignKey: 'roleId', otherKey: 'userId', as: 'users' });
