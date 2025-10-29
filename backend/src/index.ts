
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getSequelize, DBType } from './config';
import User, { initUserModel } from './models/user.model';
import RefreshToken, { initRefreshTokenModel } from './models/refresh-token.model';
import PasswordResetToken, { initPasswordResetTokenModel } from './models/password-reset-token.model';
import Role, { initRoleModel } from './models/role.model';
import UserRoleMap, { initUserRoleModel } from './models/user-role.model';
import { initClientModel } from './models/client.model';
import { initAppointmentModel } from './models/appointment.model';
import { initInsuranceModel } from './models/insurance.model';
import { initMechanicModel } from './models/mechanic.model';
import { initPartModel } from './models/part.model';
import { initPaymentModel } from './models/payment.model';
import { initServiceModel } from './models/service.model';
import { initVehicleModel } from './models/vehicle.model';
import { initWorkOrderModel } from './models/work-order.model';
import { initWorkOrderPartModel } from './models/work-order-part.model';
import { initWorkOrderServiceModel } from './models/work-order-service.model';
import clientRoutes from './routes/client.routes';
import appointmentRoutes from './routes/appointment.routes';
import insuranceRoutes from './routes/insurance.routes';
import mechanicRoutes from './routes/mechanic.routes';
import partRoutes from './routes/part.routes';
import paymentRoutes from './routes/payment.routes';
import serviceRoutes from './routes/service.routes';
import vehicleRoutes from './routes/vehicle.routes';
import workOrderRoutes from './routes/work-order.routes';
import workOrderPartRoutes from './routes/work-order-part.routes';
import workOrderServiceRoutes from './routes/work-order-service.routes';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(bodyParser.json());

// CORS configuration
const defaultOrigins = ['http://localhost:4200'];
const envOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin or tools without origin (e.g., curl, server-side)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Selección de motor de base de datos por variable de entorno
// Unificado a DB_ENGINE, manteniendo DB_TYPE como alias por compatibilidad
const dbType = ((process.env.DB_ENGINE || process.env.DB_TYPE) as DBType) || 'mysql';
const sequelize = getSequelize(dbType);

// Initialize all models with the same sequelize instance
// Note: User and RefreshToken use getSequelize() internally, 
// which should return the same instance
initUserModel(sequelize);
initRoleModel(sequelize);
initUserRoleModel(sequelize);
initRefreshTokenModel(sequelize);
initPasswordResetTokenModel(sequelize);
initClientModel(sequelize);
initAppointmentModel(sequelize);
initInsuranceModel(sequelize);
initMechanicModel(sequelize);
initPartModel(sequelize);
initPaymentModel(sequelize);
initServiceModel(sequelize);
initVehicleModel(sequelize);
initWorkOrderModel(sequelize);
initWorkOrderPartModel(sequelize);
initWorkOrderServiceModel(sequelize);

// Asociaciones (includes User and RefreshToken associations)
import './models/associations';

sequelize.authenticate()
  .then(() => {
    console.log(`Conectado a la base de datos (${dbType})`);
    // Sync all models including User and RefreshToken
    return sequelize.sync();
  })
  .then(async () => {
    console.log('Modelos sincronizados');
    // Ensure default roles exist and map existing users to roles
    try {
      const defaultRoleNames = ['ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CLIENT'];
      for (const name of defaultRoleNames) {
        await Role.findOrCreate({ where: { name }, defaults: { name } });
      }

      // Map existing users (legacy enum field) to the new roles relation
      const users = await User.findAll();
      for (const u of users) {
        try {
          // Only add relation if the user doesn't already have it
          if (typeof (u as any).getRoles === 'function') {
            const roles = await (u as any).getRoles({ attributes: ['name'] });
            const current = new Set((roles || []).map((r: any) => r.name));
            const target = String((u as any).role || '').toUpperCase();
            if (target && !current.has(target) && defaultRoleNames.includes(target)) {
              const [role] = await Role.findOrCreate({ where: { name: target }, defaults: { name: target } });
              await (u as any).addRole(role);
            }
          }
        } catch {}
      }
      console.log('Roles por defecto verificados y mapeo de usuarios completado');
    } catch (e) {
      console.warn('No se pudieron crear/verificar roles por defecto:', e);
    }
  })
  .catch((err: any) => {
    console.error('Error de conexión:', err);
  });

app.get('/', (req, res) => {
  res.send('MecanixPro Backend API');
});

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/clients', clientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/insurances', insuranceRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/work-order-parts', workOrderPartRoutes);
app.use('/api/work-order-services', workOrderServiceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
