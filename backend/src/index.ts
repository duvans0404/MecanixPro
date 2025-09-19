
import express from 'express';
import bodyParser from 'body-parser';
import { getSequelize, DBType } from './config';
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

const app = express();
app.use(bodyParser.json());

// Selección de motor de base de datos por variable de entorno
const dbType = (process.env.DB_TYPE as DBType) || 'mysql';
const sequelize = getSequelize(dbType);

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

// Asociaciones
import './models/associations';

sequelize.authenticate()
  .then(() => {
    console.log(`Conectado a la base de datos (${dbType})`);
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados');
  })
  .catch((err: any) => {
    console.error('Error de conexión:', err);
  });

app.get('/', (req, res) => {
  res.send('MecanixPro Backend API');
});


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
