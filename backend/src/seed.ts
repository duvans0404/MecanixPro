import { Sequelize } from 'sequelize';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { getSequelize } from './config/database';
import { AuthService } from './services/auth.service';
import User, { UserRole, initUserModel } from './models/user.model';
import RefreshToken, { initRefreshTokenModel } from './models/refresh-token.model';

// Import model initializers
import { initClientModel, Client } from './models/client.model';
import { initVehicleModel, Vehicle } from './models/vehicle.model';
import { initMechanicModel, Mechanic } from './models/mechanic.model';
import { initServiceModel, Service } from './models/service.model';
import { initPartModel, Part } from './models/part.model';
import { initWorkOrderModel, WorkOrder } from './models/work-order.model';
import { initAppointmentModel, Appointment } from './models/appointment.model';
import { initPaymentModel, Payment } from './models/payment.model';
import { initInsuranceModel, Insurance } from './models/insurance.model';
import { initWorkOrderPartModel, WorkOrderPart } from './models/work-order-part.model';
import { initWorkOrderServiceModel, WorkOrderService } from './models/work-order-service.model';
import Role, { initRoleModel } from './models/role.model';
import UserRoleMap, { initUserRoleModel } from './models/user-role.model';

// Associations

async function main() {
  // Load .env so getSequelize reads DB_ENGINE and creds
  dotenv.config({ path: __dirname + '/../.env' });

  // Seed options from env
  const FORCE_SQLITE = (process.env.SEED_FORCE_SQLITE || 'false').toLowerCase() === 'true';
  const CLEAR_DB = (process.env.SEED_CLEAR || 'false').toLowerCase() === 'true';
  const NUM_CLIENTS = Number(process.env.SEED_CLIENTS) || 100;
  const NUM_MECHANICS = Number(process.env.SEED_MECHANICS) || 100;
  const NUM_PARTS = Number(process.env.SEED_PARTS) || 100;
  const NUM_SERVICES = Number(process.env.SEED_SERVICES) || 100;
  const NUM_APPOINTMENTS = Number(process.env.SEED_APPOINTMENTS) || 100;
  const NUM_WORK_ORDERS = Number(process.env.SEED_WORK_ORDERS) || 100;

  // Try to use the project's configured DB engine (mysql|postgres|mssql|oracle)
  // unless SEED_FORCE_SQLITE=true is set. If connection/authentication fails
  // (missing driver, creds, network), fall back to a local SQLite file so
  // the seed still runs for development.
  let sequelize: Sequelize;
  if (FORCE_SQLITE) {
    console.log('SEED_FORCE_SQLITE=true -> using local SQLite for seed');
    sequelize = new Sequelize({ dialect: 'sqlite', storage: './mecanixpro-seed.sqlite', logging: false });
  } else {
    try {
      sequelize = getSequelize();
      await sequelize.authenticate();
      console.log('Connected to configured DB engine successfully');
    } catch (err) {
      console.warn('Could not connect to configured DB engine, falling back to local SQLite for seeding.');
      sequelize = new Sequelize({ dialect: 'sqlite', storage: './mecanixpro-seed.sqlite', logging: false });
    }
  }

  // Initialize models with this sequelize instance
  initUserModel(sequelize as any);
  initRoleModel(sequelize as any);
  initUserRoleModel(sequelize as any);
  initRefreshTokenModel(sequelize as any);
  initClientModel(sequelize as any);
  initVehicleModel(sequelize as any);
  initMechanicModel(sequelize as any);
  initServiceModel(sequelize as any);
  initPartModel(sequelize as any);
  initWorkOrderModel(sequelize as any);
  initAppointmentModel(sequelize as any);
  initPaymentModel(sequelize as any);
  initInsuranceModel(sequelize as any);
  initWorkOrderPartModel(sequelize as any);
  initWorkOrderServiceModel(sequelize as any);

  // Initialize associations after models have been initialized
  await import('./models/associations');

  if (CLEAR_DB) {
    console.log('SEED_CLEAR=true -> dropping and recreating tables (sync force)');
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }
  console.log('Database synced (sqlite)');

  // Counters for summary
  const counters: Record<string, number> = {
    users: 0,
    clients: 0,
    clientsExisting: 0,
    vehicles: 0,
    vehiclesExisting: 0,
    mechanics: 0,
    mechanicsExisting: 0,
    services: 0,
    servicesExisting: 0,
    parts: 0,
    partsExisting: 0,
    insurances: 0,
    appointments: 0,
    workOrders: 0,
    workOrderParts: 0,
    workOrderServices: 0,
    payments: 0,
  };

  // Create default roles
  const roleNames = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'] as const;
  const roleRecords: Record<string, Role> = {} as any;
  for (const name of roleNames) {
    const [r] = await Role.findOrCreate({ where: { name }, defaults: { name } });
    roleRecords[name] = r;
  }

  // Create default users with different roles
  console.log('Creating default users...');
  const defaultPassword = await AuthService.hashPassword('password123');
  
  const users = [
    {
      username: 'admin',
      email: 'admin@mecanixpro.com',
      password: defaultPassword,
      role: UserRole.ADMIN,
      firstName: 'Admin',
      lastName: 'System',
      isActive: true,
    },
    {
      username: 'manager',
      email: 'manager@mecanixpro.com',
      password: defaultPassword,
      role: UserRole.MANAGER,
      firstName: 'Manager',
      lastName: 'User',
      isActive: true,
    },
    {
      username: 'mechanic',
      email: 'mechanic@mecanixpro.com',
      password: defaultPassword,
      role: UserRole.MECHANIC,
      firstName: 'Mechanic',
      lastName: 'User',
      isActive: true,
    },
    {
      username: 'receptionist',
      email: 'receptionist@mecanixpro.com',
      password: defaultPassword,
      role: UserRole.RECEPTIONIST,
      firstName: 'Receptionist',
      lastName: 'User',
      isActive: true,
    },
    {
      username: 'client',
      email: 'client@mecanixpro.com',
      password: defaultPassword,
      role: UserRole.CLIENT,
      firstName: 'Client',
      lastName: 'User',
      isActive: true,
    },
  ];

  for (const userData of users) {
    const [u] = await User.findOrCreate({
      where: { username: userData.username },
      defaults: userData,
    });
    counters.users++;
    // Assign role relation
    const role = roleRecords[userData.role];
    if (role) {
      await (u as any).addRole(role);
    }
  }

  console.log(`Created ${counters.users} default users`);

  // Create mechanics
  const mechanics = [];
  for (let i = 0; i < NUM_MECHANICS; i++) {
    const email = faker.internet.email();
    const [mech, mechCreated] = await Mechanic.findOrCreate({
      where: { email },
      defaults: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email,
        phone: faker.phone.number(),
        specialization: faker.helpers.arrayElement(['engine', 'transmission', 'brakes', 'electrical', 'suspension']),
        experienceYears: faker.number.int({ min: 1, max: 30 }),
        hourlyRate: Number(faker.commerce.price({ min: 10, max: 80 })),
        isAvailable: faker.datatype.boolean(),
      },
    });
    mechanics.push(mech);
    if (mechCreated) counters.mechanics++;
    else counters.mechanicsExisting++;
  }

  // Create services
  const services = [];
  const serviceNames = ['Oil change', 'Brake inspection', 'Tire rotation', 'Battery replacement', 'Transmission check'];
  for (let i = 0; i < NUM_SERVICES; i++) {
    const name = serviceNames[i % serviceNames.length] + (i >= serviceNames.length ? ` ${i}` : '');
    const [svc, svcCreated] = await Service.findOrCreate({
      where: { name },
      defaults: {
        name,
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement(['maintenance', 'repair', 'diagnostic']),
        price: Number(faker.commerce.price({ min: 20, max: 500 })),
        laborCost: Number(faker.commerce.price({ min: 10, max: 200 })),
        durationMinutes: faker.number.int({ min: 30, max: 240 }),
        status: 'ACTIVE',
        active: true,
      },
    });
    services.push(svc);
    if (svcCreated) counters.services++;
    else counters.servicesExisting++;
  }

  // Create parts
  const parts = [];
  for (let i = 0; i < NUM_PARTS; i++) {
    const partNumber = faker.string.alphanumeric(8);
    const [part, partCreated] = await Part.findOrCreate({
      where: { partNumber },
      defaults: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        partNumber,
        brand: faker.company.name(),
        unitPrice: Number(faker.commerce.price({ min: 5, max: 400 })),
        price: Number(faker.commerce.price({ min: 5, max: 500 })),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: 'ACTIVE',
        active: true,
      },
    });
    parts.push(part);
    if (partCreated) counters.parts++;
    else counters.partsExisting++;
  }

  // Create clients and vehicles
  const clients = [];
  const vehicles = [];
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const email = faker.internet.email();
    const [client, clientCreated] = await Client.findOrCreate({
      where: { email },
      defaults: {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email,
        password: faker.internet.password(),
        status: 'ACTIVE',
        active: true,
      },
    });
    clients.push(client);
    if (clientCreated) counters.clients++;
    else counters.clientsExisting++;

    const vin = faker.vehicle.vin();
    const [vehicle, vehicleCreated] = await Vehicle.findOrCreate({
      where: { vin },
      defaults: {
        licensePlate: faker.vehicle.vin().slice(0, 7).toUpperCase(),
        make: faker.vehicle.manufacturer(),
        brand: faker.vehicle.model(),
        model: faker.vehicle.model(),
        year: Number(faker.date.past({ years: 20 }).getFullYear()),
        color: faker.color.human(),
        vin,
        clientId: client.id,
        status: 'ACTIVE',
        active: true,
      },
    });
    vehicles.push(vehicle);
    if (vehicleCreated) counters.vehicles++;
    else counters.vehiclesExisting++;

    // Optionally create insurance for some vehicles
    if (faker.datatype.boolean()) {
      const policyNumber = faker.string.alphanumeric(10);
      const [ins, insCreated] = await Insurance.findOrCreate({
        where: { policyNumber },
        defaults: {
          vehicleId: vehicle.id,
          companyName: faker.company.name(),
          policyNumber,
          coverageType: faker.helpers.arrayElement(['comprehensive', 'third-party', 'collision']),
          startDate: faker.date.past({ years: 1 }),
          endDate: faker.date.future({ years: 1 }),
          premium: Number(faker.commerce.price({ min: 100, max: 2000 })),
          deductible: Number(faker.commerce.price({ min: 50, max: 500 })),
        },
      });
      if (insCreated) counters.insurances++;
    }
  }

  // Create appointments
  const appointments = [];
  for (let i = 0; i < NUM_APPOINTMENTS; i++) {
    const client = faker.helpers.arrayElement(clients);
    const vehicle = faker.helpers.arrayElement(vehicles.filter(v => v.clientId === client.id));
    const mechanic = faker.helpers.arrayElement(mechanics);
    const service = faker.helpers.arrayElement(services);

    const appt = await Appointment.create({
      clientId: client.id,
      vehicleId: vehicle.id,
      mechanicId: mechanic.id,
      serviceId: service.id,
      appointmentDate: faker.date.soon({ days: 30 }),
      status: 'scheduled',
      notes: faker.lorem.sentence(),
    });
    appointments.push(appt);
    counters.appointments++;
  }

  // Create work orders
  const workOrders = [];
  for (let i = 0; i < NUM_WORK_ORDERS; i++) {
    const client = faker.helpers.arrayElement(clients);
    const vehicle = faker.helpers.arrayElement(vehicles.filter(v => v.clientId === client.id));
    const mechanic = faker.helpers.arrayElement(mechanics);
    const service = faker.helpers.arrayElement(services);

    const estimatedHours = faker.number.float({ min: 0.5, max: 8, multipleOf: 0.1 });
    const actualHours = faker.number.float({ min: 0.5, max: 10, multipleOf: 0.1 });
    const laborCost = actualHours * mechanic.hourlyRate;

    // pick some parts
  const selectedParts = faker.helpers.arrayElements(parts, faker.number.int({ min: 0, max: 4 }));
  const partsCost = selectedParts.reduce((sum: number, p: any) => sum + Number(p.price), 0);

    const totalCost = laborCost + partsCost + service.price;

    const wo = await WorkOrder.create({
      clientId: client.id,
      vehicleId: vehicle.id,
      mechanicId: mechanic.id,
      serviceId: service.id,
      description: faker.lorem.sentence(),
  status: faker.helpers.arrayElement(['pending', 'in-progress', 'completed', 'cancelled']) as any,
  priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']) as any,
      estimatedHours,
      actualHours,
      laborCost,
      partsCost,
      totalCost,
      startDate: faker.date.past({ years: 1 }),
      endDate: faker.date.soon({ days: 7 }),
      notes: faker.lorem.sentence(),
    });
    workOrders.push(wo);
    counters.workOrders++;

    // Create work order parts entries
    for (const p of selectedParts) {
        const wop = await WorkOrderPart.create({
        workOrderId: wo.id,
        partId: p.id,
        quantity: faker.number.int({ min: 1, max: 4 }),
        subtotal: Number(p.price) * faker.number.int({ min: 1, max: 4 }),
      });
        counters.workOrderParts++;
    }

    // Create work order service entries
    await WorkOrderService.create({
      workOrderId: wo.id,
      serviceId: service.id,
      hoursQuantity: actualHours,
      subtotal: service.price + laborCost,
    });
    counters.workOrderServices++;

    // Create a payment for some work orders
    if (faker.datatype.boolean()) {
      await Payment.create({
        workOrderId: wo.id,
        amount: totalCost,
        paymentMethod: faker.helpers.arrayElement(['cash', 'card', 'transfer']),
        paymentDate: new Date(),
        status: 'completed',
        transactionId: faker.string.alphanumeric(12),
        notes: faker.lorem.sentence(),
      });
      counters.payments++;
    }
  }

  console.log('Seed complete');
  // Print summary
  console.log('Seed summary:');
  console.table ? console.table(counters) : console.log(JSON.stringify(counters, null, 2));
  await sequelize.close();
}

main().catch(err => {
  console.error('Seed failed', err);
  process.exit(1);
});
