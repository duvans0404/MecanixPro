import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';

// Clientes
import { ClientsGetallComponent } from './components/clients/clients-getall/clients-getall.component';
import { ClientsCreateComponent } from './components/clients/clients-create/clients-create.component';
import { ClientsUpdateComponent } from './components/clients/clients-update/clients-update.component';

// Vehículos
import { VehiclesGetallComponent } from './components/vehicles/vehicles-getall/vehicles-getall.component';
import { VehiclesCreateComponent } from './components/vehicles/vehicles-create/vehicles-create.component';
import { VehiclesUpdateComponent } from './components/vehicles/vehicles-update/vehicles-update.component';

// Servicios
import { ServicesGetallComponent } from './components/services/services-getall/services-getall.component';
import { ServicesCreateComponent } from './components/services/services-create/services-create.component';
import { ServicesUpdateComponent } from './components/services/services-update/services-update.component';

// Repuestos
import { PartsGetallComponent } from './components/parts/parts-getall/parts-getall.component';
import { PartsCreateComponent } from './components/parts/parts-create/parts-create.component';
import { PartsUpdateComponent } from './components/parts/parts-update/parts-update.component';

// Citas
import { AppointmentGetallComponent } from './components/appointments/appointment-getall/appointment-getall.component';
import { AppointmentCreateComponent } from './components/appointments/appointment-create/appointment-create.component';
import { AppointmentUpdateComponent } from './components/appointments/appointment-update/appointment-update.component';

// Seguros
import { InsuranceGetallComponent } from './components/insurance/insurance-getall/insurance-getall.component';
import { InsuranceCreateComponent } from './components/insurance/insurance-create/insurance-create.component';
import { InsuranceUpdateComponent } from './components/insurance/insurance-update/insurance-update.component';

// Mecánicos
import { MechanicGetallComponent } from './components/mechanics/mechanic-getall/mechanic-getall.component';
import { MechanicCreateComponent } from './components/mechanics/mechanic-create/mechanic-create.component';
import { MechanicUpdateComponent } from './components/mechanics/mechanic-update/mechanic-update.component';

// Pagos
import { PaymentGetallComponent } from './components/payments/payment-getall/payment-getall.component';
import { PaymentCreateComponent } from './components/payments/payment-create/payment-create.component';
import { PaymentUpdateComponent } from './components/payments/payment-update/payment-update.component';

// Órdenes de Trabajo
import { WorkOrderGetallComponent } from './components/work-orders/work-order-getall/work-order-getall.component';
import { WorkOrderCreateComponent } from './components/work-orders/work-order-create/work-order-create.component';
import { WorkOrderUpdateComponent } from './components/work-orders/work-order-update/work-order-update.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  
  // Rutas de Clientes
  { path: 'clients', component: ClientsGetallComponent },
  { path: 'clients/create', component: ClientsCreateComponent },
  { path: 'clients/update/:id', component: ClientsUpdateComponent },
  
  // Rutas de Vehículos
  { path: 'vehicles', component: VehiclesGetallComponent },
  { path: 'vehicles/create', component: VehiclesCreateComponent },
  { path: 'vehicles/update/:id', component: VehiclesUpdateComponent },
  
  // Rutas de Servicios
  { path: 'services', component: ServicesGetallComponent },
  { path: 'services/create', component: ServicesCreateComponent },
  { path: 'services/update/:id', component: ServicesUpdateComponent },
  
  // Rutas de Repuestos
  { path: 'parts', component: PartsGetallComponent },
  { path: 'parts/create', component: PartsCreateComponent },
  { path: 'parts/update/:id', component: PartsUpdateComponent },
  
  // Rutas de Citas
  { path: 'appointments', component: AppointmentGetallComponent },
  { path: 'appointments/create', component: AppointmentCreateComponent },
  { path: 'appointments/update/:id', component: AppointmentUpdateComponent },
  
  // Rutas de Seguros
  { path: 'insurance', component: InsuranceGetallComponent },
  { path: 'insurance/create', component: InsuranceCreateComponent },
  { path: 'insurance/update/:id', component: InsuranceUpdateComponent },
  
  // Rutas de Mecánicos
  { path: 'mechanics', component: MechanicGetallComponent },
  { path: 'mechanics/create', component: MechanicCreateComponent },
  { path: 'mechanics/update/:id', component: MechanicUpdateComponent },
  
  // Rutas de Pagos
  { path: 'payments', component: PaymentGetallComponent },
  { path: 'payments/create', component: PaymentCreateComponent },
  { path: 'payments/update/:id', component: PaymentUpdateComponent },
  
  // Rutas de Órdenes de Trabajo
  { path: 'work-orders', component: WorkOrderGetallComponent },
  { path: 'work-orders/create', component: WorkOrderCreateComponent },
  { path: 'work-orders/update/:id', component: WorkOrderUpdateComponent },
  
  { path: '**', redirectTo: '/dashboard' }
];